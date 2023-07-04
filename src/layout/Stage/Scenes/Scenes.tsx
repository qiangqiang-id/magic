import { observer } from 'mobx-react';
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
  const { scenes } = magic;

  const renderScene = (scene: SceneStruc) => {
    const { width = 0, height = 0 } = scene;
    const rate = SIZE / Math.max(width, height);
    const sceneStyle = {
      width,
      height,
      transform: `scale(${rate})`,
    };
    return (
      <div className={Style.scene} style={sceneStyle}>
        <Renderer key={scene.id} layers={scene.layers || []} />;
      </div>
    );
  };

  return (
    <div className={Style.scenes}>
      <div className={Style.scenes_wrapper}>
        {scenes.map(scene => renderScene(scene))}
      </div>
    </div>
  );
}

export default observer(Scenes);
