import { RectData } from '@p/EditorTools';
import { LayerStrucType } from '@/types/model';

/**
 * 获取cmp 的矩形信息
 * @param layer model
 * @returns RectData
 */
export function getRectDataForLayer(layer: LayerStrucType): RectData {
  const { x, y, width, height, anchor, rotate, mask } =
    layer.getSafetyModalData();

  const rectData: RectData = { x, y, width, height, anchor, rotate };

  if (layer.isImage()) {
    rectData.mask = mask;
  }

  return rectData;
}

/**
 * 获取layers 的矩形信息
 * @param layers cmp model list
 * @param exclude 需要排除的layer，id list
 * @returns RectData list
 */
export function getRectDataForLayers(
  layers: LayerStrucType[],
  exclude: string[] = []
): RectData[] {
  return layers
    .filter(layer => !exclude.includes(layer.id))
    .map(layer => getRectDataForLayer(layer));
}
