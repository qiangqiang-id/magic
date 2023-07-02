/** 范围 */
export type Range = [number, number];

/**
 * 磁力线数据格式
 */
export interface LineData {
  value: number;
  range: Range;
}

export interface MagneticLineType {
  direction: 'x' | 'y';
  axis: { x: number; y: number };
  length: number;
}
