import cls from 'classnames';
import Style from './Renderer.module.less';

export default function Renderer() {
  return (
    <div className={cls('mosaic-background', Style.renderer)}>Renderer</div>
  );
}
