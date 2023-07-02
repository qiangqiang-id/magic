import { POINT_TYPE } from '../enum/point-type';
import { Coordinate, RectData } from '../types/Editor';
import { CENTER_POINT } from '../constants/Points';
import {
  valuesToDivide,
  valuesToMultiply,
  pointToAnchor,
  pointToTopLeft,
} from './math';

/**
 * 判断当前的拉动点是否是中心点
 * @param {POINT_TYPE} pointType
 * @return {Boolean} 否是中心点
 */
export const isCenterPoint = (pointType: POINT_TYPE): boolean =>
  CENTER_POINT.includes(pointType);

/**
 * 检测 p0 是否在 p1 与 p2 建立的矩形内
 * @param  {Coordinate}  p0 被检测的坐标
 * @param  {Coordinate}  p1 点1坐标
 * @param  {Coordinate}  p2 点2坐标
 * @return {Boolean}    检测结果
 */
export const pointInRect = (
  p0: Coordinate,
  p1: Coordinate,
  p2: Coordinate
): boolean => {
  if (p1.x > p2.x) {
    if (p0.x < p2.x) {
      return false;
    }
  } else if (p0.x > p2.x) {
    return false;
  }

  if (p1.y > p2.y) {
    if (p0.y < p2.y) {
      return false;
    }
  } else if (p0.y > p2.y) {
    return false;
  }

  return true;
};

/**
 * 保留小数
 * @param num 浮点数
 * @param unit 保留小数的位数
 * @returns
 */
export function keepDecimal(num: number, unit: number) {
  return Math.floor(num * 10 ** unit) / 10 ** unit;
}

/**
 * 处理成可编辑的数据，转换缩放值，和移动锚点位置
 * @param data
 * @param zoomLevel
 * @returns
 */
export function processToEditableData(
  data: RectData,
  zoomLevel: number
): RectData {
  let result = { ...data, ...pointToTopLeft(data) };

  const { x, y, width, height } = result;
  result = {
    ...result,
    ...valuesToMultiply({ x, y, width, height }, zoomLevel),
  };

  if (data.mask) {
    result.mask = valuesToMultiply(data.mask, zoomLevel);
  }
  return result;
}

/**
 * 处理成原始数据
 * @param data
 * @param zoomLevel
 * @returns
 */
export function processToRawData(data: RectData, zoomLevel: number): RectData {
  let result = { ...data, ...pointToAnchor(data) };
  const { x, y, width, height } = result;

  result = { ...result, ...valuesToDivide({ x, y, width, height }, zoomLevel) };

  if (data.mask) {
    result.mask = valuesToDivide(data.mask, zoomLevel);
  }
  return result;
}
