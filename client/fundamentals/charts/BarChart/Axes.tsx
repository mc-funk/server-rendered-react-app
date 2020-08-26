import React, { ReactElement } from 'react';

import Axis, { Orientation } from './Axis';
import { Scales, Margins, Dimensions } from './types';
import { BaseReport } from '../../types';
import { AxisDomain } from 'd3-axis';
import moment, { Moment } from 'moment';

export interface AxesProps {
  scales: Scales;
  margins: Margins;
  svgDimensions: Dimensions;
  metric?: BaseReport;
  xTickValues?: Moment[];
  getXLabelWidth?: (n: number) => void;
}

const Axes = ({
  scales,
  margins,
  svgDimensions,
  metric,
  xTickValues,
  getXLabelWidth,
}: AxesProps): ReactElement => {
  const { height } = svgDimensions;
  const { xScale, yScale } = scales;

  const xProps = {
    orient: Orientation.Bottom,
    scale: xScale,
    translate: `translate(${xScale.bandwidth() / 2}, ${
      height - margins.bottom
    })`,
    tickFormat: (domainValue: AxisDomain) =>
      moment(domainValue.toString()).format('MMM D'),
    xTickValues,
    getXLabelWidth,
  };
  const yProps = {
    orient: Orientation.Left,
    scale: yScale,
    translate: `translate(${margins.left}, 0)`,
    metric,
    tickFormat: (domainValue: AxisDomain) =>
      `${domainValue}${(metric && metric.unit) || ''}`,
  };
  return (
    <g>
      <Axis {...xProps} />
      <Axis {...yProps} />
    </g>
  );
};

export default Axes;
