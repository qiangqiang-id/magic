import { POINT_TYPE } from '../enum/point-type';
import { BaseRectData, RectData, Coordinate } from '../types/Editor';
import {
  calcRotatedPoint,
  getMiddlePoint,
  getRectCenter,
} from '../helper/math';
import { pointInRect, isCenterPoint } from '../helper/utils';

export interface ScaleHandlerOptions {
  /** 拉伸的最大宽 */
  maxWidth?: number;
  /** 拉伸的最大高 */
  maxHeight?: number;
  /** 拉伸的最小宽 */
  minWidth?: number;
  /** 拉伸的最小高 */
  minHeight?: number;
  /** 是否锁定拉升比例，默认 ture */
  isLockProportions: boolean;
}

/** 关键变量 */
interface KeyVariable {
  /** 元素原始中心点坐标 */
  center: Coordinate;
  /**  当前拖动手柄的实际坐标（旋转后的坐标） */
  handlePoint: Coordinate;
  /** 拖动手柄的对称点的坐标（假设拖动的是左上角手柄，那么他的对称点就是右下角的点） */
  symmetryPoint: Coordinate;
  /** 矩形的宽高比例 */
  proportion: number;
}

/** 拉伸 */
export default class ScaleHandler {
  /** 当前拉伸的位置点  */
  private readonly pointType: POINT_TYPE;

  /** 矩形数据 */
  private readonly rectData: RectData;

  /** 旋转角度 */
  private readonly angle: number;

  /** 配置信息 */
  private readonly options: ScaleHandlerOptions;

  constructor(
    rectData: RectData,
    pointType: POINT_TYPE,
    options: ScaleHandlerOptions = { isLockProportions: true }
  ) {
    this.rectData = rectData;
    this.pointType = pointType;
    this.angle = rectData.rotate || 0;
    if (!Reflect.has(options, 'isLockProportions')) {
      options.isLockProportions = true;
    }
    this.options = options;
  }

  private leftTop(
    mousePosition: Coordinate,
    keyVariable: KeyVariable
  ): BaseRectData {
    const { symmetryPoint, proportion } = keyVariable;
    /** 中心点坐标 */
    let newCenterPoint = getMiddlePoint(mousePosition, symmetryPoint);
    /** 旋转后的topleft */
    let newTopLeftPoint = calcRotatedPoint(
      mousePosition,
      newCenterPoint,
      -this.angle
    );
    /** 旋转后的bottomRight */
    let newBottomRightPoint = calcRotatedPoint(
      symmetryPoint,
      newCenterPoint,
      -this.angle
    );
    let newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
    let newHeight = newBottomRightPoint.y - newTopLeftPoint.y;

    if (this.options.isLockProportions) {
      /** 修正 坐标 宽高 */
      if (newWidth / newHeight > proportion) {
        newTopLeftPoint.x += Math.abs(newWidth - newHeight * proportion);
        newWidth = newHeight * proportion;
      } else {
        newTopLeftPoint.y += Math.abs(newHeight - newWidth / proportion);
        newHeight = newWidth / proportion;
      }

      /** 重新计算 topLeft */
      const rotatedTopLeftPoint = calcRotatedPoint(
        newTopLeftPoint,
        newCenterPoint,
        this.angle
      );

      /** 中心点 */
      newCenterPoint = getMiddlePoint(rotatedTopLeftPoint, symmetryPoint);
      newTopLeftPoint = calcRotatedPoint(
        rotatedTopLeftPoint,
        newCenterPoint,
        -this.angle
      );
      newBottomRightPoint = calcRotatedPoint(
        symmetryPoint,
        newCenterPoint,
        -this.angle
      );

      newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
      newHeight = newBottomRightPoint.y - newTopLeftPoint.y;
    }

    return {
      x: newTopLeftPoint.x,
      y: newTopLeftPoint.y,
      height: newHeight,
      width: newWidth,
    };
  }

