import { useMemo } from 'react';
import { observer } from 'mobx-react';
import Renderer from '@/components/Renderer';
import Editor from '@/components/Editor';
import { CANVAS_REF } from '@/constants/Refs';
import { useStores } from '@/store';
import Style from './Canvas.module.less';

interface CanvasProps {
  canvasWidth: number;
  canvasHeight: number;
}

function Canvas(props: CanvasProps) {
  const { canvasWidth, canvasHeight } = props;

  const { OS } = useStores();
  const zoomLevel = OS.zoomLevel;

  const canvasStyle = useMemo(
    () => ({
      width: canvasWidth,
      height: canvasHeight,
    }),
    [zoomLevel]
  );

  return (
    <section ref={CANVAS_REF} className={Style.canvas} style={canvasStyle}>
      <Renderer />
      <Editor />
    </section>
  );
}

export default observer(Canvas);
