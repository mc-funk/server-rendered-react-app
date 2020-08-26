import React, { ReactElement } from 'react';

import { colorsBlue } from '@pluralsight/ps-design-system-core';

import InnerBarChart from './SVGBarChart';

import './BarChart.css';
import GradientPSDS from '../Gradient';
import { BarChartItem, Dimensions } from './types';
import ResponsiveContainer from './ResponsiveContainer';

interface Props {
  data: BarChartItem[];
  showAxes: boolean;
  children: React.ReactNode;
}

const BarChart = (props: Props): ReactElement => {
  const maxSize = { width: 800, height: 500 };

  return (
    <ResponsiveContainer
      initialDimensions={maxSize}
      render={(svgDimensions: Dimensions) => (
        <svg width={svgDimensions.width} height={svgDimensions.height}>
          <InnerBarChart svgDimensions={svgDimensions} {...props} />
          <GradientPSDS
            gradient1={colorsBlue.base}
            gradient2="#000"
            id="blue"
          />
          {props.children}
        </svg>
      )}
    />
  );
};

export { BarChart as default, Props };
