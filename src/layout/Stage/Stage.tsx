import { useEffect, MouseEvent, useMemo } from 'react';
import { observer } from 'mobx-react';
import Canvas from './Canvas';
import Scenes from './Scenes/Scenes';
import Crop from '@/components/Crop';
import useResizeObserver from '@/hooks/useResizeObserver';
import { CANVAS_WRAPPER } from '@/constants/Refs';
import { TEMPLATE_HEIGHT, TEMPLATE_WIDTH } from '@/constants/TemplateSize';
import { NodeNameplate } from '@/constants/NodeNamePlate';
import { useStores } from '@/store';
import Style from './Stage.module.less';

function Stage() {
  const { OS, magic, setting } = useStores();

  const { activedLayers, activedScene } = magic;

  const { zoomLevel } = OS;

  const { isOpenImageCrop } = setting;

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
    magic.releaseAllLayers();
  };

  const handleCropMousedown = (e: MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    entry && adaptZoomLevel(entry);
  }, [entry, TEMPLATE_HEIGHT, TEMPLATE_WIDTH]);

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
          canvasWidth={templateWidth}
          canvasHeight={templateHeight}
          style={canvasStyle}
        />

        {isOpenImageCrop && (
          <div onMouseDown={handleCropMousedown} className={Style.crop_wrapper}>
            <Crop canvasStyle={canvasStyle} />
          </div>
        )}
      </div>
      <Scenes />
    </div>
  );
}

export default observer(Stage);
