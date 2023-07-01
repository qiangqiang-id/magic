import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import Canvas from './Canvas';
import useResizeObserver from '@/hooks/useResizeObserver';
import { STAGE_REF } from '@/constants/Refs';
import { TEMPLATE_HEIGHT, TEMPLATE_WIDTH } from '@/constants/TemplateSize';
import { useStores } from '@/store';
import Style from './Stage.module.less';

function Stage() {
  const { OS } = useStores();

  const [entry] = useResizeObserver(STAGE_REF);

  const canvasWidth = useMemo(
    () => TEMPLATE_WIDTH * OS.zoomLevel,
    [TEMPLATE_WIDTH, OS.zoomLevel]
  );

  const canvasHeight = useMemo(
    () => TEMPLATE_HEIGHT * OS.zoomLevel,
    [TEMPLATE_HEIGHT, OS.zoomLevel]
  );

  const adaptZoomLevel = (entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    const rateW = width / TEMPLATE_WIDTH;
    const rateH = height / TEMPLATE_HEIGHT;
    OS.setZoomLevel(Math.min(rateH, rateW));
  };

  useEffect(() => {
    entry && adaptZoomLevel(entry);
  }, [entry, TEMPLATE_HEIGHT, TEMPLATE_WIDTH]);

  return (
    <div ref={STAGE_REF} className={Style.stage}>
      <div className={Style.canvas_wrapper}>
        <Canvas canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
      </div>
    </div>
  );
}

export default observer(Stage);
