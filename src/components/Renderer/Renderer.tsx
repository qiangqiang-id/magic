import cls from 'classnames';
import Style from './Renderer.module.less';

interface RendererProps {
  zoomLevel?: number;
}

export default function Renderer(props: RendererProps) {
  console.log(props);

  return (
    <div className={cls('mosaic-background', Style.renderer)}>Renderer</div>
  );
}
