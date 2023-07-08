import { PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import cls from 'classnames';
import { useStores } from '@/store';
import SceneStruc from '@/models/SceneStruc';
import Renderer from '@/components/Renderer';
import Style from './Scenes.module.less';

/**
 * 预览场景大小
 */
const SIZE = 130;

function Scenes() {
  const { magic } = useStores();
  const { scenes, activedScene } = magic;

  const renderScene = (scene: SceneStruc) => {
    const { width = 0, height = 0 } = scene;
    const rate = SIZE / Math.max(width, height);
    const sceneStyle = {
      width,
      height,
      transform: `scale(${rate})`,
    };

    const actived = activedScene?.id === scene.id;

    return (
      <div
        key={scene.id}
        className={cls(Style.scene_item, actived && Style.actived)}
        style={{ width: width * rate, height: height * rate }}
      >
        <Renderer style={sceneStyle} scene={scene} />
      </div>
    );
  };

  return (
    <div className={Style.scenes}>
      <div className={Style.scenes_content}>
        {scenes.map(scene => renderScene(scene))}

        {scenes.map(scene => renderScene(scene))}

        <div className={Style.add_item}>
          <PlusOutlined
            style={{
              fontSize: 25,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default observer(Scenes);
