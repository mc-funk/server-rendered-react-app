import React from 'react';

type Props = {
  x1: number | undefined;
  y1: number | undefined;
  x2: number | undefined;
  y2: number | undefined;
};

const TrendLine = ({ x1, y1, x2, y2 }: Props) => {
  return (
    <g
      fill={'#fff'}
      stroke={'#fff'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={x1} cy={y1} r="4" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <circle cx={x2} cy={y2} r="4" />
    </g>
  );
};

export default TrendLine;
