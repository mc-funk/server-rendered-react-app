import React from 'react';
import { colorsOrange } from '@pluralsight/ps-design-system-core';

type Props = {
  totalWidth: number;
  yAxisWidth: number;
  y: number;
};

const AverageLine = ({ totalWidth, yAxisWidth, y }: Props) => {
  const POLYGON_WIDTH = 8;
  const AXIS_WIDTH = 0;

  const length = totalWidth - yAxisWidth - POLYGON_WIDTH - AXIS_WIDTH;
  return (
    <g
      fill={colorsOrange.base}
      stroke={colorsOrange.base}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      transform={`translate(${yAxisWidth + POLYGON_WIDTH + AXIS_WIDTH}, ${y})`}
    >
      {/* Triangle icon */}
      <polygon points="-1,0 -6,-7 -6,7" />
      {/* Line */}
      <line x1={0} x2={length} y1={0} y2={0} />
    </g>
  );
};

export default AverageLine;
