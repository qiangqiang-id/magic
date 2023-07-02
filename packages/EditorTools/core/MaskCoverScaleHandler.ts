import { POINT_TYPE } from '../enum/point-type';
import type { ScaleHandlerOptions } from './ScaleHandler';
import { BaseRectData, RectData, Coordinate } from '../types/Editor';
import { calcRotatedPoint, getMaskInCanvasRectData } from '../helper/math';
import { isCenterPoint, keepDecimal } from '../helper/utils';
import ScaleHandler from './ScaleHandler';

export default class MaskScale {
  /** 矩形数据 */
  private readonly startRectData: RectData;

  /** 锚点 */
  private readonly anchor: Coordinate;

  /** 翻转 */
  private readonly flip: Coordinate;

  /** 蒙层数据 */
  private readonly startMaskData: BaseRectData;

  /** 当前拉伸的位置点  */
  private readonly pointType: POINT_TYPE;

  /** 旋转角度 */
  private readonly angle: number;

  /** 左上角物理位置 */
  private startRectPositionForRotated: Coordinate;

  /** 拉伸函数实例 */
  private scaleHandler: ScaleHandler;

  constructor(
    rectData: RectData,
    pointType: POINT_TYPE,
    options: ScaleHandlerOptions
  ) {
    const { width, height, mask, rotate = 0, anchor, flip } = rectData;
    this.angle = rotate;
    this.pointType = pointType;
    this.anchor = anchor || { x: 0.5, y: 0.5 };
    this.flip = flip || { x: 1, y: 1 };
    this.startMaskData = mask || { x: 0, y: 0, width, height };
    this.startRectData = rectData;
    this.startRectPositionForRotated = this.getStartRectPositionForRotated();

    this.scaleHandler = new ScaleHandler(
      getMaskInCanvasRectData(this.startRectData),
      pointType,
      options
    );
  }

  /**
   * 计算开始左上角的物理位置
   *  */
  private getStartRectPositionForRotated(): Coordinate {
    const { x, y, width, height } = this.startRectData;
    const { anchor } = this;
    /** 中心点 */
    const centerPoint = {
      x: x + width * anchor.x,
      y: y + height * anchor.y,
    };
    return calcRotatedPoint({ x, y }, centerPoint, this.angle);
  }

  /**
   * 根据mask中心点的变化，和开始旋转后原图左上角的位置，重新计算原图位置
   * */
  private resetRectPosition(newMaskDataInEditArea: BaseRectData): Coordinate {
    const { x, y, width, height } = newMaskDataInEditArea;
    const currentCenterPoint = {
      x: x + width / 2,
      y: y + height / 2,
    };

    return calcRotatedPoint(
      {
        x: this.startRectPositionForRotated.x,
        y: this.startRectPositionForRotated.y,
      },
      currentCenterPoint,
      -this.angle
    );
  }

  /**
   * 拉伸
   *  */
  public onScale(mousePosition: Coordinate): RectData {
    const newMaskDataInEditArea = this.scaleHandler.onScale(mousePosition);

    /** 中心点发生变化重新计算rect 的位置 , 保证统一旋转点 */
    const newRectPosition = this.resetRectPosition(newMaskDataInEditArea);

    const rectData = this.calcRectData(newMaskDataInEditArea, newRectPosition);
    const maskData = this.calcMaskDataInRect(newMaskDataInEditArea, rectData);

    /** 重新计算锚点 */
    const anchor = {
      x: (maskData.x + maskData.width / 2) / rectData.width,
      y: (maskData.y + maskData.height / 2) / rectData.height,
    };

    return {
      mask: maskData,
      ...rectData,
      anchor,
    };
  }

  /**
   * 计算原图数据
   *  */
  private calcRectData(
    newMaskDataInEditArea: BaseRectData,
    newRectPosition: Coordinate
  ): BaseRectData {
    if (isCenterPoint(this.pointType)) {
      return this.dragCenterPoint(newMaskDataInEditArea, newRectPosition);
    }
    return this.dragAroundPoint(newMaskDataInEditArea, newRectPosition);
  }

