import React from 'react';
import * as core from '@pluralsight/ps-design-system-core';

type Props = {
  x?: number;
  y?: number;
  text?: string;
  style?: Record<string, unknown>;
  fontSize?: string;
  fontWeight?: number | string;
};

export function CustomLabel(props: Props) {
  const HEIGHT = 24;

  const { x, y } = props;
  const labelText = props.text ? props.text : '';
  const rectWidth = labelText.length * 9 + 10;
  const style = props.style ? props.style : { fill: 'rgb(85, 85, 85)' };
  const textStyle = {
    fontWeight: props.fontWeight ? props.fontWeight : core.type.fontWeightBold,
    fontSize: props.fontSize ? props.fontSize : '12px',
    fontFamily: core.type.fontFamily,
  };
  return (
    <g transform={`translate(${x}, ${(y || 0) - HEIGHT / 2})`}>
      <rect
        x={0}
        y={0}
        width={rectWidth}
        height={HEIGHT}
        rx={12}
        ry={12}
        style={style}
      />
      <text
        x={12}
        y={16}
        fill={core.colorsTextIcon.highOnLight}
        alignmentBaseline="baseline"
        fontSize={props.fontSize}
      >
        <tspan {...textStyle} letterSpacing="0.2px">
          {labelText.split(' ')[0]}
        </tspan>{' '}
        <tspan {...textStyle} letterSpacing="0.2px">
          {labelText.split(' ')[1]}
        </tspan>
      </text>
    </g>
  );
}

export default CustomLabel;
