import React, { useRef, useState, useMemo } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { Moment } from 'moment';

import {
  colorsBackgroundLight,
  type,
  colorsBackgroundDark,
} from '@pluralsight/ps-design-system-core';

import GradientPSDS from 'ui/charts/Gradient';
import Clippings from 'ui/charts/BarChart/Clippings';
import { makeRandomId } from 'utils/makeRandomId';
import { BaseReport } from 'ui/types';
import { LineValue } from 'utils/calculations';
import { getBarPadding, simplifyArrayByFactor } from 'utils/chart';
import { BaseMetrics } from 'state/types';

import { BarChartItem, ClippingsKey } from 'ui/charts/BarChart/types';
import Axes from 'ui/charts/BarChart/Axes';
import Bars from 'ui/charts/BarChart/Bars';
import { useResponsiveContainer } from 'ui/charts/BarChart/ResponsiveContainer';
import ChartTooltip from 'ui/charts/ChartTooltip';

import WeekInProgress from './WeekInProgress';
import Benchmarks, { Benchmark } from './Benchmarks';
import AverageLine from './AverageLine';
import TargetLine from './TargetLine';
import CustomLabel from './CustomLabel';
import TrendLine from './TrendLine';

interface Props {
  color: string;
  lineValues: { value: number; key: string }[];
  averageValue?: number;
  data: BarChartItem[];
  clippings: ClippingsKey;
  benchmarks?: Benchmark[];
  trendLineValues?: LineValue[];
  children?: React.ReactElement[];
  metric?: BaseReport;
  thisWeek: boolean;
}

const LargeChart = React.memo(function LargeChart<T extends BaseMetrics>({
  color,
  data,
  lineValues,
  averageValue,
  clippings,
  benchmarks,
  trendLineValues,
  children,
  metric,
  thisWeek,
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const minSize = { width: 300, height: 300 };
  const svgDimensions = useResponsiveContainer(el, minSize);
  const [hoverBarIdx, setHoverBarIdx] = useState<number | null>(null);
  const [xLabelWidth, setXLabelWidth] = useState(0);

  // TODO: for small screens, attempt to rotate the labels using the following
  // transformation if things get too small:
  // translate(20px, 10px) rotate(45deg)
  // Note to self: order matters. the translation must be done first in order to rotate in the correct spot.

  const margins = {
    top: 20,
    right: 225,
    bottom: 35,
    left: 50,
  };

  const maxValue = Math.max(...data.map((d) => d.value));

  const barPad = useMemo(() => getBarPadding(data.length, 1, 70, 0.1, 0.7), [
    data.length,
  ]);

  const xScale = scaleBand<Moment>()
    .padding(barPad)
    .domain(data.map((d) => d.key))
    .range([margins.left, svgDimensions.width - margins.right]);

  const halfBand = xScale.bandwidth() / 2;

  const yScale = scaleLinear<number>()
    .domain([
      0,
      maxValue || 1,
    ]) /* A zero maxValue causes bars in UI to appear with "zero" data. */
    .range([svgDimensions.height - margins.bottom, margins.top]);

  const getHoverBarIdx = (idx: number | null) => {
    if (idx !== hoverBarIdx) {
      setHoverBarIdx(idx);
    }
  };

  const getXLabelWidth = (n: number) => {
    if (n !== xLabelWidth) {
      setXLabelWidth(n);
    }
  };

  const factor = xLabelWidth / xScale.bandwidth();
  const simplifiedXTickValues = simplifyArrayByFactor<Moment>(
    xScale.domain(),
    factor
  );

  return (
    <div
      ref={el}
      style={{
        background:
          'linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, #1E2429 100%)',
        borderRadius: 4,
        position: 'relative',
      }}
    >
      {metric ? (
        <ChartTooltip
          data={data}
          hoverBarIdx={hoverBarIdx}
          metric={metric}
          yScale={yScale}
          xScale={xScale}
          clippings={clippings}
        />
      ) : null}

      <svg width={svgDimensions.width} height={svgDimensions.height}>
        {children}
        {benchmarks ? (
          <Benchmarks
            dimensions={svgDimensions}
            margins={margins}
            yScale={yScale}
            benchmarks={benchmarks}
            width={100}
          />
        ) : null}

        <Axes
          scales={{ xScale, yScale }}
          margins={margins}
          xTickValues={simplifiedXTickValues}
          getXLabelWidth={getXLabelWidth}
          svgDimensions={svgDimensions}
          metric={metric}
        />

        <Bars
          data={data}
          scales={{ xScale, yScale }}
          svgDimensions={svgDimensions}
          margins={margins}
          clippings={clippings}
          color={color}
          clipId="bigchart"
          getHoverBarIdx={getHoverBarIdx}
        />

        {data && data.length > 4 && trendLineValues && (
          <TrendLine
            x1={
              margins.left +
              (clippings === ClippingsKey.Left ||
              clippings === ClippingsKey.Both
                ? halfBand * 3
                : halfBand)
            }
            y1={yScale(trendLineValues[0].y)}
            x2={
              svgDimensions.width -
              margins.right -
              (clippings === ClippingsKey.Right ||
              clippings === ClippingsKey.Both
                ? halfBand * 3
                : halfBand)
            }
            y2={yScale(trendLineValues[1].y)}
          />
        )}

        {averageValue && (
          <AverageLine
            totalWidth={svgDimensions.width - margins.right}
            yAxisWidth={margins.left}
            y={yScale(averageValue)}
          />
        )}

        {lineValues.map((lv) => {
          let outValue: string = Math.round(lv.value).toString();
          if (metric?.unit === '%') {
            outValue = `${Math.round(lv.value * 100).toString()}%`;
          }
          return (
            <g key={`LV_${lv.key}_${lv.value}_${makeRandomId(3)}`}>
              <TargetLine
                margins={margins}
                svgDimensions={svgDimensions}
                y={yScale(lv.value)}
              />
              <CustomLabel
                x={margins.left + 5}
                y={yScale(lv.value)}
                text={`${outValue} ${lv.key}`}
                style={{ fill: colorsBackgroundLight[3] }} // tag needs to be white with black text
                fontSize={type.fontSizeXSmall}
                fontWeight={type.fontWeightMedium}
              />
            </g>
          );
        })}

        {/* There need to be 30px between WeekInProgress and the chart
                Per Jen, pass in "false" in as essentially commenting it out just in case we want to bring it back
                */}
        {thisWeek && false && (
          <WeekInProgress
            margins={margins}
            dimensions={svgDimensions}
            value={20}
            yScale={yScale}
            color={color}
          />
        )}

        {/* Definitions */}
        <Clippings
          svgDimensions={svgDimensions}
          scales={{ xScale, yScale }}
          data={data}
          margins={margins}
          direction={clippings}
          maxDelta={10}
          clipId="bigchart"
        />

        <GradientPSDS
          gradient1={color}
          gradient2={colorsBackgroundDark[3]}
          id={color}
        />
        <GradientPSDS
          gradient1={'rgba(0, 0, 0, 0.15)'}
          gradient2={colorsBackgroundDark[3]}
          id="background"
        />
      </svg>
    </div>
  );
});

export { LargeChart as default, Props };
