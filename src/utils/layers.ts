import { Coordinate, calcRotatedPoint, getRectCenter } from '@p/EditorTools';
import { LayerStrucType } from '@/types/model';
import { OBB, Vector2d } from '@/helpers/Obb';
import { isCollision } from './collision';

/**
 * 获取坐标点下面的图层
 *  */
export function getLayersByPoint(
  layerList: LayerStrucType[],
  point: Coordinate
) {
  return layerList.reduce(
    (layers: LayerStrucType[], curLayer: LayerStrucType) => {
      if (!curLayer.isLock) {
        const { width, height, x, y, rotate } = curLayer.getRectData();

        const center = getRectCenter({ width, height, x, y });

        const position = calcRotatedPoint(point, center, -rotate);
        /**
         * 是否在点内
         */
        const isInPoint =
          position.x > x &&
          position.x < x + width &&
          position.y > y &&
          position.y < y + height;
        isInPoint && layers.push(curLayer);
      }
      return layers;
    },
    []
  );
}

/**
 * 获取重叠层
 * @param targetLayer  目标图层，与目标图层有重叠的即满足条件
 * @param layers 对比的图层列表
 * @returns {LayerStruc[]} 重叠图层
 */
export function getOverlayLayers(
  targetLayer: LayerStrucType,
  layers: LayerStrucType[]
) {
  const { x, y, width, height, rotate } = targetLayer.getRectData();
  const targetLayerObb = new OBB(
    new Vector2d(x + width / 2, y + height / 2),
    width,
    height,
    rotate
  );

  return layers.reduce((layerList: LayerStrucType[], layer: LayerStrucType) => {
    if (layer.isBack()) return layerList;

    const { x, y, width, height, rotate } = layer.getRectData();
    const layerObb = new OBB(
      new Vector2d(x + width / 2, y + height / 2),
      width,
      height,
      rotate
    );
    const collision = isCollision(targetLayerObb, layerObb);
    if (collision) layerList.push(layer);
    return layerList;
  }, []);
}