  /**
   * 拖动中心点
   *  */
  private dragCenterPoint(
    newMaskDataInEditArea: BaseRectData,
    newRectPosition: Coordinate
  ): BaseRectData {
    let result: BaseRectData;

    const { width: startRectW, height: startRectH } = this.startRectData;
    const {
      x: startMaskX,
      y: startMaskY,
      width: startMaskW,
      height: startMaskH,
    } = this.startMaskData;

    const {
      startRectRightBottom,
      startRectLeftTop,
      startMaskLeftTop,
      startMaskCenterInRect,
      startMaskCenterInEditArea,
      startMaskRigthBottom,
    } = this.getBaseData(newRectPosition);

    const isMaskInRect = this.isMaskInRect(
      newMaskDataInEditArea,
      newRectPosition
    );

    const { x: flipX, y: flipY } = this.flip;

    if (isMaskInRect) {
      /** 滑动的过快，会导致更新不过来，手动回到原始大小 */
      const { width, height } = this.startRectData;
      result = {
        width,
        height,
        x: newRectPosition.x,
        y: newRectPosition.y,
      };

      if (flipX < 0) {
        // eslint-disable-next-line default-case
        switch (this.pointType) {
          case POINT_TYPE.RIGHT_CENTER: {
            /** 计算mask x轴 扩大的长度 */
            result.x +=
              newMaskDataInEditArea.x +
              newMaskDataInEditArea.width -
              startMaskRigthBottom.x;
            break;
          }
          case POINT_TYPE.LEFT_CENTER: {
            result.x -= startMaskLeftTop.x - newMaskDataInEditArea.x;
            break;
          }
        }
      }
      if (flipY < 0) {
        // eslint-disable-next-line default-case
        switch (this.pointType) {
          case POINT_TYPE.BOTTOM_CENTER: {
            result.y +=
              newMaskDataInEditArea.y +
              newMaskDataInEditArea.height -
              startMaskRigthBottom.y;
            break;
          }
          case POINT_TYPE.TOP_CENTER: {
            result.y -= startMaskLeftTop.y - newMaskDataInEditArea.y;
            break;
          }
        }
      }
    } else {
      /**  矩形开始的宽高比 */
      const startRectSizeRate = startRectH / startRectW;

      switch (this.pointType) {
        case POINT_TYPE.RIGHT_CENTER: {
          /** mask 和 rect 同比例缩放，弥补宽度 */
          const maskWidthDiff =
            flipX > 0
              ? startRectRightBottom.x - startMaskRigthBottom.x
              : startMaskLeftTop.x - startRectLeftTop.x;
          const startWidthRate = startRectW / (startMaskW + maskWidthDiff);
          const width = newMaskDataInEditArea.width * startWidthRate;
          const height = width * startRectSizeRate;
          const diffH = height - startRectH;

          /** x 的距离也是需要同比例增大 */
          const rateW = width / startRectW;
          const maskStartX = startMaskX - newRectPosition.x;
          const diffMaskX =
            flipX > 0
              ? startMaskX * rateW - startMaskX
              : startMaskX - maskStartX - newMaskDataInEditArea.x;

          const anchorY = startMaskCenterInRect.y / startRectH;

          result = {
            x: newRectPosition.x - diffMaskX,
            y: newRectPosition.y - diffH * anchorY,
            width,
            height,
          };
          break;
        }

        case POINT_TYPE.LEFT_CENTER: {
          const maskWidthDiff =
            flipX > 0
              ? startMaskLeftTop.x - startRectLeftTop.x
              : startRectRightBottom.x - startMaskRigthBottom.x;
          const startWidthRate = startRectW / (startMaskW + maskWidthDiff);

          const width = newMaskDataInEditArea.width * startWidthRate;
          const height = width * startRectSizeRate;
          const diffH = height - startRectH;

          /** 开始右侧的差距 */
          const diff = startRectRightBottom.x - startMaskRigthBottom.x;
          /** mask 的开始坐标，应该是和rect 的x 重合的时候。 */
          const maskStartX = startMaskX - newRectPosition.x;
          /** 物理位置  x轴 y轴 */
          const physicsX =
            startMaskCenterInEditArea.x -
            (startRectRightBottom.x - startMaskCenterInEditArea.x);
          const diffMaskX =
            flipX > 0
              ? startMaskX - maskStartX - newMaskDataInEditArea.x
              : physicsX - newMaskDataInEditArea.x + diff;
          const anchorY = startMaskCenterInRect.y / startRectH;

          result = {
            x: newRectPosition.x - diffMaskX,
            y: newRectPosition.y - diffH * anchorY,
            width,
            height,
          };
          break;
        }
        case POINT_TYPE.BOTTOM_CENTER: {
          const maskHeightDiff =
            flipY > 0
              ? startRectRightBottom.y - startMaskRigthBottom.y
              : startMaskLeftTop.y - startRectLeftTop.y;
          const startHeightRate = startRectH / (startMaskH + maskHeightDiff);

          const height = newMaskDataInEditArea.height * startHeightRate;
          const width = height / startRectSizeRate;
          const diffW = width - startRectW;

          /** y 的距离也是需要同比例增大 */
          const rateW = height / startRectH;
          const maskStartY = startMaskY - newRectPosition.y;
          const diffMaskY =
            flipY > 0
              ? startMaskY * rateW - startMaskY
              : startMaskY - maskStartY - newMaskDataInEditArea.y;

          const anctorX = startMaskCenterInRect.x / startRectW;

          result = {
            x: newRectPosition.x - diffW * anctorX,
            y: newRectPosition.y - diffMaskY,
            height,
            width,
          };
          break;
        }

        // case POINT_TYPE.TOP_CENTER:
        default: {
          const maskHeightDiff =
            flipY > 0
              ? startMaskLeftTop.y - startRectLeftTop.y
              : startRectRightBottom.y - startMaskRigthBottom.y;
          const startHeightRate = startRectH / (startMaskH + maskHeightDiff);
          const height = newMaskDataInEditArea.height * startHeightRate;
          const width = height / startRectSizeRate;
          const diffW = width - startRectW;

          const diff = startRectRightBottom.y - startMaskRigthBottom.y;
          /** mask 的开始坐标，应该是和rect 的x 重合的时候。 */
          const maskStartY = startMaskY - newRectPosition.y;
          /**  真实的物理位置 */
          const physicsY =
            startMaskCenterInEditArea.y -
            (startRectRightBottom.y - startMaskCenterInEditArea.y);
          const diffMaskY =
            flipY > 0
              ? startMaskY - maskStartY - newMaskDataInEditArea.y
              : physicsY - newMaskDataInEditArea.y + diff;

          const anctorX = startMaskCenterInRect.x / startRectW;

          result = {
            x: newRectPosition.x - diffW * anctorX,
            y: newRectPosition.y - diffMaskY,
            height,
            width,
          };
          break;
        }
      }
    }
    return result;
  }

