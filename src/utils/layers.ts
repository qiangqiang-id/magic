import { Coordinate, calcRotatedPoint, getRectCenter } from '@p/EditorTools';
import { LayerStrucType } from '@/types/model';

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
