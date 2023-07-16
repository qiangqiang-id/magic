import { useMemo, forwardRef, Ref, CSSProperties } from 'react';
import { observer } from 'mobx-react';
import cls from 'classnames';
import SceneStruc from '@/models/SceneStruc';
import { magic } from '@/store';
import Renderer from '@/components/Renderer';
import Style from './Scene.module.less';

interface SceneProps {
  scene: SceneStruc;
  actived?: boolean;
  style?: CSSProperties;
}
/**
 * 预览场景大小
 */
const SIZE = 130;

function Scene(props: SceneProps, ref: Ref<HTMLDivElement>) {
  const { actived = false, scene, style, ...otherProps } = props;

  const { width = 0, height = 0 } = scene;

  const ratio = useMemo(() => SIZE / Math.max(width, height), [width, height]);

  const sceneWrapperStyle = {
    width: width * ratio,
    height: height * ratio,
    ...style,
  };

  const sceneStyle = {
    width,
    height,
    transform: `scale(${ratio})`,
  };

  return (
    <div
      ref={ref}
      onClick={() => magic.activeScene(scene)}
      className={cls(Style.scene_item, actived && Style.actived)}
      style={sceneWrapperStyle}
      {...otherProps}
    >
      <div className={cls(Style.scene_renderer_item)}>
        <Renderer style={sceneStyle} scene={scene} />
      </div>
    </div>
  );
}

export default observer(forwardRef(Scene));
