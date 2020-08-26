import { ajax } from 'rxjs/ajax';
import * as ajx from 'utils/ajax';
import { TestScheduler } from 'rxjs/testing';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

jest.mock('rxjs/ajax', () => ({
  ajax: jest.fn(),
}));

const mockedAjax = (ajax as unknown) as jest.Mock;

const getTestScheduler = () =>
  new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

beforeEach(() => {
  mockedAjax.mockClear();
});

describe('canary zero-time tests', () => {
  // Just a quick test to make sure observables work the way we (I?) think they do
  test('raw observable proof of concept', () => {
    getTestScheduler().run(({ expectObservable }) => {
      const $testStream = of(1, 2, 3, 4).pipe(
        map((x) => {
          if (x == 2) {
            throw '500 error';
          }
          return x;
        }),
        catchError(() => of('I', 'II'))
      );

      const expected = '(abc|)';
      expectObservable($testStream).toBe(expected, {
        a: 1,
        b: 'I',
        c: 'II',
      });
    });
  });

  // If we hit the API and it comes back successfully, we shouldn't experience any problems.
  test('first-time success should be ok', () => {
    getTestScheduler().run((helpers) => {
      const { cold, expectObservable } = helpers;

      // Setup what we expect our fake API response to look like
      const fakeAPICalls = () =>
        cold('--r', {
          r: {
            response: {
              previous: null,
              next: null,
              count: 0,
              results: [],
            },
            responseType: 'json',
          },
        });

      mockedAjax.mockImplementation(fakeAPICalls);

      expectObservable(ajx.getJSON('test')).toBe('--r', {
        r: {
          previous: null,
          next: null,
          count: 0,
          results: [],
        },
      });
    });
  });

  // If we hit the API, and it fails, we should try again with the X-Canary options.
  test('first-time failure should trigger X-Canary', () => {
    getTestScheduler().run((helpers) => {
      const { cold, expectObservable, flush } = helpers;

      mockedAjax.mockImplementation(
        ({
          url,
          headers,
        }: {
          url: string;
          headers?: Record<string, unknown>;
        }) => {
          if (url === 'test') {
            if (headers && headers['X-Canary'] === 'insider') {
              return cold('----r', {
                r: {
                  response: { data: 'object' },
                  responseType: 'json',
                },
              });
            }
          }
          return cold('--#', undefined, { status: 500 });
        }
      );

      // Test raw observables
      expectObservable(
        ajax({ url: 'test', headers: { 'X-Canary': 'insider' } })
      ).toBe('----r', {
        r: { response: { data: 'object' }, responseType: 'json' },
      });
      expectObservable(ajax({ url: 'test' })).toBe('--#', undefined, {
        status: 500,
      });

      // Clear mocks for the next part
      mockedAjax.mockClear();

      // Test combination
      expectObservable(ajx.getJSON('test')).toBe('------r', {
        r: {
          data: 'object',
        },
      });
      flush();
      expect(mockedAjax).toBeCalledTimes(2);
    });
  });

  // BUT, if we hit the API and get a standard 404 error, we should only see things called 1 time.
  test('first-time failure should *not* re-try for *non*-500 errors', () => {
    getTestScheduler().run((helpers) => {
      const { cold, expectObservable, flush } = helpers;

      mockedAjax.mockImplementation(() => {
        return cold('--#', undefined, { status: 404 });
      });

      // Test combination
      expectObservable(ajx.getJSON('test')).toBe('--#', undefined, {
        status: 404,
      });
      flush();
      expect(mockedAjax).toBeCalledTimes(1);
    });
  });

  // If we hit X-Canary and things are still not functioning correctly, we bubble up the error properly.
  test('X-Canary failure should bubble up', () => {
    getTestScheduler().run((helpers) => {
      const { cold, expectObservable, flush } = helpers;

      mockedAjax.mockImplementation(
        ({
          url,
          headers,
        }: {
          url: string;
          headers?: Record<string, unknown>;
        }) => {
          if (url === 'test') {
            if (headers && headers['X-Canary'] === 'insider') {
              return cold('----#', undefined, { status: 500 });
            }
          }
          return cold('--#', undefined, { status: 500 });
        }
      );

      // Test raw observables
      expectObservable(
        ajax({ url: 'test', headers: { 'X-Canary': 'insider' } })
      ).toBe('----#', undefined, {
        status: 500,
      });
      expectObservable(ajax({ url: 'test' })).toBe('--#', undefined, {
        status: 500,
      });

      // Clear mocks for the next part
      mockedAjax.mockClear();

      // Test combination
      expectObservable(ajx.getJSON('test')).toBe('------#', undefined, {
        status: 500,
      });
      flush();
      expect(mockedAjax).toBeCalledTimes(2);
    });
  });
});
