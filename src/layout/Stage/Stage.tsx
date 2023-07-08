import { useEffect } from 'react';
import { observer } from 'mobx-react';
import Canvas from './Canvas';
import Scenes from './Scenes/Scenes';
import useResizeObserver from '@/hooks/useResizeObserver';
import { STAGE_REF } from '@/constants/Refs';
import { TEMPLATE_HEIGHT, TEMPLATE_WIDTH } from '@/constants/TemplateSize';
import { useStores } from '@/store';
import Style from './Stage.module.less';

function Stage() {
  const { OS, magic } = useStores();

  const { activedLayers, activedScene } = magic;

  const [entry] = useResizeObserver(STAGE_REF);

  const templateWidth = activedScene?.width || 0;
  const templateHeight = activedScene?.height || 0;

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

  useEffect(() => {
    entry && adaptZoomLevel(entry);
  }, [entry, TEMPLATE_HEIGHT, TEMPLATE_WIDTH]);

  if (!activedScene) return null;

  return (
    <div
      ref={STAGE_REF}
      className={Style.stage}
      onMouseDown={handleStageMousedown}
    >
      <div className={Style.canvas_wrapper}>
        <Canvas canvasWidth={templateWidth} canvasHeight={templateHeight} />
      </div>

      <Scenes />
    </div>
  );
}

export default observer(Stage);
