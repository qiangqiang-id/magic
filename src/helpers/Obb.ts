import { toRadian } from '@p/EditorTools';

/**
 * 2d 向量
 */
export class Vector2d {
  x: number;

  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /** 若b为单位矢量，则a与b的点积即为a在方向b的投影 */
  sub(v: Vector2d) {
    return new Vector2d(this.x - v.x, this.y - v.y);
  }

  /** 向量点积 */
  dot(v: Vector2d) {
    return this.x * v.x + this.y * v.y;
  }
}

/**
 * obb 碰撞
 **/
export class OBB {
  /** 宽 */
  width: number;

  /** 高 */
  height: number;

  /** 弧度 */
  radian: number;

  /** 范围 */
  extents: [number, number];

  /** 旋转轴 */
  axes: [Vector2d, Vector2d];

  /** 中心点 */
  centerPoint: Vector2d;

  constructor(
    centerPoint: Vector2d,
    width: number,
    height: number,
    rotate = 0
  ) {
    this.radian = toRadian(rotate);
    this.centerPoint = centerPoint;
    this.extents = [width / 2, height / 2];
    this.axes = [
      new Vector2d(Math.cos(this.radian), Math.sin(this.radian)),
      new Vector2d(-1 * Math.sin(this.radian), Math.cos(this.radian)),
    ];
    this.width = width;
    this.height = height;
  }

  /** 获取投影半径 */
  getProjectionRadius(axis: Vector2d) {
    return (
      this.extents[0] * Math.abs(axis.dot(this.axes[0])) +
      this.extents[1] * Math.abs(axis.dot(this.axes[1]))
    );
  }
}
