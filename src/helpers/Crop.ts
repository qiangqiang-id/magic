import {
  BaseRectData,
  Coordinate,
  POINT_TYPE,
  RectData,
  calcRotatedPoint,
} from '@p/EditorTools';

/**
 * 计算真实物理位置  用于翻转情况下，肉眼看到的真实坐标
 * @param {Object} rectData { x, y, width, height, anchor, scale }
 * @retrue {Object}     { x, y }
 */
export function calcPhysicsPonitByFlip(rectData: RectData): Coordinate {
  const {
    x,
    y,
    width,
    height,
    anchor = { x: 0, y: 0 },
    scale = { x: 1, y: 1 },
  } = rectData;
  let positionX = x;
  let positionY = y;

  const center = {
    x: x + width * anchor.x,
    y: y + height * anchor.y,
  };

  if (scale.x < 0) {
    positionX = center.x - (x + width - center.x);
  }

  if (scale.y < 0) {
    positionY = center.y - (y + height - center.y);
  }
  return {
    x: positionX,
    y: positionY,
  };
}

/**
 * 基于mask 的锚点重新计算rect 的位置
 * 裁剪 mask 和 rect 都是基于外面的画布定位的，mask 位置发生变化，以为着rect 的锚点发生了变化，rect 的位置其实就不准确了。
 * 这里的计算就是为了 统一 mask 与 rect 的锚点
 * @param rectData rect 位置信息
 * @param maskData masl 位置信息
 * @returns 坐标信息
 */
export function clacRectPositionByMaskAnchor(
  rectData: RectData,
  maskData: BaseRectData
): Coordinate {
  const { x, y, anchor = { x: 0, y: 0 }, width, height, rotate = 0 } = rectData;

  const rectCenter = {
    x: x + width * anchor.x,
    y: y + height * anchor.y,
  };
  /** 旋转后的坐标位置 */
  const rotatedPoint = calcRotatedPoint({ x, y }, rectCenter, rotate);
  const { x: maskX, y: maskY, width: maskW, height: maskH } = maskData;
  const maskCenter = {
    x: maskX + maskW / 2,
    y: maskY + maskH / 2,
  };
  const newRectData = calcRotatedPoint(rotatedPoint, maskCenter, -rotate);
  /** 处理翻转情况 */
  const { x: physicsX, y: physicsY } = calcPhysicsPonitByFlip({
    ...rectData,
    ...newRectData,
  });
  return {
    x: physicsX,
    y: physicsY,
  };
}

/**
 * 计算裁剪时的最大宽高
 * @param rectData rect 位置信息，基于画布定位
 * @param maskData masl 位置信息，基于画布定位
 * @param point  当前拉伸的点
 * @returns 最大宽高
 */
export function calcMaxWidthAndMaxHeight(
  rectData: RectData,
  maskData: BaseRectData,
  point: POINT_TYPE
) {
  const { width: maskW, height: maskH, x: maskX, y: maskY } = maskData;
  const { width: rectW, height: rectH } = rectData;
  const { x: rectX, y: rectY } = clacRectPositionByMaskAnchor(
    rectData,
    maskData
  );

  /** mask 基于rect的位置 */
  const maskInRectX = maskX - rectX;
  const maskInRectY = maskY - rectY;

  const valuesMap = {
    [POINT_TYPE.LEFT_CENTER]: {
      width: rectW - (rectW - (maskInRectX + maskW)),
      height: maskH,
    },
    [POINT_TYPE.LEFT_TOP]: {
      width: rectW - (rectW - (maskInRectX + maskW)),
      height: rectH - (rectH - (maskInRectY + maskH)),
    },
    [POINT_TYPE.LEFT_BOTTOM]: {
      width: rectW - (rectW - (maskInRectX + maskW)),
      height: rectH - maskInRectY,
    },
    [POINT_TYPE.TOP_CENTER]: {
      width: maskW,
      height: rectH - (rectH - (maskInRectY + maskH)),
    },
    [POINT_TYPE.RIGHT_TOP]: {
      width: rectW - maskInRectX,
      height: rectH - (rectH - (maskInRectY + maskH)),
    },
    [POINT_TYPE.RIGHT_CENTER]: {
      width: rectW - maskInRectX,
      height: maskH,
    },
    [POINT_TYPE.RIGHT_BOTTOM]: {
      width: rectW - maskInRectX,
      height: rectH - maskInRectY,
    },
    [POINT_TYPE.BOTTOM_CENTER]: {
      width: maskW,
      height: rectH - maskInRectY,
    },
  };

  return valuesMap[point];
}
