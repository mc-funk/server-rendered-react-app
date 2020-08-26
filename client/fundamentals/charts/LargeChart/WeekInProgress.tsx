import React from 'react';

import { Dimensions, Margins } from '../../types';

import * as core from '@pluralsight/ps-design-system-core';

interface Props {
  value: number;
  yScale: (v: number) => number;
  color: string;
  dimensions: Dimensions;
  margins: Margins;
}

const BAR_WIDTH = 45;
const LINE_STROKE = 2;
const CIRCLE_RADIUS = 6;
const TEXT_HEIGHT = 16;
const OPACITY = 0.3;

const TEXT_WIDTH = 90;
const RIGHT_MARGIN = 65;

const WeekInProgress = ({
  value,
  yScale,
  margins,
  dimensions,
  color,
}: Props) => {
  const y = yScale(value);
  const x = dimensions.width - TEXT_WIDTH - RIGHT_MARGIN;
  const height = dimensions.height - margins.bottom - margins.top;

  return (
    <g transform={`translate(${x}, ${margins.top})`}>
      <text
        y={height + TEXT_HEIGHT}
        x={BAR_WIDTH / 2}
        textAnchor="middle"
        fill={core.colorsTextIcon.highOnDark}
      >
        This Week
      </text>
      <text
        y={height + TEXT_HEIGHT * 2}
        x={BAR_WIDTH / 2}
        textAnchor="middle"
        fill={core.colorsTextIcon.lowOnDark}
      >
        In Progress
      </text>
      <rect
        x={0}
        y={0}
        height={height}
        width={BAR_WIDTH}
        fill={`url(#${color})`}
        style={{ opacity: OPACITY }}
      />

      <line
        x1={0}
        y1={y}
        x2={BAR_WIDTH}
        y2={y}
        style={{ stroke: color, strokeWidth: LINE_STROKE }}
      />
      <circle cx={BAR_WIDTH / 2} cy={y} r={CIRCLE_RADIUS} fill={color} />
    </g>
  );
};

export default WeekInProgress;
