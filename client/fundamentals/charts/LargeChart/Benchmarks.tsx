import React from 'react';

import * as core from '@pluralsight/ps-design-system-core';

import { Dimensions, Margins } from '../../types';
import { colorsBackgroundUtility } from '@pluralsight/ps-design-system-core';

interface SingleTargetBenchmark {
  key: string;
  value: number;
}
export type Benchmark = SingleTargetBenchmark | number[];

interface Props {
  benchmarks: Benchmark[];
  dimensions: Dimensions;
  margins: Margins;
  yScale: (value: number) => number;
  width: number;
}

const LINE_HEIGHT = 16;
const AXIS_WIDTH = 1;

const SingleTargetBenchmark = ({
  b,
  yScale,
  margins,
  dimensions,
  width,
}: Omit<Props, 'benchmarks'> & { b: SingleTargetBenchmark }) => {
  const middleY = yScale(b.value);
  const topY = middleY - LINE_HEIGHT / 2;

  return (
    <g>
      <rect
        x={margins.left + AXIS_WIDTH}
        y={topY}
        width={dimensions.width - margins.left}
        height={LINE_HEIGHT}
        fill={colorsBackgroundUtility[25]}
      />
      <text
        y={middleY + 1}
        x={dimensions.width - width - 35}
        width={100}
        fill={core.colorsTextIcon.lowOnDark}
        dominantBaseline="middle"
      >
        <tspan fontWeight={core.type.fontWeightBook}>{b.value}</tspan> {b.key}
      </text>
    </g>
  );
};

const RangeBenchmark = ({
  b,
  yScale,
  margins,
  dimensions,
  width,
}: Omit<Props, 'benchmarks'> & { b: number[] }) => {
  const ys = b.map(yScale);

  return (
    <g>
      <rect
        x={margins.left + AXIS_WIDTH}
        y={ys[1]}
        width={dimensions.width - margins.left}
        height={ys[1] - ys[0]}
        fill={colorsBackgroundUtility[25]}
      />
      <text
        y={ys[1] + (ys[0] - ys[1]) / 2 - 6.5}
        x={dimensions.width - width}
        width={100}
        fill={core.colorsTextIcon.lowOnDark}
        dominantBaseline="central"
      >
        <tspan fontWeight={core.type.fontWeightBook}>Typical range</tspan>
      </text>
    </g>
  );
};

const Benchmarks = ({ benchmarks, ...props }: Props) => {
  return (
    <g>
      {benchmarks.map((b, idx) => {
        if (Array.isArray(b)) {
          return (
            <RangeBenchmark key={`Benchmark_Range_${idx}`} b={b} {...props} />
          );
        }
        return (
          <SingleTargetBenchmark
            key={`Benchmark_${b.key}_${b.value}`}
            b={b}
            {...props}
          />
        );
      })}
    </g>
  );
};

export default Benchmarks;
