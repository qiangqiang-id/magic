import { useMemo } from 'react';
import { observer } from 'mobx-react';
import Renderer from '@/components/Renderer';
import Editor from '@/components/Editor';
import { CANVAS_REF } from '@/constants/Refs';
import { useStores } from '@/store';
import Style from './Canvas.module.less';
import { NodeNameplate } from '@/constants/NodeNamePlate';

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
      width: canvasWidth * zoomLevel,
      height: canvasHeight * zoomLevel,
    }),
    [zoomLevel]
  );

  if (!activedScene || !activedScene?.layers) return null;

  const rendererStyle = {
    width: canvasWidth,
    height: canvasHeight,
    transform: `scale(${zoomLevel})`,
  };

  return (
    <section ref={CANVAS_REF} className={Style.canvas} style={canvasStyle}>
      <div
        className={Style.renderer_wrapper}
        ref={CANVAS_REF}
        data-renderer-id={activedScene.id}
        data-nameplate={NodeNameplate.CANVAS}
      >
        <Renderer
          style={rendererStyle}
          zoomLevel={zoomLevel}
          scene={activedScene}
          editable
        />
      </div>

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