  /**
   * 拖动顶点
   *  */
  private dragAroundPoint(
    newMaskDataInEditArea: BaseRectData,
    newRectPosition: Coordinate
  ): BaseRectData {
    const { width: startRectW, height: startRectH } = this.startRectData;
    const {
      x: startMaskX,
      y: startMaskY,
      width: startMaskW,
      height: startMaskH,
    } = this.startMaskData;

    const startWidthRate = startRectW / startMaskW;
    const startHeightRate = startRectH / startMaskH;

    const width = newMaskDataInEditArea.width * startWidthRate;
    const height = newMaskDataInEditArea.height * startHeightRate;

    const diffW = newMaskDataInEditArea.width - startMaskW;
    const diffH = newMaskDataInEditArea.height - startMaskH;

    const rateW = width / startRectW;
    const rateH = height / startRectH;

    const diffMaskX = startMaskX * rateW - startMaskX;
    const diffMaskY = startMaskY * rateH - startMaskY;

    switch (this.pointType) {
      case POINT_TYPE.LEFT_TOP: {
        return {
          x: newRectPosition.x - diffW - diffMaskX,
          y: newRectPosition.y - diffH - diffMaskY,
          width,
          height,
        };
      }
      case POINT_TYPE.RIGHT_TOP: {
        return {
          x: newRectPosition.x - diffMaskX,
          y: newRectPosition.y - diffH - diffMaskY,
          width,
          height,
        };
      }
      case POINT_TYPE.LEFT_BOTTOM: {
        return {
          x: newRectPosition.x - diffW - diffMaskX,
          y: newRectPosition.y - diffMaskY,
          width,
          height,
        };
      }

      // case POINT_TYPE.RIGHT_BOTTOM:
      default:
        return {
          x: newRectPosition.x - diffMaskX,
          y: newRectPosition.y - diffMaskY,
          width,
          height,
        };
    }
  }

