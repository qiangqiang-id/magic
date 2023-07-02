import { RectData, Coordinate } from '../types/Editor';
import { getMaskInCanvasRectData } from '../helper/math';
import ScaleHandler from './ScaleHandler';
import type { ScaleHandlerOptions } from './ScaleHandler';
import { POINT_TYPE } from '../enum/point-type';

export default class MaskContainScaleHandler {
  /** 矩形数据 */
  private readonly rectData: RectData;

  /** 拉伸函数实例 */
  private scaleHandler: ScaleHandler;

  constructor(
    rectData: RectData,
    pointType: POINT_TYPE,
    options: ScaleHandlerOptions
  ) {
    this.rectData = rectData;
    this.scaleHandler = new ScaleHandler(
      getMaskInCanvasRectData(this.rectData),
      pointType,
      options
    );
  }

  /**
   * 拉伸
   *  */
  public onScale(mousePosition: Coordinate): RectData {
    const newMaskDataInEditArea = this.scaleHandler.onScale(mousePosition);

    const { width, height } = this.rectData;
    const rateW = newMaskDataInEditArea.width / width;
    const rateH = newMaskDataInEditArea.height / height;

    const rate = Math.min(rateW, rateH);
    /** 新宽高 */
    const newWidth = width * rate;
    const newHeight = height * rate;

    /** 让图片居中显示 */
    const offsetX = (newWidth - newMaskDataInEditArea.width) / 2;
    const offsetY = (newHeight - newMaskDataInEditArea.height) / 2;
    /** 新坐标 */
    const newX = newMaskDataInEditArea.x + -offsetX;
    const newY = newMaskDataInEditArea.y + -offsetY;

    return {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
      mask: {
        width: newMaskDataInEditArea.width,
        height: newMaskDataInEditArea.height,
        x: offsetX,
        y: offsetY,
      },
      anchor: { x: 0.5, y: 0.5 },
    };
  }
}
