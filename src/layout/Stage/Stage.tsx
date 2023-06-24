import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import Canvas from './Canvas';
import useResizeObserver from '@/hooks/use-resize-observer';
import { STAGE_REF } from '@/constants/Refs';
import { useStores } from '@/store';
import Style from './Stage.module.less';

const templateWidth = 1080;
const templateHeight = 1920;

function Stage() {
  const { OS } = useStores();

  const [entry] = useResizeObserver(STAGE_REF);

  const canvasWidth = useMemo(
    () => templateWidth * OS.zoomLevel,
    [templateWidth, OS.zoomLevel]
  );

  const canvasHeight = useMemo(
    () => templateHeight * OS.zoomLevel,
    [templateHeight, OS.zoomLevel]
  );

  const adaptZoomLevel = (entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    const rateW = width / templateWidth;
    const rateH = height / templateHeight;
    OS.setZoomLevel(Math.min(rateH, rateW));
  };

  useEffect(() => {
    entry && adaptZoomLevel(entry);
  }, [entry, templateHeight, templateWidth]);

  return (
    <div ref={STAGE_REF} className={Style.stage}>
      <div className={Style.canvas_wrapper}>
        <Canvas canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
      </div>
    </div>
  );
}

export default observer(Stage);
