import { Margins, Dimensions } from '../BarChart/types';
import React from 'react';

interface Props {
  margins: Margins;
  svgDimensions: Dimensions;
  y: number;
}

const TargetLine = ({ margins, svgDimensions, y }: Props) => {
  return (
    <line
      x1={margins.left}
      y1={y}
      x2={svgDimensions.width - margins.right}
      y2={y}
      style={{ stroke: '#fff', strokeWidth: 2, strokeDasharray: 2 }}
    />
  );
};

export { TargetLine as default, Props };
