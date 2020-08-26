import React from 'react';
import Clip from '../Clip';
import {
  BarChartItem,
  Margins,
  Scales,
  Dimensions,
  ClippingsKey,
} from './types';

interface Props {
  data: BarChartItem[];
  scales: Scales;
  svgDimensions: Dimensions;
  margins: Margins;
  direction: ClippingsKey;
  maxDelta?: number;
  clipId: string;
}

const Clippings = ({
  data,
  scales,
  svgDimensions,
  margins,
  direction,
  maxDelta,
  clipId,
}: Props) => {
  const { xScale, yScale } = scales;
  const { height } = svgDimensions;

  const clippings = [];

  if (data.length === 0) {
    return null;
  }

  if (direction === ClippingsKey.Left || direction === ClippingsKey.Both) {
    const yHeight = yScale(data[0].value);
    clippings.push(
      <clipPath
        rx={4}
        ry={4}
        id={`clipping-left-${clipId}`}
        key={`clipping-left-${clipId}`}
      >
        <Clip
          maxDeltaX={maxDelta || 10}
          maxDeltaY={maxDelta || 10}
          direction="right"
          height={height - margins.bottom - yHeight}
          width={xScale.bandwidth()}
          left={xScale(data[0].key) || 0}
          top={yHeight}
        />
      </clipPath>
    );
  }

  if (direction === ClippingsKey.Right || direction === ClippingsKey.Both) {
    const yHeight = yScale(data[data.length - 1].value);
    clippings.push(
      <clipPath
        rx={4}
        ry={4}
        id={`clipping-right-${clipId}`}
        key={`clipping-right-${clipId}`}
      >
        <Clip
          maxDeltaX={maxDelta || 10}
          maxDeltaY={maxDelta || 10}
          direction="left"
          height={height - margins.bottom - yHeight}
          width={xScale.bandwidth()}
          left={xScale(data[data.length - 1].key) || 0}
          top={yHeight}
        />
      </clipPath>
    );
  }

  if (clippings.length > 0) {
    return <defs>{clippings}</defs>;
  }

  return null;
};

export default Clippings;
