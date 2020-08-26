import moment, { Moment } from 'moment';
import { DateRange } from 'moment-range';
import { BarChartItem } from 'ui/types';

/* Mostly lifted & tweaked from the monolith. */

export type timestamp = number;

export type XY = {
  x: timestamp;
  y: number;
};

export type LinearRegressionResult = {
  slope: number;
  intercept: number;
};

const dropWhile = <T>(arr: Array<T>, func: (a: T) => boolean): Array<T> => {
  while (arr.length > 0 && func(arr[0])) arr = arr.slice(1);
  return arr;
};

export const translateRange = (
  daterange: DateRange
): { start: number; end: number } => ({
  start: daterange.start.valueOf(),
  end: daterange.end.clone().endOf('day').valueOf(),
});

export const barChartDataToXYArr = (data: BarChartItem[] | undefined) =>
  data && data.map((d: BarChartItem) => ({ x: d.key.valueOf(), y: d.value }));

/**
 * Computes the linear regression params for the given data set.
 * Taken and adjusted from
 * http://trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/
 *
 */
function linearRegression(data: Array<XY>): LinearRegressionResult | undefined {
  const n = data.length;
  if (!n) {
    return undefined;
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  data.forEach((d) => {
    const x = d.x;
    const y = d.y;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

/**
 * Computes a trend line function (basically a linear regression) that will help to plot
 * trendlines.  When passed (x, y) pairs, will compute the best line indicating the trend
 * of those points.  The input may contain "holes".  Either nothing will be returned, or
 * a function describing the trend line.  To use it, call it on any X value, and you'll
 * get the corresponding Y value at that point on the trend line.  To plot a line, you'd
 * typically call y0 = trendFn(x0) and y1 = trendFn(x1) to find the line points.
 */
export function trendline(
  data: Array<XY>
): ((n: number) => number) | null | undefined {
  // Make sure the pairs are sorted before we start (order really matters
  // when it comes to trend lines :))
  data.sort((a: XY, b: XY) => a.x - b.x);
  // HACK: Eat away any zeroes leading up to the data set
  data = [...dropWhile<XY>(data, (d: XY) => d.y <= 0)];

  /* This check came with code from the monolith. Is being checked elsewhere currently */
  // if (data.length < 4) {
  //     // Not enough data to make a meaningful trend line
  //     return undefined;
  // }

  const linreg = linearRegression(data);
  if (!linreg) return undefined;
  return (t) => linreg.intercept + t * linreg.slope;
}

export interface Trend {
  value: number | undefined;
  fn: ((n: number) => number) | undefined;
}

export function getTrend(
  data: Array<XY> | undefined,
  daterange: DateRange
): Trend {
  const emptyTrend = { value: undefined, fn: undefined };
  if (!data) return emptyTrend;
  const { start, end } = translateRange(daterange);
  // Filter data for weeks that are outside of range. The x value is the end of the week (1 ms before midnight).
  // For testing against the beginning of the range, add subtract a week and add 1 ms to make it the next day.
  // We need to do this because the range is actually 1 ms less than a full week because it starts at 00:00 the
  // first day and ends at 11:59:59:999 the last day
  const trendData = data.filter(
    ({ x }) =>
      moment(x).subtract(7, 'days').add(1, 'millisecond').valueOf() >= start &&
      x <= end
  );
  const trendFn = trendline(trendData);
  // trendFn is undefined if trendData.length < 4
  if (!trendFn) {
    return emptyTrend;
  }

  const y0 = trendFn(trendData[0].x);
  const y1 = trendFn(trendData.slice(-1)[0].x);
  const delta = 100 * ((y1 - y0) / (Math.max(y0, 0) || 1));
  return { value: delta, fn: trendFn };
}

/* Trend line points */

type Domain = { x: Moment[]; y: number[] };

export type LineValue = {
  x: moment.Moment;
  y: number;
};

export const domainFromDateRange = (
  dateRange: DateRange,
  metricUnit: string | undefined,
  maxYValue: number
): Domain => {
  const { start: startX, end: endX } = translateRange(dateRange);
  return {
    x: [
      moment(startX).isoWeekday(0).endOf('day'), // use the end of the day because the data is indexed to the last day, which ends at the end of the day
      moment(endX).isoWeekday(7).endOf('day'),
    ],
    // if metric unit is percentage, the domain of the Y(dependent) axis should
    // range from 0 to the max value of 'y' on the graph.
    y: [0, maxYValue * 1.05],
    // @TODO: below from the monolith, but not working.
    // y: metricUnit && metricUnit === '%'
    //     ? [0, Math.min(1, Math.ceil((maxYValue + 0.1) * 10) / 10)]
    //     : [0, maxYValue * 1.05],
  };
};

export const getTrendLineValues = (
  trendFn: ((n: number) => number) | undefined,
  trendData: Array<XY> | undefined,
  domain: Domain
): LineValue[] | undefined => {
  if (trendFn === undefined || trendData === undefined || domain === undefined)
    return;
  const trendStartX = moment(trendData[0].x)
    .subtract(0.5, 'weeks')
    .add(12, 'hours');
  const trendEndX = moment(trendData.slice(-1)[0].x)
    .subtract(0.5, 'weeks')
    .add(12, 'hours');

  const y1 = trendFn ? Math.max(0, trendFn(trendStartX.valueOf())) : 0;
  const y2 = trendFn ? Math.max(0, trendFn(trendEndX.valueOf())) : 0;

  return [
    { x: trendStartX, y: y1 > domain.y[1] ? domain.y[1] : y1 },
    { x: trendEndX, y: y2 > domain.y[1] ? domain.y[1] : y2 },
  ];
};
