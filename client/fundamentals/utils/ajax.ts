import { ajax, AjaxResponse } from 'rxjs/ajax';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

let FLOW_FUNDAMENTALS_USE_X_CANARY = false;

const getHeaders = (headers?: Record<string, unknown>) => {
  if (FLOW_FUNDAMENTALS_USE_X_CANARY) {
    return {
      ...headers,
      'X-Canary': 'insider',
    };
  }
  return headers;
};

const getJSON = <T>(
  url: string,
  headers?: Record<string, unknown>
): Observable<T> => {
  const options = () => ({
    url,
    withCredentials: true,
    headers: getHeaders(headers),
  });

  const mapCallback = (r: AjaxResponse) => {
    if (r.responseType === 'json') {
      return r.response;
    } else {
      return throwError('Received a non-JSON response');
    }
  };

  const $stream = ajax(options()).pipe(
    map(mapCallback),
    catchError((e) => {
      if (e.status === 500) {
        FLOW_FUNDAMENTALS_USE_X_CANARY = !FLOW_FUNDAMENTALS_USE_X_CANARY;
        return ajax(options()).pipe(map(mapCallback));
      }

      // For non-500 responses, bubble up the error anyways.
      return throwError(e);
    })
  );

  return $stream;
};

export { getJSON };
