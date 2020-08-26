import React, { ReactElement } from 'react';
import {
  BarChartItem,
  Scales,
  Dimensions,
  Margins,
  ClippingsKey,
} from './types';

interface BarsProps {
  data: BarChartItem[];
  scales: Scales;
  svgDimensions: Dimensions;
  margins: Margins;
  clippings: ClippingsKey;
  color: string;
  clipId: string;
  getHoverBarIdx?: (idx: number | null) => void;
  borderColor?: string;
}

const Bars = ({
  data,
  scales,
  svgDimensions,
  margins,
  clippings,
  color,
  borderColor,
  clipId,
  getHoverBarIdx,
}: BarsProps): ReactElement => {
  const { xScale, yScale } = scales;
  const { height } = svgDimensions;

  const clippingsAtIdx = (idx: number) => {
    if (
      idx === 0 &&
      (clippings === ClippingsKey.Left || clippings === ClippingsKey.Both)
    ) {
      return `url(#clipping-left-${clipId})`;
    }
    if (
      idx === data.length - 1 &&
      (clippings === ClippingsKey.Right || clippings === ClippingsKey.Both)
    ) {
      return `url(#clipping-right-${clipId})`;
    }
    return '';
  };

  let barStyle: React.CSSProperties | undefined = undefined;

  if (borderColor) {
    barStyle = { strokeWidth: 1, stroke: color };
  }

  const bars = data.map((x: BarChartItem, idx: number) => (
    <rect
      key={x.key.toString()}
      x={xScale(x.key)}
      y={yScale(x.value)}
      height={height - margins.bottom - scales.yScale(x.value)}
      width={xScale.bandwidth()}
      fill={`url(#${color})`}
      clipPath={clippingsAtIdx(idx)}
      rx={2}
      ry={2}
      onMouseOver={() => {
        getHoverBarIdx && getHoverBarIdx(idx);
      }}
      onMouseOut={() => {
        getHoverBarIdx && getHoverBarIdx(null);
      }}
      style={barStyle}
    />
  ));

  return <g>{bars}</g>;
};

export default Bars;
