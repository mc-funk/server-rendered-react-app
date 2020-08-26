import { fillEmptyDatas, simplifyArrayByFactor } from './chart';
import moment from 'moment';
import { BarChartItem } from 'ui/types';

const bypass = [
  { key: moment('2018-12-31'), value: 91.6 },
  { key: moment('2019-01-07'), value: 624.3 },
  { key: moment('2019-01-14'), value: 402.4 },
  { key: moment('2019-01-21'), value: 943.3 },
  { key: moment('2019-01-28'), value: 149.1 },
];

const undefinedData = undefined;
const emptyData: BarChartItem[] = [];

const emptyWeeks = [
  {
    key: moment('2019-01-05').startOf('isoWeek').add(0, 'week'),
    value: 0,
  },
  {
    key: moment('2019-01-05').startOf('isoWeek').add(1, 'week'),
    value: 0,
  },
  {
    key: moment('2019-01-05').startOf('isoWeek').add(2, 'week'),
    value: 0,
  },
  {
    key: moment('2019-01-05').startOf('isoWeek').add(3, 'week'),
    value: 0,
  },
  {
    key: moment('2019-01-05').startOf('isoWeek').add(4, 'week'),
    value: 0,
  },
];

const partial = [
  { key: moment('2018-12-31'), value: 91.6 },
  { key: moment('2019-01-14'), value: 402.4 },
  { key: moment('2019-01-28'), value: 149.1 },
];

const filled = [
  { key: moment('2018-12-31'), value: 91.6 },
  {
    key: moment('2019-01-05').startOf('isoWeek').add(1, 'week'),
    value: 0,
  },
  { key: moment('2019-01-14'), value: 402.4 },
  {
    key: moment('2019-01-05').startOf('isoWeek').add(3, 'week'),
    value: 0,
  },
  { key: moment('2019-01-28'), value: 149.1 },
];

const partialEnds = [
  { key: moment('2019-01-07'), value: 624.3 },
  { key: moment('2019-01-14'), value: 402.4 },
  { key: moment('2019-01-21'), value: 943.3 },
];

const filledEnds = [
  {
    key: moment('2019-01-05').startOf('isoWeek').add(0, 'week'),
    value: 0,
  },
  { key: moment('2019-01-07'), value: 624.3 },
  { key: moment('2019-01-14'), value: 402.4 },
  { key: moment('2019-01-21'), value: 943.3 },
  {
    key: moment('2019-01-05').startOf('isoWeek').add(4, 'week'),
    value: 0,
  },
];

describe('fillEmptyDatas', () => {
  it('should bypass and return the input, given a time period that has no data gaps.', () => {
    expect(
      fillEmptyDatas(bypass, moment('2019-01-05'), moment('2019-01-29'))
    ).toEqual(bypass);
  });
  it('should handle undefined data and return a list of empty weeks', () => {
    expect(
      fillEmptyDatas(undefinedData, moment('2019-01-05'), moment('2019-01-29'))
    ).toEqual(emptyWeeks);
  });
  it('should handle empty data and return a list of empty weeks', () => {
    expect(
      fillEmptyDatas(emptyData, moment('2019-01-05'), moment('2019-01-29'))
    ).toEqual(emptyWeeks);
  });
  it('should handle a week with some data, but not all.', () => {
    expect(
      fillEmptyDatas(partial, moment('2019-01-05'), moment('2019-01-29'))
    ).toEqual(filled);
  });
  it('should handle a week with some data, but not all. Empties on the ends.', () => {
    expect(
      fillEmptyDatas(partialEnds, moment('2019-01-05'), moment('2019-01-29'))
    ).toEqual(filledEnds);
  });
});

describe('simplifyArrayByFactor', () => {
  it('should handle empty array', () => {
    expect(simplifyArrayByFactor([], 0)).toEqual([]);
    expect(simplifyArrayByFactor([], 1000)).toEqual([]);
  });
  it('should handle non-whole factors', () => {
    expect(simplifyArrayByFactor(['a', 'b', 'c'], 0.1234)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });
  it('should simplify by factor', () => {
    expect(simplifyArrayByFactor(['a', 'b', 'c'], 0)).toEqual([]);
    expect(simplifyArrayByFactor(['a', 'b', 'c'], 1)).toEqual(['a', 'b', 'c']);
    expect(simplifyArrayByFactor(['a', 'b', 'c'], 2)).toEqual(['a', 'c']);
    expect(simplifyArrayByFactor(['a', 'b', 'c', 'd', 'e', 'f'], 3)).toEqual([
      'a',
      'd',
    ]);
  });
});
