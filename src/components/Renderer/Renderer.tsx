import cls from 'classnames';
import { LayerStrucType } from '@/types/model';

import Layer from '../Layer';
import Style from './Renderer.module.less';

interface RendererProps {
  zoomLevel?: number;

  layers: LayerStrucType[];
}

export default function Renderer(props: RendererProps) {
  const { layers, zoomLevel = 1 } = props;

  return (
    <div className={cls('mosaic-background', Style.renderer)}>
      {layers.map(layer => (
        <Layer key={layer.id} model={layer} zoomLevel={zoomLevel} />
      ))}
    </div>
  );
}
