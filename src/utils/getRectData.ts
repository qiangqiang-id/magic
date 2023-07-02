import { RectData } from '@p/EditorTools';
import { LayerStrucType } from '@/types/model';

/**
 * 获取cmp 的矩形信息
 * @param cmp model
 * @returns RectData
 */
export function getRectDataForLayer(cmp: LayerStrucType): RectData {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    anchor = { x: 0, y: 0 },
    rotate = 0,
  } = cmp;
  return {
    x,
    y,
    width,
    height,
    anchor,
    rotate,
  };
}

/**
 * 获取cmps 的矩形信息
 * @param cmps cmp model list
 * @param exclude 需要排除的cmp，id list
 * @returns RectData list
 */
export function getRectDataForLayers(
  cmps: LayerStrucType[],
  exclude: string[] = []
): RectData[] {
  return cmps
    .filter(cmp => !exclude.includes(cmp.id))
    .map(cmp => getRectDataForLayer(cmp));
}
