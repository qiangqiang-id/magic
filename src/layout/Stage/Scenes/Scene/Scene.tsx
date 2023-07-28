import { useMemo, forwardRef, Ref, CSSProperties } from 'react';
import { observer } from 'mobx-react';
import cls from 'classnames';
import MenuPopover from '@/components/MenuPopover';
import SceneStruc from '@/models/SceneStruc';
import { magic } from '@/store';
import Renderer from '@/components/Renderer';
import Style from './Scene.module.less';

export interface SceneProps {
  scene: SceneStruc;
  actived?: boolean;
  style?: CSSProperties;
  disableRemove?: boolean;
  addEmptyScene?: () => void;
  removeScene?: () => void;
  copyScene?: () => void;
}
/**
 * 预览场景大小
 */
const SIZE = 130;

function Scene(props: SceneProps, ref: Ref<HTMLDivElement>) {
  const {
    actived = false,
    scene,
    style,
    disableRemove = false,
    addEmptyScene,
    removeScene,
    copyScene,
    ...otherProps
  } = props;

  const { width = 0, height = 0 } = scene;

  const ratio = useMemo(() => SIZE / Math.max(width, height), [width, height]);

  const sceneWrapperStyle = {
    width: width * ratio,
    height: height * ratio,
  };

  const sceneStyle = {
    width,
    height,
    transform: `scale(${ratio})`,
  };

  const actions = [
    {
      name: '增加页面',
      handle: addEmptyScene,
    },
    {
      name: '复制',
      handle: copyScene,
    },
    {
      disable: disableRemove,
      name: '删除',
      handle: removeScene,
    },
  ];

  return (
    <div style={style} className={cls(Style.scene_item)}>
      <div
        ref={ref}
        onClick={() => magic.activeScene(scene)}
        className={cls(actived && Style.actived)}
        style={sceneWrapperStyle}
        {...otherProps}
      >
        <div className={cls(Style.scene_renderer_item)}>
          <Renderer style={sceneStyle} scene={scene} />
        </div>
      </div>

      <MenuPopover
        trigger="click"
        placement="topLeft"
        className={Style.menu_popover}
        actionList={actions}
      />
    </div>
  );
}

export default observer(forwardRef(Scene));
