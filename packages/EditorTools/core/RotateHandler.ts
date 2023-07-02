import { RectData, Coordinate } from '../types/Editor';
import {
  toAngle,
  getRectCenter,
  getMaskInCanvasRectData,
} from '../helper/math';

export default class RotateHandler {
  /** 旋转角度 */
  private readonly startRotate: number;
  /** 矩形数据 */
  private readonly rectCenterData: Coordinate;
  /** 鼠标在画布中开始坐标 */
  private readonly mouseStartData: Coordinate;

  constructor(rectData: RectData, mouseStartData: Coordinate, angle: number) {
    /** 计算可视区域到画布的矩形信息，也就是mask到基于画布的信息 */
    rectData = getMaskInCanvasRectData(rectData);
    this.rectCenterData = getRectCenter(rectData);
    this.mouseStartData = mouseStartData;
    this.startRotate = angle;
  }

  /**
   * 旋转
   * */
  public onRotate(mousePosition: Coordinate): number {
    const { x: centerX, y: centerY } = this.rectCenterData;
    const { x: startX, y: startY } = this.mouseStartData;
    /** 旋转前的角度 */
    const rotateDegreeBefore = toAngle(
      Math.atan2(startY - centerY, startX - centerX)
    );
    /** 旋转后的角度 */
    const rotateDegreeAfter = toAngle(
      Math.atan2(mousePosition.y - centerY, mousePosition.x - centerX)
    );

    /** 获取旋转的角度值，需要加上开始的角度*/
    return rotateDegreeAfter - rotateDegreeBefore + this.startRotate;
  }
}
