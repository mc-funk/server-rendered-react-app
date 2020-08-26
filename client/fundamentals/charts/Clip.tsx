import React, { memo } from 'react';

type Direction = 'left' | 'right';

const makeRandomDelta = (max: number) => () =>
  Math.max(max / 1.75, Math.random() * max);

const Clip = ({
  direction,
  height,
  width,
  left,
  top,
  maxDeltaX,
  maxDeltaY,
}: {
  direction: Direction;
  height: number;
  width: number;
  left: number;
  top: number;
  maxDeltaX: number;
  maxDeltaY: number;
}) => {
  let x, sign;
  const y = top;
  if (direction === 'left') {
    // start on left when direction is left
    x = left;
    sign = 1;
  } else {
    // start on right when direction is right
    x = left + width;
    sign = -1;
  }
  const randomDeltaX = makeRandomDelta(maxDeltaX);
  const randomDeltaY = makeRandomDelta(maxDeltaY);
  const bottom = height + top;
  // first point after top is on opposite side, random distance from end of bar
  let point = [x + sign * width + -1 * sign * randomDeltaX(), y];
  const points = [[x, y], point];
  // every iteration adds a point that is a random distance from edge and random distance from previous y,
  // and a point that returns to the original x positon but a random distance from the previous y, until
  // y reaches the bottom
  while (point[1] < bottom) {
    const deltaX = -1 * sign + randomDeltaX();
    const deltaY = randomDeltaY();
    const newX = point[0] + deltaX;
    const newY = point[1] + deltaY;
    points.push([newX, newY]);
    point = [point[0], Math.min(bottom, newY + randomDeltaY())];
    points.push(point);
  }
  // finish by returning to the origin by way of the bottom corner at either the right or left
  points.push([x, bottom], [x, y]);
  return <polygon points={points.map((p) => p.join(',')).join(' ')} />;
};

export default memo(Clip);
