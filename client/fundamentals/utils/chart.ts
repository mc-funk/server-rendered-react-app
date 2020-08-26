import { ClippingsKey, BarChartItem } from 'ui/charts/BarChart/types';
import moment, { Moment } from 'moment';

export const getBarPadding = (
  barCount: number,
  minBars: number,
  maxBars: number,
  minPad: number,
  maxPad: number
) => {
  if (barCount <= minBars) return minPad;
  if (barCount >= maxBars) return maxPad;
  const padding = (barCount * (maxPad - minPad)) / (maxBars - minBars) + minPad;
  return Number(padding.toFixed(2));
};

export const clippingsKeyFromDateRange = (
  start: Moment,
  end: Moment
): ClippingsKey => {
  const MONDAY = 1;
  const SUNDAY = 0;
  if (start.weekday() === MONDAY && end.weekday() === SUNDAY)
    return ClippingsKey.None;
  if (start.weekday() === MONDAY && end.weekday() !== SUNDAY)
    return ClippingsKey.Right;
  if (start.weekday() !== MONDAY && end.weekday() === SUNDAY)
    return ClippingsKey.Left;
  return ClippingsKey.Both;
};

/* Removes elements between factors. */
export const simplifyArrayByFactor = function <T>(
  arr: T[],
  factor: number
): T[] {
  return arr.filter((_, i) => i % Math.ceil(factor) === 0);
};

export const getTooltipPosition = (
  width: number,
  height: number,
  barPosTop: number,
  barPosLeft: number,
  barHalfWidth: number
) => {
  const top = Math.round(barPosTop) - Math.round(height) - 10;
  const left =
    Math.round(barPosLeft) - Math.round(width / 2) + Math.round(barHalfWidth);
  return {
    top: Math.round(top),
    left: Math.round(left),
  };
};

const createZeroedPeriod = (
  expectedWeekCount: number,
  nearestPrevPeriodStart: Moment
) => {
  const zeroedPeriodData = [];
  for (let i = 0; i < expectedWeekCount; i++) {
    const currentPeriodStart = nearestPrevPeriodStart.clone().add(i, 'week');
    zeroedPeriodData.push({ key: currentPeriodStart, value: 0 });
  }
  return zeroedPeriodData;
};
/* Data received from API doesn't contain empty weeks: Calculate expected weeks and fill in the gaps with empty values. */
export const fillEmptyDatas = (
  data: BarChartItem[] | undefined,
  start: Moment,
  end: Moment
) => {
  const nearestPrevPeriodStart = start.clone().startOf('isoWeek');
  const nearestNextPeriodEnd = end.clone().endOf('isoWeek');
  const expectedWeekCount =
    nearestNextPeriodEnd.diff(nearestPrevPeriodStart, 'week') + 1;
  const zeroedPeriodData = createZeroedPeriod(
    expectedWeekCount,
    nearestPrevPeriodStart
  );

  if (data === undefined || (data && data.length === 0)) {
    return zeroedPeriodData;
  } else {
    return expectedWeekCount === data.length
      ? data
      : zeroedPeriodData.map((zeroPeriod) => {
          const matchingPeriod = data.find((period) =>
            period.key.isSame(zeroPeriod.key, 'week')
          );
          return matchingPeriod || zeroPeriod;
        });
  }
};

/*
 * API data comes in batches called periods. A period is always Monday - Sunday.
 * Displaying that to the user is confusing, so this function remedies by swapping out
 * the first period start date with the actual, user-requested, start date.
 */
export const setFirstPeriodToStartDate = (
  data: BarChartItem[],
  startDate: Moment
) =>
  data.map((d, i) =>
    i === 0 ? { ...d, key: moment(startDate.format('YYYY-MM-DD')) } : d
  );
