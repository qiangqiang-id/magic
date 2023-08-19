import {
  calcRotatedPoint,
  RectData,
  Coordinate,
  BaseRectData,
} from '@p/EditorTools';
import { calcPhysicsPonitByFlip } from '@/helpers/Crop';

interface StartCenter {
  startMaskCenter: Coordinate;
  startRectCenter: Coordinate;
}

export default class CropMove {
  /**  开始图片信息 */
  private rectData: RectData;

  /** 开始mask信息 */
  private maskData: BaseRectData;

  /** 开始鼠标信息 */
  private startMouseData: Coordinate;

  /** 开始 mask 旋转后的物理坐标 */
  private maskPhysicsPoint: Coordinate;

  /** 旋转角度 */
  private angle: number;

  constructor(
    rectData: RectData,
    maskData: BaseRectData,
    angle: number,
    mouseData: Coordinate
  ) {
    this.rectData = rectData;
    this.maskData = { ...maskData };
    this.startMouseData = mouseData;
    this.angle = angle;
    this.maskPhysicsPoint = this.getStartMaskPhysicsPoint();
  }

  /** 获取开始 mask 旋转后的物理坐标 */
  private getStartMaskPhysicsPoint(): Coordinate {
    const { x, y, width, height } = this.maskData;
    const center = {
      x: x + width / 2,
      y: y + height / 2,
    };
    return calcRotatedPoint({ x, y }, center, this.angle);
  }

  public moveHandler(mouseData): Coordinate {
    const diffX = mouseData.x - this.startMouseData.x;
    const diffY = mouseData.y - this.startMouseData.y;

    /** 最大 最小 移动范围 */
    const minLeft = 0;
    const maxLeft = this.rectData.width - this.maskData.width;
    const minTop = 0;
    const maxTop = this.rectData.height - this.maskData.height;

    const { startMaskCenter, startRectCenter } = this.getStartCenter();

    // 图片移动的位置信息
    const newMaskPhysicsPoint = {
      x: this.maskPhysicsPoint.x + diffX,
      y: this.maskPhysicsPoint.y + diffY,
    };

    const newMaskCenter = {
      x: startMaskCenter.x + diffX,
      y: startMaskCenter.y + diffY,
    };
    const newMaskPoint = calcRotatedPoint(
      newMaskPhysicsPoint,
      startRectCenter,
      -this.angle
    );
    // 转弧度
    const radian = this.angle * (Math.PI / 180);

    const list = [newMaskPhysicsPoint, newMaskCenter];
    const { x: physicsX, y: physicsY } = calcPhysicsPonitByFlip(this.rectData);

    // 控制mask 的x，y 在原图的范围内部
    let projectionX = newMaskPoint.x - physicsX;
    if (projectionX < minLeft || projectionX > maxLeft) {
      projectionX = (projectionX < minLeft ? minLeft : maxLeft) - projectionX;
      list.forEach(item => {
        item.x += Math.cos(radian) * projectionX;
        item.y += Math.sin(radian) * projectionX;
      });
    }

    let projectionY = newMaskPoint.y - physicsY;
    if (projectionY < minTop || projectionY > maxTop) {
      projectionY = (projectionY < minTop ? minTop : maxTop) - projectionY;
      list.forEach(item => {
        item.x -= Math.sin(radian) * projectionY;
        item.y += Math.cos(radian) * projectionY;
      });
    }

    return calcRotatedPoint(newMaskPhysicsPoint, newMaskCenter, -this.angle);
  }

  // 获取开始原图和mask的中心点
  private getStartCenter(): StartCenter {
    const {
      x: rectX,
      y: rectY,
      width: rectW,
      height: rectH,
      anchor = { x: 0, y: 0 },
    } = this.rectData;
    const { x: maskX, y: maskY, width: maskW, height: maskH } = this.maskData;

    const startRectCenter = {
      x: rectX + rectW * anchor.x,
      y: rectY + rectH * anchor.y,
    };
    const startMaskCenter = {
      x: maskX + maskW * 0.5,
      y: maskY + maskH * 0.5,
    };
    return {
      startMaskCenter,
      startRectCenter,
    };
  }
}