  /**
   * 获取基本位置信息
   *  */
  private getBaseData(newRectPosition: Coordinate) {
    const { width: startRectW, height: startRectH } = this.startRectData;
    const {
      x: startMaskX,
      y: startMaskY,
      width: startMaskW,
      height: startMaskH,
    } = this.startMaskData;
    /** 开始矩形的右下坐标 */
    const startRectRightBottom = {
      x: newRectPosition.x + startRectW,
      y: newRectPosition.y + startRectH,
    };
    /** 开始矩形的左上坐标 */
    const startRectLeftTop = {
      x: newRectPosition.x,
      y: newRectPosition.y,
    };
    /** 开始蒙层的左上坐标 */
    const startMaskRigthBottom = {
      x: newRectPosition.x + startMaskX + startMaskW,
      y: newRectPosition.y + startMaskY + startMaskH,
    };
    /** 开始蒙层的右下坐标 */
    const startMaskLeftTop = {
      x: newRectPosition.x + startMaskX,
      y: newRectPosition.y + startMaskY,
    };
    /** 开始蒙层的中心点 以原图为基准 */
    const startMaskCenterInRect = {
      x: startMaskX + startMaskW / 2,
      y: startMaskY + startMaskH / 2,
    };
    /** 开始蒙层的中心点 以画布为基准 */
    const startMaskCenterInEditArea = {
      x: newRectPosition.x + startMaskX + startMaskW / 2,
      y: newRectPosition.y + startMaskY + startMaskH / 2,
    };

    return {
      startRectRightBottom,
      startRectLeftTop,
      startMaskLeftTop,
      startMaskCenterInRect,
      startMaskCenterInEditArea,
      startMaskRigthBottom,
    };
  }

  /**
   * 判断当前拉动的mask是否在mask 的内部
   *  */
  private isMaskInRect(
    newMaskDataInEditArea: BaseRectData,
    newRectPosition: Coordinate
  ): boolean {
    const { maskTopLeft, maskBottomRight, rectTopLeft, rectBottomRight } =
      this.getMaskAndRectPoint(newMaskDataInEditArea, newRectPosition);

    /** 因为mask 和rect 的旋转点是相同的，所以可以直接比较。每条边单独判断，减少精度丢失的影响 */
    switch (this.pointType) {
      case POINT_TYPE.LEFT_CENTER: {
        return maskTopLeft[0] >= rectTopLeft[0];
      }
      case POINT_TYPE.RIGHT_CENTER: {
        return maskBottomRight[0] <= rectBottomRight[0];
      }
      case POINT_TYPE.TOP_CENTER: {
        return maskTopLeft[1] >= rectTopLeft[1];
      }
      case POINT_TYPE.BOTTOM_CENTER: {
        return maskBottomRight[1] <= rectBottomRight[1];
      }
      default:
        return true;
    }
  }

  /**
   * 计算mask 在 原图中的位置信息
   *  */
  private calcMaskDataInRect(
    newMaskDataInEditArea: BaseRectData,
    rectData: BaseRectData
  ): BaseRectData {
    return {
      x: newMaskDataInEditArea.x - rectData.x,
      y: newMaskDataInEditArea.y - rectData.y,
      width: newMaskDataInEditArea.width,
      height: newMaskDataInEditArea.height,
    };
  }

  /**
   * 获取 mask 和 原图 四个顶点的位置
   *  */
  private getMaskAndRectPoint(
    newMaskDataInEditArea: BaseRectData,
    newRectPosition: Coordinate
  ) {
    const { x, y, width, height } = newMaskDataInEditArea;
    const data = {
      maskX: x,
      maskY: y,
      maskW: width,
      maskH: height,
      rectX: newRectPosition.x,
      rectY: newRectPosition.y,
      rectW: this.startRectData.width,
      rectH: this.startRectData.height,
    };
    const startMaskCenter = {
      x:
        newRectPosition.x + this.startMaskData.x + this.startMaskData.width / 2,
      y:
        newRectPosition.y +
        this.startMaskData.y +
        this.startMaskData.height / 2,
    };
    const { x: flipX, y: flipY } = this.flip;
    /** 如果发生翻转 计算真实的物理位置 */
    if (flipX < 0) {
      data.rectX =
        startMaskCenter.x -
        (newRectPosition.x + this.startRectData.width - startMaskCenter.x);
    }
    if (flipY < 0) {
      data.rectY =
        startMaskCenter.y -
        (newRectPosition.y + this.startRectData.height - startMaskCenter.y);
    }
    /** 小数点存在精度丢失，换成整数比较 */
    Object.keys(data).forEach(key => {
      data[key] = keepDecimal(data[key], 0);
    });
    const { maskX, maskY, maskW, maskH, rectX, rectY, rectW, rectH } = data;
    const maskTopLeft = [maskX, maskY];
    const maskBottomRight = [maskX + maskW, maskY + maskH];
    const rectTopLeft = [rectX, rectY];
    const rectBottomRight = [rectX + rectW, rectY + rectH];
    return {
      maskTopLeft,
      maskBottomRight,
      rectTopLeft,
      rectBottomRight,
    };
  }
}