  private rightTop(
    mousePosition: Coordinate,
    keyVariable: KeyVariable
  ): BaseRectData {
    const { symmetryPoint, proportion } = keyVariable;
    let newCenterPoint = getMiddlePoint(mousePosition, symmetryPoint);
    let newTopRightPoint = calcRotatedPoint(
      mousePosition,
      newCenterPoint,
      -this.angle
    );
    let newBottomLeftPoint = calcRotatedPoint(
      symmetryPoint,
      newCenterPoint,
      -this.angle
    );


    let newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
    let newHeight = newBottomLeftPoint.y - newTopRightPoint.y;

    if (this.options.isLockProportions) {
      if (newWidth / newHeight > proportion) {
        newTopRightPoint.x -= Math.abs(newWidth - newHeight * proportion);
        newWidth = newHeight * proportion;
      } else {
        newTopRightPoint.y += Math.abs(newHeight - newWidth / proportion);
        newHeight = newWidth / proportion;
      }

      const rotatedTopRightPoint = calcRotatedPoint(
        newTopRightPoint,
        newCenterPoint,
        this.angle
      );
      newCenterPoint = getMiddlePoint(rotatedTopRightPoint, symmetryPoint);
      newTopRightPoint = calcRotatedPoint(
        rotatedTopRightPoint,
        newCenterPoint,
        -this.angle
      );
      newBottomLeftPoint = calcRotatedPoint(
        symmetryPoint,
        newCenterPoint,
        -this.angle
      );

      newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
      newHeight = newBottomLeftPoint.y - newTopRightPoint.y;
    }

    return {
      x: newBottomLeftPoint.x,
      y: newTopRightPoint.y,
      height: newHeight,
      width: newWidth,
    };
  }

  private leftBottom(
    mousePosition: Coordinate,
    keyVariable: KeyVariable
  ): BaseRectData {
    const { symmetryPoint, proportion } = keyVariable;
    let newCenterPoint = getMiddlePoint(mousePosition, symmetryPoint);
    let newTopRightPoint = calcRotatedPoint(
      symmetryPoint,
      newCenterPoint,
      -this.angle
    );
    let newBottomLeftPoint = calcRotatedPoint(
      mousePosition,
      newCenterPoint,
      -this.angle
    );

    let newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
    let newHeight = newBottomLeftPoint.y - newTopRightPoint.y;

    if (this.options.isLockProportions) {
      if (newWidth / newHeight > proportion) {
        newBottomLeftPoint.x += Math.abs(newWidth - newHeight * proportion);
        newWidth = newHeight * proportion;
      } else {
        newBottomLeftPoint.y -= Math.abs(newHeight - newWidth / proportion);
        newHeight = newWidth / proportion;
      }

      const rotatedBottomLeftPoint = calcRotatedPoint(
        newBottomLeftPoint,
        newCenterPoint,
        this.angle
      );
      newCenterPoint = getMiddlePoint(rotatedBottomLeftPoint, symmetryPoint);
      newBottomLeftPoint = calcRotatedPoint(
        rotatedBottomLeftPoint,
        newCenterPoint,
        -this.angle
      );
      newTopRightPoint = calcRotatedPoint(
        symmetryPoint,
        newCenterPoint,
        -this.angle
      );

      newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
      newHeight = newBottomLeftPoint.y - newTopRightPoint.y;
    }

    return {
      x: newBottomLeftPoint.x,
      y: newTopRightPoint.y,
      height: newHeight,
      width: newWidth,
    };
  }

  private rightBottom(
    mousePosition: Coordinate,
    keyVariable: KeyVariable
  ): BaseRectData {
    const { symmetryPoint, proportion } = keyVariable;

    let newCenterPoint = getMiddlePoint(mousePosition, symmetryPoint);
    let newTopLeftPoint = calcRotatedPoint(
      symmetryPoint,
      newCenterPoint,
      -this.angle
    );
    let newBottomRightPoint = calcRotatedPoint(
      mousePosition,
      newCenterPoint,
      -this.angle
    );

    let newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
    let newHeight = newBottomRightPoint.y - newTopLeftPoint.y;

    if (this.options.isLockProportions) {
      if (newWidth / newHeight > proportion) {
        newBottomRightPoint.x -= Math.abs(newWidth - newHeight * proportion);
        newWidth = newHeight * proportion;
      } else {
        newBottomRightPoint.y -= Math.abs(newHeight - newWidth / proportion);
        newHeight = newWidth / proportion;
      }

      const rotatedBottomRightPoint = calcRotatedPoint(
        newBottomRightPoint,
        newCenterPoint,
        this.angle
      );
      newCenterPoint = getMiddlePoint(rotatedBottomRightPoint, symmetryPoint);
      newBottomRightPoint = calcRotatedPoint(
        rotatedBottomRightPoint,
        newCenterPoint,
        -this.angle
      );
      newTopLeftPoint = calcRotatedPoint(
        symmetryPoint,
        newCenterPoint,
        -this.angle
      );

      newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
      newHeight = newBottomRightPoint.y - newTopLeftPoint.y;
    }

    return {
      x: newTopLeftPoint.x,
      y: newTopLeftPoint.y,
      height: newHeight,
      width: newWidth,
    };
  }

