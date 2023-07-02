import { Coordinate, RectData, BaseRectData } from '../types/Editor';
import { Range } from '../types/MagneticLine';

/**
 * 计算出圆心旋转后点的坐标
 * @param prev 旋转前的点坐标
 * @param center 旋转中心
 * @param angle 旋转的角度
 * @return 旋转后的坐标
 */
export const calcRotatedPoint = (
  prev: Coordinate,
  center: Coordinate,
  angle: number
): Coordinate => {
  angle = toRadian(angle);
  return {
    x:
      (prev.x - center.x) * Math.cos(angle) -
      (prev.y - center.y) * Math.sin(angle) +
      center.x,
    y:
      (prev.x - center.x) * Math.sin(angle) +
      (prev.y - center.y) * Math.cos(angle) +
      center.y,
  };
};

/**
 * 角度转弧度
 * @param angle 角度
 */
export const toRadian = (angle: number): number => angle / (180 / Math.PI);

/**
 * 弧度转角度
 * @param radian 弧度
 */
export const toAngle = (radian: number): number => radian / (Math.PI / 180);

/**
 * 计算两个点之间的中心点
 * @param {ICoordinate} prev 前一个点的坐标
 * @param {ICoordinate} now 当前点的坐标
 * @return {ICoordinate} 中心点的坐标
 */
export const getMiddlePoint = (
  prev: Coordinate,
  now: Coordinate
): Coordinate => ({
  x: prev.x + (now.x - prev.x) / 2,
  y: prev.y + (now.y - prev.y) / 2,
});

/**
 * 获取矩形的中心点
 */
export const getRectCenter = (data: BaseRectData): Coordinate => {
  const { x, y, width, height } = data;
  return {
    x: x + width / 2,
    y: y + height / 2,
  };
};

/**
 * 原始数据mask 是基于图层定位，这里转换成基于外层canvas定位
 * @param  {Object}  rectData 一个矩形信息包括描点信息
 */
export function getMaskInCanvasRectData(data: RectData): RectData {
  const { x, y, width, height, mask } = data;
  let rectX = x;
  let rectY = y;
  let rectW = width;
  let rectH = height;

  if (mask) {
    rectX += mask.x;
    rectY += mask.y;
    rectW = mask.width;
    rectH = mask.height;
  }

  return {
    ...data,
    x: rectX,
    y: rectY,
    width: rectW,
    height: rectH,
  };
}

/**
 * 除值
 * @param data 需要被除的数值对象
 * @param num 除积
 * @returns 除余之后的结果
 */
export function valuesToDivide<T extends Record<string, any>>(
  data: T,
  num: number
) {
  const result = { ...data };
  for (const k in result) {
    if (typeof result[k] === 'number') {
      (result[k] as number) /= num;
    }
  }
  return result;
}

/**
 * 乘值
 * @param data 需要被乘的数值对象
 * @param num 乘积
 * @returns 乘余之后的结果
 */
export function valuesToMultiply<T extends Record<string, any>>(
  data: T,
  num: number
) {
  const result = { ...data };

  for (const k in result) {
    if (typeof result[k] === 'number') {
      (result[k] as number) *= num;
    }
  }
  return result;
}

/**
 * 还原坐标到锚点
 * @param  {Object}  rectData 一个矩形信息包括描点信息
 * @return {Object}  还原后的位置
 */
export const pointToAnchor = (data: RectData): Coordinate => {
  const { width, height, x, y, anchor } = data;
  if (!anchor) return data;
  return {
    x: x + width * anchor.x,
    y: y + height * anchor.y,
  };
};

/**
 * 还原坐标到左上角
 * @param  {Object}  rectData 一个矩形信息包括描点信息
 * @return {Object}       还原后的位置
 */
export const pointToTopLeft = (data: RectData): Coordinate => {
  const { width, height, x, y, anchor } = data;
  if (!anchor) return data;
  return {
    x: x - width * anchor.x,
    y: y - height * anchor.y,
  };
};

/**
 * 计算元素在画布中的矩形范围旋转后的新位置范围
 * @param element 元素的位置大小和旋转角度信息
 */
export function getRectRotatedRange(element: RectData): {
  xRange: Range;
  yRange: Range;
} {
  const { x, y, width, height, rotate = 0 } = element;

  const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
  const auxiliaryAngle = (Math.atan(height / width) * 180) / Math.PI;

  const tlbraRadian = ((180 - rotate - auxiliaryAngle) * Math.PI) / 180;
  const trblaRadian = ((auxiliaryAngle - rotate) * Math.PI) / 180;

  const middleLeft = x + width / 2;
  const middleTop = y + height / 2;

  const xAxis = [
    middleLeft + radius * Math.cos(tlbraRadian),
    middleLeft + radius * Math.cos(trblaRadian),
    middleLeft - radius * Math.cos(tlbraRadian),
    middleLeft - radius * Math.cos(trblaRadian),
  ];
  const yAxis = [
    middleTop - radius * Math.sin(tlbraRadian),
    middleTop - radius * Math.sin(trblaRadian),
    middleTop + radius * Math.sin(tlbraRadian),
    middleTop + radius * Math.sin(trblaRadian),
  ];

  return {
    xRange: [Math.min(...xAxis), Math.max(...xAxis)],
    yRange: [Math.min(...yAxis), Math.max(...yAxis)],
  };
}
