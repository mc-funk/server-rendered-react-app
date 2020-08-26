import React, { useMemo, useRef } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';

import { BarChartItem, Dimensions, ClippingsKey } from '../BarChart/types';
import Bars from '../BarChart/Bars';
import Clippings from '../BarChart/Clippings';
import Gradient from '../Gradient';
import { useResponsiveContainer } from '../BarChart/ResponsiveContainer';
import { makeRandomId } from '../../utils/makeRandomId';
import moment, { Moment } from 'moment';
import { getBarPadding } from '../../utils/chart';

interface Props {
  data: BarChartItem[];
  color: string;
  dimensions: Dimensions;
  clippings: ClippingsKey;
  onClick?: () => unknown;
}

const SmallChart = React.memo(function SmallChart({
  data,
  dimensions,
  color,
  clippings,
  onClick,
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const svgDimensions = useResponsiveContainer(el, dimensions);
  const clipId = useMemo(() => makeRandomId(4), []);

  const maxValue = Math.max(...data.map((d) => d.value));

  const margins = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };

  const barPad = getBarPadding(data.length, 1, 70, 0.2, 0.9);

  const xScale = scaleBand<Moment>()
    .padding(barPad)
    .domain(data.map((d) => moment(d.key)))
    .range([margins.left, dimensions.width - margins.right]);

  const yScale = scaleLinear<number>()
    .domain([
      0,
      maxValue || 1,
    ]) /* A zero maxValue causes bars in UI to appear with "zero" data. */
    .range([dimensions.height - margins.bottom, margins.top]);

  return (
    <div ref={el} onClick={onClick}>
      <svg width={svgDimensions.width} height={svgDimensions.height}>
        <Bars
          data={data}
          scales={{ yScale, xScale }}
          margins={margins}
          clippings={clippings}
          svgDimensions={svgDimensions}
          color={color}
          clipId={clipId}
        />
        <Gradient
          gradient1={color}
          gradient2={color}
          gradient2StopOpacity={0}
          id={color}
        />
        <Clippings
          data={data}
          scales={{ yScale, xScale }}
          svgDimensions={svgDimensions}
          margins={margins}
          direction={clippings}
          maxDelta={5}
          clipId={clipId}
        />
      </svg>
    </div>
  );
});

export { SmallChart as default, Props };