  private verticalCenter(
    mousePosition: Coordinate,
    keyVariable: KeyVariable
  ): BaseRectData {
    const { symmetryPoint, handlePoint } = keyVariable;
    const { width } = this.rectData;

    const rotatedCurrentPosition = calcRotatedPoint(
      mousePosition,
      handlePoint,
      -this.angle
    );
    const rotatedMiddlePoint = calcRotatedPoint(
      {
        x: handlePoint.x,
        y: rotatedCurrentPosition.y,
      },
      handlePoint,
      this.angle
    );

    const newHeight = Math.sqrt(
      Math.pow(rotatedMiddlePoint.x - symmetryPoint.x, 2) +
        Math.pow(rotatedMiddlePoint.y - symmetryPoint.y, 2)
    );

    const newCenter = {
      x: rotatedMiddlePoint.x - (rotatedMiddlePoint.x - symmetryPoint.x) / 2,
      y: rotatedMiddlePoint.y + (symmetryPoint.y - rotatedMiddlePoint.y) / 2,
    };

    return {
      width,
      height: newHeight,
      y: newCenter.y - newHeight / 2,
      x: newCenter.x - width / 2,
    };
  }

  private horizontalCenter(
    mousePosition: Coordinate,
    keyVariable: KeyVariable
  ): BaseRectData {
    const { symmetryPoint, handlePoint } = keyVariable;
    const { height } = this.rectData;

    const rotatedCurrentPosition = calcRotatedPoint(
      mousePosition,
      handlePoint,
      -this.angle
    );
    const rotatedMiddlePoint = calcRotatedPoint(
      {
        x: rotatedCurrentPosition.x,
        y: handlePoint.y,
      },
      handlePoint,
      this.angle
    );

    const newWidth = Math.sqrt(
      Math.pow(rotatedMiddlePoint.x - symmetryPoint.x, 2) +
        Math.pow(rotatedMiddlePoint.y - symmetryPoint.y, 2)
    );

    const newCenter = {
      x: rotatedMiddlePoint.x - (rotatedMiddlePoint.x - symmetryPoint.x) / 2,
      y: rotatedMiddlePoint.y + (symmetryPoint.y - rotatedMiddlePoint.y) / 2,
    };

    return {
      height,
      width: newWidth,
      y: newCenter.y - height / 2,
      x: newCenter.x - newWidth / 2,
    };
  }

  /**
   * 拉伸
   *  */
  public onScale(mousePosition: Coordinate) {
    const keyVariable = this.getKeyVariable();
    const { handlePoint, symmetryPoint } = keyVariable;

    const handleMap = {
      [POINT_TYPE.LEFT_TOP]: this.leftTop,
      [POINT_TYPE.RIGHT_TOP]: this.rightTop,
      [POINT_TYPE.LEFT_BOTTOM]: this.leftBottom,
      [POINT_TYPE.RIGHT_BOTTOM]: this.rightBottom,
      [POINT_TYPE.TOP_CENTER]: this.verticalCenter,
      [POINT_TYPE.BOTTOM_CENTER]: this.verticalCenter,
      [POINT_TYPE.RIGHT_CENTER]: this.horizontalCenter,
      [POINT_TYPE.LEFT_CENTER]: this.horizontalCenter,
    };
    const data = handleMap[this.pointType].call(
      this,
      mousePosition,
      keyVariable
    );
    return this.checkBoundar({...this.rectData,...data}, handlePoint, symmetryPoint);
  }

  /**
   * 获取基本信息
   *  */
  private getKeyVariable(): KeyVariable {
    const { x, y, height, width } = this.rectData;

    const center = {
      x: x + width / 2,
      y: y + height / 2,
    };
    const handlePoint = this.getHandlePointForRotated(center);

    const symmetryPoint = {
      x:
        center.x +
        Math.abs(handlePoint.x - center.x) *
          (handlePoint.x < center.x ? 1 : -1),
      y:
        center.y +
        Math.abs(handlePoint.y - center.y) *
          (handlePoint.y < center.y ? 1 : -1),
    };
    return {
      center,
      handlePoint,
      symmetryPoint,
      proportion: this.options.isLockProportions ? width / height : 1,
    };
  }

