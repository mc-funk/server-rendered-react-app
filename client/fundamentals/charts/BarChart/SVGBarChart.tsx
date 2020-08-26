import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';

import Axes from './Axes';
import Bars from './Bars';
import Clippings from './Clippings';
import { BarChartItem, Dimensions, ClippingsKey } from './types';
import moment, { Moment } from 'moment';

interface InnerBarChartProps {
  data: BarChartItem[];
  showAxes: boolean;
  svgDimensions: Dimensions;
}

const InnerBarChart = ({
  data,
  showAxes,
  svgDimensions,
}: InnerBarChartProps) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  const margins = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };

  const xScale = scaleBand<Moment>()
    .padding(0.1)
    .domain(data.map((d) => moment(d.key)))
    .range([margins.left, svgDimensions.width - margins.right]);

  const yScale = scaleLinear<number>()
    .domain([0, maxValue])
    .range([svgDimensions.height - margins.bottom, margins.top]);

  return (
    <React.Fragment>
      {showAxes && (
        <Axes
          scales={{ xScale, yScale }}
          margins={margins}
          svgDimensions={svgDimensions}
        />
      )}
      <Bars
        data={data}
        scales={{ xScale, yScale }}
        svgDimensions={svgDimensions}
        margins={margins}
        clippings={ClippingsKey.Both}
        color="blue"
        clipId="svg"
      />
      <Clippings
        svgDimensions={svgDimensions}
        scales={{ xScale, yScale }}
        data={data}
        margins={margins}
        direction={ClippingsKey.Both}
        clipId="svg"
      />
    </React.Fragment>
  );
};

export default InnerBarChart;
