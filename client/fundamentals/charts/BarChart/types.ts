import { ScaleBand, ScaleLinear } from 'd3-scale';
import { Moment } from 'moment';

export interface Margins {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface BarChartItem {
  key: Moment;
  value: number;
}

export interface Scales {
  xScale: ScaleBand<Moment>;
  yScale: ScaleLinear<number, number>;
}

export enum ClippingsKey {
  Left,
  Right,
  Both,
  None,
}
