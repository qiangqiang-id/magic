export interface Coordinate {
  /** x轴坐标 */
  x: number;
  /** y轴坐标 */
  y: number;
}

export interface BaseRectData extends Coordinate {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
}

export interface RectData extends BaseRectData {
  /** 蒙层数据 */
  mask?: BaseRectData;
  /** 锚点数据 */
  anchor?: Coordinate;
  /** 翻转数据 */
  scale?: Coordinate;
  /** 旋转角度 */
  rotate?: number;
}

export type Size = Omit<BaseRectData, 'x' | 'y'>;
