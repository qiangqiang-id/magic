import { CSSProperties } from 'react';
import cls from 'classnames';
import { observer } from 'mobx-react';
import SceneStruc from '@/models/SceneStruc';
import Layer from '../Layer';
import Style from './Renderer.module.less';

interface RendererProps {
  zoomLevel?: number;

  scene: SceneStruc;

  editable?: boolean;

  style?: CSSProperties;
}

function Renderer(props: RendererProps) {
  const { scene, zoomLevel = 1, editable, style } = props;
  const { layers } = scene;

  return (
    <div
      style={style}
      className={cls('mosaic-background', Style.renderer, {
        [Style.editable]: editable,
      })}
    >
      {layers?.map(layer => (
        <Layer key={layer.id} model={layer} zoomLevel={zoomLevel} />
      ))}
    </div>
  );
}

export default observer(Renderer);
