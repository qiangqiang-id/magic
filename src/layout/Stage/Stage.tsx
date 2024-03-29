import { useEffect, useMemo, useRef } from 'react';
import { observer } from 'mobx-react';
import Canvas from './Canvas';
import Scenes from './Scenes/Scenes';
import Crop from '@/components/Crop';
import useResizeObserver from '@/hooks/useResizeObserver';
import { CANVAS_WRAPPER } from '@/constants/Refs';
import { NodeNameplate } from '@/constants/NodeNamePlate';
import { useStores } from '@/store';
import Style from './Stage.module.less';

function Stage() {
  const { OS, magic } = useStores();

  const { activedLayers, activedScene, isOpenImageCrop } = magic;

  const { zoomLevel } = OS;

  const cropRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [entry] = useResizeObserver(CANVAS_WRAPPER);

  const templateWidth = activedScene?.width || 0;
  const templateHeight = activedScene?.height || 0;

  const canvasStyle = useMemo(
    () => ({
      width: templateWidth * zoomLevel,
      height: templateHeight * zoomLevel,
    }),
    [zoomLevel]
  );

  const adaptZoomLevel = (entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    const rateW = width / templateWidth;
    const rateH = height / templateHeight;
    OS.setZoomLevel(Math.min(rateH, rateW));
  };

  const handleStageMousedown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !activedLayers.length) return;
    /** 尽量不使用阻止冒泡 */
    if (cropRef.current?.contains(e.target as Node)) return;
    if (canvasRef.current?.contains(e.target as Node)) return;

    magic.releaseAllLayers();
  };

  useEffect(() => {
    entry && adaptZoomLevel(entry);
  }, [entry, templateHeight, templateWidth]);

  if (!activedScene) return null;

  return (
    <div className={Style.stage}>
      <div
        onMouseDown={handleStageMousedown}
        className={Style.canvas_wrapper}
        data-nameplate={NodeNameplate.CANVAS_WRAP}
        ref={CANVAS_WRAPPER}
      >
        <Canvas
          ref={canvasRef}
          canvasWidth={templateWidth}
          canvasHeight={templateHeight}
          style={canvasStyle}
        />

        {isOpenImageCrop && (
          <div ref={cropRef} className={Style.crop_wrapper}>
            <Crop canvasStyle={canvasStyle} />
          </div>
        )}
      </div>
      <Scenes />
    </div>
  );
}

export default observer(Stage);