  /**
   * 获取当前拉动点的位置（旋转后的
   * ） */
  private getHandlePointForRotated(center: Coordinate) {
    let handlePoint: Coordinate = {
      x: 0,
      y: 0,
    };
    const { x, y, height, width } = this.rectData;
    switch (this.pointType) {
      case POINT_TYPE.LEFT_TOP:
        handlePoint = {
          x: x,
          y: y,
        };
        break;
      case POINT_TYPE.TOP_CENTER:
        handlePoint = {
          x: x + width / 2,
          y: y,
        };
        break;
      case POINT_TYPE.RIGHT_TOP:
        handlePoint = {
          x: x + width,
          y: y,
        };
        break;
      case POINT_TYPE.LEFT_BOTTOM:
        handlePoint = {
          x: x,
          y: y + height,
        };
        break;
      case POINT_TYPE.BOTTOM_CENTER:
        handlePoint = {
          x: x + width / 2,
          y: y + height,
        };
        break;
      case POINT_TYPE.RIGHT_BOTTOM:
        handlePoint = {
          x: x + width,
          y: y + height,
        };
        break;
      case POINT_TYPE.LEFT_CENTER:
        handlePoint = {
          x: x,
          y: y + height / 2,
        };
        break;
      case POINT_TYPE.RIGHT_CENTER:
        handlePoint = {
          x: x + width,
          y: center.y,
        };
        break;
    }
    return calcRotatedPoint(handlePoint, center, this.angle);
  }

  /** 检查边界值  */
  private checkBoundar(
    data: BaseRectData,
    handlePoint: Coordinate,
    symmetryPoint: Coordinate
  ) {
    let result = data;
    const { width, height } = result;

    const {
      maxHeight = Infinity,
      maxWidth = Infinity,
      minWidth = 20,
      minHeight = 20,
    } = this.options;

    const newCenter = getRectCenter(result);

    /** 是否超过了拉伸范围 */
    if (
      !pointInRect(newCenter, handlePoint, symmetryPoint) ||
      maxHeight < height ||
      maxWidth < width ||
      minWidth > width ||
      minHeight > height
    ) {
      const { currentWidth, currentHeight } = this.getWidthAndHeightInBoundar(
        data,
        handlePoint,
        symmetryPoint
      );

      const {
        x: startX,
        y: startY,
        width: startW,
        height: startH,
      } = this.rectData;

      const startCenter = getRectCenter(this.rectData);
      /**
       *  固定宽高逻辑
       *  以当拉伸点的对角点为固定点，设置固定宽高，计算固定位置。
       */
      switch (this.pointType) {
        case POINT_TYPE.LEFT_TOP: {
          const startRightBottomForRotated = calcRotatedPoint(
            {
              x: startX + startW,
              y: startY + startH,
            },
            startCenter,
            this.angle
          );

          const currentCenter = calcRotatedPoint(
            {
              x: startRightBottomForRotated.x - currentWidth / 2,
              y: startRightBottomForRotated.y - currentHeight / 2,
            },
            startRightBottomForRotated,
            this.angle
          );

          const currentRigthBottom = calcRotatedPoint(
            startRightBottomForRotated,
            currentCenter,
            -this.angle
          );
          currentRigthBottom.x -= currentWidth;
          currentRigthBottom.y -= currentHeight;

          result = {
            ...currentRigthBottom,
            width: currentWidth,
            height: currentHeight,
          };
          break;
        }
        case POINT_TYPE.RIGHT_BOTTOM: {
          const startTopLeftForRotated = calcRotatedPoint(
            { x: startX, y: startY },
            startCenter,
            this.angle
          );

          const currentCenter = calcRotatedPoint(
            {
              x: startTopLeftForRotated.x + currentWidth / 2,
              y: startTopLeftForRotated.y + currentHeight / 2,
            },
            startTopLeftForRotated,
            this.angle
          );

          const currentTopLeft = calcRotatedPoint(
            startTopLeftForRotated,
            currentCenter,
            -this.angle
          );
          result = {
            ...currentTopLeft,
            width: currentWidth,
            height: currentHeight,
          };
          break;
        }
        case POINT_TYPE.TOP_CENTER:
        case POINT_TYPE.RIGHT_CENTER:
        case POINT_TYPE.RIGHT_TOP: {
          const startLeftBottomForRoated = calcRotatedPoint(
            { x: startX, y: startY + startH },
            startCenter,
            this.angle
          );

          const currentCenter = calcRotatedPoint(
            {
              x: startLeftBottomForRoated.x + currentWidth / 2,
              y: startLeftBottomForRoated.y - currentHeight / 2,
            },
            startLeftBottomForRoated,
            this.angle
          );

          const currentLeftBottom = calcRotatedPoint(
            startLeftBottomForRoated,
            currentCenter,
            -this.angle
          );

          currentLeftBottom.y -= currentHeight;
          result = {
            ...currentLeftBottom,
            width: currentWidth,
            height: currentHeight,
          };
          break;
        }
        case POINT_TYPE.BOTTOM_CENTER:
        case POINT_TYPE.LEFT_CENTER:
        case POINT_TYPE.LEFT_BOTTOM: {
          const startRightTopForRotate = calcRotatedPoint(
            {
              x: startX + startW,
              y: startY,
            },
            startCenter,
            this.angle
          );
          const currentCenter = calcRotatedPoint(
            {
              x: startRightTopForRotate.x - currentWidth / 2,
              y: startRightTopForRotate.y + currentHeight / 2,
            },
            startRightTopForRotate,
            this.angle
          );
          const currentRigthTop = calcRotatedPoint(
            startRightTopForRotate,
            currentCenter,
            -this.angle
          );
          currentRigthTop.x -= currentWidth;
          result = {
            ...currentRigthTop,
            width: currentWidth,
            height: currentHeight,
          };
          break;
        }
      }
    }

    return result;
  }

