import React, { useState, useEffect } from 'react';
import * as d3Axis from 'd3-axis';
import { select as d3Select } from 'd3-selection';
import { css } from 'glamor';
import * as core from '@pluralsight/ps-design-system-core';
import { BaseReport } from 'ui/types';

export enum Orientation {
  Bottom = 0,
  Left = 1,
}

const style = css({
  '& text': {
    fontFamily: core.type.fontFamily,
    fontSize: core.type.fontSizeXSmall,
    textTransform: 'uppercase',
    fill: core.colorsTextIcon.lowOnDark,
  },
});

interface AxisProps<T> {
  orient: Orientation;
  scale: d3Axis.AxisScale<T>;
  translate: string;
  metric?: BaseReport;
  tickFormat: (domainValue: d3Axis.AxisDomain) => string;
  xTickValues?: T[];
  getXLabelWidth?: (n: number) => void;
}

function Axis<T extends d3Axis.AxisDomain>({
  orient,
  scale,
  translate,
  tickFormat,
  xTickValues,
  getXLabelWidth,
}: AxisProps<T>) {
  const [axisElement, setAxisElement] = useState<SVGGElement | null>(null);

  useEffect(() => {
    let baseAxis = d3Axis.axisBottom;

    if (orient === Orientation.Left) {
      baseAxis = d3Axis.axisLeft;
    }

    if (getXLabelWidth) {
      // Sends largest label width up to parent component.
      const labels = axisElement
        ? Array.prototype.slice.call(axisElement.querySelectorAll('g'))
        : []; // Convert node list to array.
      const largestWidth = Math.ceil(
        Math.max(...labels.map((l) => l.getBBox().width))
      ); // Rounds up to whole pixel.
      getXLabelWidth(largestWidth);
    }

    const axis =
      xTickValues !== undefined
        ? baseAxis<T>(scale)
            .ticks(4) // Not working.
            .tickPadding(10)
            .tickSize(0)
            .tickFormat(tickFormat)
            .tickValues(xTickValues) // Hack, ticks() method not working.
        : baseAxis<T>(scale)
            .ticks(4)
            .tickPadding(10)
            .tickSize(0)
            .tickFormat(tickFormat);

    if (axisElement !== null) {
      d3Select(axisElement)
        .call(axis)
        .call((g) => g.select('.domain').remove()); // removes axis lines.
    }
  }, [axisElement, scale]);

  return (
    <g
      {...style}
      className={`Axis Axis-${orient}`}
      transform={translate}
      ref={(el) => setAxisElement(el)}
    ></g>
  );
}

export default Axis;
