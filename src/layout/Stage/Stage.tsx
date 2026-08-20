import { useRef } from 'react';
import { observer } from 'mobx-react';
import Canvas from './Canvas';
import Scenes from './Scenes/Scenes';
import Crop from '@/components/Crop';
import ToolsWithTips from './ToolsWithTips';
import useCanvasPan from '@/hooks/useCanvasPan';
import useCanvasZoom from '@/hooks/useCanvasZoom';
import { CANVAS_WRAPPER } from '@/constants/Refs';
import { NodeNameplate } from '@/constants/NodeNamePlate';
import { useStores } from '@/store';
import Style from './Stage.module.less';

function Stage() {
  const { magic } = useStores();
  const { activedLayers, activedScene, isOpenImageCrop } = magic;

  const cropRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLElement>(null);

  const canvasWidth = activedScene?.width || 0;
  const canvasHeight = activedScene?.height || 0;
  const handleCanvasPan = useCanvasPan(canvasRef);
  const { canvasStyle, cropStyle } = useCanvasZoom(
    canvasRef,
    canvasWidth,
    canvasHeight,
    isOpenImageCrop
  );

  const handleStageMousedown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    /** 尽量不使用阻止冒泡 */
    if (cropRef.current?.contains(e.target as Node)) return;
    if (canvasRef.current?.contains(e.target as Node)) return;

    activedLayers.length && magic.releaseAllLayers();
    handleCanvasPan(e);
  };

  if (!activedScene) return null;

  return (
    <div className={Style.stage}>
      <div className={Style.canvas_wrapper}>
        <div
          className={Style.canvas_inner_wrapper}
          onMouseDown={handleStageMousedown}
          ref={CANVAS_WRAPPER}
          data-nameplate={NodeNameplate.CANVAS_WRAP}
        >
          <Canvas
            ref={canvasRef}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            style={canvasStyle}
          />
        </div>

        {!isOpenImageCrop && <ToolsWithTips />}

        {isOpenImageCrop && (
          <div ref={cropRef} className={Style.crop_wrapper} style={cropStyle}>
            <Crop canvasStyle={canvasStyle} />
          </div>
        )}
      </div>
      <Scenes />
    </div>
  );
}

export default observer(Stage);