  /**
   * 获取边界值内的宽高
   * @param data
   * @param handlePoint 当前拉伸点的位置（旋转后的）
   * @param symmetryPoint 对顶点位置
   * @returns
   */
  private getWidthAndHeightInBoundar(
    data: BaseRectData,
    handlePoint: Coordinate,
    symmetryPoint: Coordinate
  ): { currentWidth: number; currentHeight: number } {
    const {
      maxHeight = Infinity,
      maxWidth = Infinity,
      minWidth = 20,
      minHeight = 20,
    } = this.options;

    const { width, height } = data;
    /** 限制的宽高，非等比例缩放 */
    let currentHeight =
      maxHeight < height ? maxHeight : minHeight > height ? minHeight : height;
    let currentWidth =
      maxWidth < width ? maxWidth : minWidth > width ? minWidth : width;

    const newCenter = getRectCenter(data);

    /** 拉伸中心点 */
    const yAxis = [POINT_TYPE.TOP_CENTER, POINT_TYPE.BOTTOM_CENTER];
    const xAxis = [POINT_TYPE.LEFT_CENTER, POINT_TYPE.RIGHT_CENTER];

    if (
      isCenterPoint(this.pointType) &&
      !pointInRect(newCenter, handlePoint, symmetryPoint)
    ) {
      if (yAxis.includes(this.pointType)) {
        currentHeight = minHeight;
      }
      if (xAxis.includes(this.pointType)) {
        currentWidth = minWidth;
      }
    }

    /** 如果开启了同比例缩放遇到了最小值，宽高要同时锁定  */
    if (this.isThreshold(minHeight > height || minWidth > width)) {
      const { width, height } = this.rectData;
      const rateW = minWidth / width;
      const rateH = minHeight / height;
      const maxRate = Math.max(rateH, rateW);
      if (maxRate === rateW) {
        currentWidth = minWidth;
        currentHeight = height * maxRate;
      } else {
        currentHeight = minHeight;
        currentWidth = width * maxRate;
      }
    }

    /** 如果开启了同比例缩放遇到了最大值，宽高要同时锁定 */
    if (this.isThreshold(maxHeight < height || maxWidth < width)) {
      const { width, height } = this.rectData;
      const rateW = maxWidth / width;
      const rateH = maxHeight / height;
      const minRate = Math.min(rateH, rateW);
      if (minRate === rateW) {
        currentWidth = maxWidth;
        currentHeight = height * minRate;
      } else {
        currentHeight = maxHeight;
        currentWidth = width * minRate;
      }
    }

    return {
      currentWidth,
      currentHeight,
    };
  }

  /**
   * 是否在临界值内
   *  */
  private isThreshold(isOverRange: boolean) {
    const isCenter = !isCenterPoint(this.pointType);
    return isCenter && this.options.isLockProportions && isOverRange;
  }
}
