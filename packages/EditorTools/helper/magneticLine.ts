import { Coordinate, Size } from '../types/Editor';
import { Range, LineData } from '../types/MagneticLine';

/**
 * 将一组对齐吸附线进行去重：同位置的的多条对齐吸附线仅留下一条，取该位置所有对齐吸附线的最大值和最小值为新的范围
 * @param lines 一组对齐吸附线信息
 */
export function uniqAlignLines(lines: LineData[]) {
  const map: Record<string, any> = {};
  const uniqLines = lines.reduce((pre: LineData[], cur: LineData) => {
    if (!Reflect.has(map, cur.value)) {
      pre.push(cur);
      map[cur.value] = pre.length - 1;
      return pre;
    }

    const index = map[cur.value];
    const preLine = pre[index];
    const rangeMin = Math.min(preLine.range[0], cur.range[0]);
    const rangeMax = Math.max(preLine.range[1], cur.range[1]);
    const range: Range = [rangeMin, rangeMax];
    const line: LineData = { value: cur.value, range };
    pre[index] = line;
    return pre;
  }, []);
  return uniqLines;
}

/**
 *  获取矩形的自身的六条磁力线
 * @param leftTop 左上角坐标
 * @param rightBottom 右上角坐标
 * @param width 宽
 * @param height 高
 * @returns horizontal 横轴线 vertical 纵轴线
 */
export function getRectMagneticLines(
  leftTop: Coordinate,
  rightBottom: Coordinate,
  rectSize: Size
): { horizontal: LineData[]; vertical: LineData[] } {
  const center = {
    x: leftTop.x + rectSize.width / 2,
    y: leftTop.y + rectSize.height / 2,
  };

  const topLine: LineData = {
    value: leftTop.y,
    range: [leftTop.x, rightBottom.x],
  };

  const bottomLine: LineData = {
    value: rightBottom.y,
    range: [leftTop.x, rightBottom.x],
  };

  const horizontalCenterLine: LineData = {
    value: center.y,
    range: [leftTop.x, rightBottom.x],
  };

  const leftLine: LineData = {
    value: leftTop.x,
    range: [leftTop.y, rightBottom.y],
  };

  const rightLine: LineData = {
    value: rightBottom.x,
    range: [leftTop.y, rightBottom.y],
  };

  const verticalCenterLine: LineData = {
    value: center.x,
    range: [leftTop.y, rightBottom.y],
  };

  return {
    horizontal: [topLine, bottomLine, horizontalCenterLine],
    vertical: [leftLine, rightLine, verticalCenterLine],
  };
}
