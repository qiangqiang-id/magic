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

  const { OS, magic } = useStores();
  const { activedScene, activedLayers, isMultiple } = magic;
  const { zoomLevel, magneticLines } = OS;

  const canvasStyle = useMemo(
    () => ({
      width: canvasWidth,
      height: canvasHeight,
    }),
    [zoomLevel]
  );

  if (!activedScene || !activedScene?.layers) return null;

  return (
    <section
      ref={CANVAS_REF}
      data-renderer-id={activedScene.id}
      className={Style.canvas}
      style={canvasStyle}
    >
      <Renderer zoomLevel={zoomLevel} layers={activedScene.layers} />
      <Editor
        zoomLevel={zoomLevel}
        isMultiple={isMultiple}
        activedLayers={activedLayers}
        magneticLines={magneticLines}
      />
    </section>
  );
}

export default observer(Canvas);
