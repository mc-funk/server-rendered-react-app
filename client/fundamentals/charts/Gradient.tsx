import React from 'react';

const GradientPSDS = ({
  gradient1,
  gradient2,
  id,
  gradient1StopOpacity = 1,
  gradient2StopOpacity = 1,
}: {
  gradient1: string;
  gradient2: string;
  id: string;
  gradient1StopOpacity?: number;
  gradient2StopOpacity?: number;
}) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop
        offset={0}
        stopColor={gradient1}
        stopOpacity={gradient1StopOpacity}
      />
      <stop
        offset={1}
        stopColor={gradient2}
        stopOpacity={gradient2StopOpacity}
      />
    </linearGradient>
  </defs>
);

export default GradientPSDS;
