import { dragAction, MagneticLineHandler } from '@p/EditorTools';
import { magic, OS } from '@/store';
import { getRectDataForLayers, getRectDataForLayer } from './getRectData';
import { LayerStrucType } from '@/types/model';

/**
 * layer 移动
 *  */
export const moveHandle = (
  e: MouseEvent,
  model: LayerStrucType,
  zoomLevel: number
) => {
  const { activedScene } = magic;
  if (!activedScene) return;

  const { width = 0, height = 0, layers } = activedScene;

  /** 模板数据 */
  const templateRectData = {
    x: 0,
    y: 0,
    width,
    height,
  };

  /** 对比矩形数据 */
  const layersRectData = [
    templateRectData,
    ...getRectDataForLayers(layers || [], [model.id]),
  ];

  const magneticLineHandler = new MagneticLineHandler(
    getRectDataForLayer(model),
    layersRectData,
    {
      zoomLevel,
    }
  );
  const startPosition = {
    x: e.clientX,
    y: e.clientY,
  };
  dragAction(e, {
    move: e => {
      OS.setMoveState(true);
      const moveDistance = {
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      };
      const { x, y, magneticLines } =
        magneticLineHandler.calcAlignmentLine(moveDistance);
      model.update({ x, y });
      OS.setMagneticLine(magneticLines);
    },
    end: () => {
      OS.clearMagneticLines();
      OS.setMoveState(false);
    },
  });
};
