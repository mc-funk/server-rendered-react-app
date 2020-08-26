import React, { useState, useEffect, MutableRefObject, useRef } from 'react';
import { Dimensions } from './types';

interface Props {
  initialDimensions: Dimensions;
  render: (dimensions: Dimensions) => React.ReactNode;
}

function useResponsiveContainer(
  container: MutableRefObject<HTMLDivElement | null>,
  minSize: Dimensions
) {
  const [svgDimensions, setDimensions] = useState(minSize);
  const [containerWidth, setContainerWidth] = useState(0);

  const onResize = () => {
    if (container && container.current) {
      const currentContainerWidth = container.current.getBoundingClientRect()
        .width;
      if (currentContainerWidth != containerWidth) {
        setContainerWidth(currentContainerWidth);
        setDimensions({
          width: Math.max(minSize.width, currentContainerWidth),
          height: minSize.height,
        });
      }
    }
  };

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return svgDimensions;
}

const ResponsiveContainer = ({ initialDimensions, render }: Props) => {
  const el = useRef<HTMLDivElement>(null);

  const dimensions = useResponsiveContainer(el, initialDimensions);

  return <div ref={el}>{render(dimensions)}</div>;
};

export { ResponsiveContainer as default, useResponsiveContainer, Props };
