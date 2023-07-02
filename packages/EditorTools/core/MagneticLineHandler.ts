import {
  getMaskInCanvasRectData,
  getRectRotatedRange,
  pointToAnchor,
  pointToTopLeft,
  valuesToMultiply,
} from '../helper/math';

import { Coordinate, RectData } from '../types/Editor';
import { LineData, MagneticLine } from '../types/MagneticLine';
import { getRectMagneticLines, uniqAlignLines } from '../helper/magneticLine';
import { AxleDirection } from '../constants/AxleDirection';
import { DISTANCE, ZOOM_LEVEL } from '../constants/Magnetic';

interface Options {
  /** 缩放率 */
  zoomLevel?: number;
  /** 吸附距离 */
  distance?: number;
}

export default class MagneticLineHandler {
  /** 目标矩形 */
  private targetRect: RectData;

  /** 对比矩形列表 */
  private contrastRect: RectData[] = [];

  /** 纵轴 */
  private verticalLines: LineData[] = [];

  /** 横轴 */
  private horizontalLines: LineData[] = [];

  /** 缩放率 */
  private zoomLevel: number;

  /** 吸附距离 */
  private distance: number;

  constructor(target: RectData, contrast: RectData[], options?: Options) {
    const zoomLevel = options?.zoomLevel || ZOOM_LEVEL;
    const distance = options?.distance || DISTANCE;
    this.targetRect = target;
    this.contrastRect = contrast;
    this.zoomLevel = zoomLevel;
    this.distance = distance;
    this.initLines();
  }

  /** 转换数据 */
  private transformRectData(data: RectData): RectData {
    let { x, y, width, height } = getMaskInCanvasRectData({
      ...data,
      ...pointToTopLeft(data),
    });

    const result: RectData = {
      ...data,
      ...valuesToMultiply({ x, y, width, height }, this.zoomLevel),
    };

    if (result.mask) {
      result.mask = valuesToMultiply(result.mask, this.zoomLevel);
    }

    return result;
  }

  private initLines() {
    this.contrastRect.forEach(cmp => {
      const rectData = this.transformRectData(cmp);
      const { xRange, yRange } = getRectRotatedRange(rectData);

      const leftTop = {
        x: xRange[0],
        y: yRange[0],
      };

      const rightBottom = {
        x: xRange[1],
        y: yRange[1],
      };

      const width = rightBottom.x - leftTop.x;
      const height = rightBottom.y - leftTop.y;

      const { horizontal, vertical } = getRectMagneticLines(
        leftTop,
        rightBottom,
        { width, height }
      );

      this.horizontalLines.push(...horizontal);
      this.verticalLines.push(...vertical);
    });

    /** 去重 */
    this.horizontalLines = uniqAlignLines(this.horizontalLines);
    this.verticalLines = uniqAlignLines(this.verticalLines);
  }

  public calcAlignmentLine(moveDistance: Coordinate): {
    magneticLines: MagneticLine[];
    x: number;
    y: number;
  } {
    const magneticLines: MagneticLine[] = [];
    const { width, height, rotate, x, y, anchor, mask } =
      this.transformRectData(this.targetRect);

    const { xRange, yRange } = getRectRotatedRange({
      x: x + moveDistance.x,
      y: y + moveDistance.y,
      width,
      height,
      rotate,
    });

    let targetTop = y + moveDistance.y;
    let targetLeft = x + moveDistance.x;

    const targetMinRange = {
      x: xRange[0],
      y: yRange[0],
    };

    const targetMaxRange = {
      x: xRange[1],
      y: yRange[1],
    };

    const w = targetMaxRange.x - targetMinRange.x;
    const h = targetMaxRange.y - targetMinRange.y;

    const targetCenter = {
      x: targetMinRange.x + w / 2,
      y: targetMinRange.y + h / 2,
    };

    this.horizontalLines.some(({ value, range }) => {
      const min = Math.min(...range, targetMinRange.x, targetMaxRange.x);
      const max = Math.max(...range, targetMinRange.x, targetMaxRange.x);
      if (Math.abs(targetMinRange.y - value) < this.distance) {
        targetTop -= targetMinRange.y - value;
        magneticLines.push({
          direction: AxleDirection.x,
          axis: { x: min, y: value },
          length: max - min,
        });
        return true;
      }

      if (Math.abs(targetMaxRange.y - value) < this.distance) {
        targetTop -= targetMaxRange.y - value;
        magneticLines.push({
          direction: AxleDirection.x,
          axis: { x: min, y: value },
          length: max - min,
        });
        return true;
      }

      if (Math.abs(targetCenter.y - value) < this.distance) {
        targetTop -= targetCenter.y - value;
        magneticLines.push({
          direction: AxleDirection.x,
          axis: { x: min, y: value },
          length: max - min,
        });
        return true;
      }
      return false;
    });

    this.verticalLines.some(({ value, range }) => {
      const min = Math.min(...range, targetMinRange.y, targetMaxRange.y);
      const max = Math.max(...range, targetMinRange.y, targetMaxRange.y);

      if (Math.abs(targetMinRange.x - value) < this.distance) {
        targetLeft -= targetMinRange.x - value;
        magneticLines.push({
          direction: AxleDirection.y,
          axis: { x: value, y: min },
          length: max - min,
        });
        return true;
      }
      if (Math.abs(targetMaxRange.x - value) < this.distance) {
        targetLeft -= targetMaxRange.x - value;
        magneticLines.push({
          direction: AxleDirection.y,
          axis: { x: value, y: min },
          length: max - min,
        });
        return true;
      }
      if (Math.abs(targetCenter.x - value) < this.distance) {
        targetLeft -= targetCenter.x - value;
        magneticLines.push({
          direction: AxleDirection.y,
          axis: { x: value, y: min },
          length: max - min,
        });
        return true;
      }
      return false;
    });

    const { width: originWidth, height: originHeight } = this.targetRect;

    if (mask) {
      targetLeft -= mask.x;
      targetTop -= mask.y;
    }

    const rectData = pointToAnchor({
      anchor,
      width: originWidth,
      height: originHeight,
      x: targetLeft / this.zoomLevel,
      y: targetTop / this.zoomLevel,
    });


    return {
      magneticLines,
      x: rectData.x,
      y: rectData.y,
    };
  }
}
