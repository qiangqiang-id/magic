import { makeObservable, observable } from 'mobx';
import SceneStruc from '../SceneStruc';
import { Layer } from '@/types/model';

export default class MagicStruc implements MagicModel {
  id!: string | null;

  name!: string | null;

  /** 所有的场景 */
  scenes: SceneStruc[] = [];

  /** 激活的场景 */
  activedScene!: SceneStruc;

  /** 当前被激活的图层 */
  activedLayers: Layer[] = [];

  constructor() {
    makeObservable(this, {
      name: observable,
      scenes: observable,
      activedScene: observable,
      activedLayers: observable,
    });
  }

  update(data: Partial<MagicModel>) {
    this.handleUpdate(data);
  }

  protected handleUpdate(data: Partial<MagicModel>) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  /**
   * 释放所有活动组件
   */
  releaseAllCmps() {
    this.activedLayers.forEach(layer => layer.inactive());
    this.activedLayers = [];
  }

  /**
   * 激活场景
   * @param scene 当前场景
   */
  activeScene(scene: SceneStruc) {
    if (!this.hasScene(scene)) return;
    this.scenes = this.scenes.map(item => {
      item.actived = false;
      return item;
    });
    scene.actived = true;
    this.activedScene = scene;

    this.releaseAllCmps();
  }

  /**
   * 检测场景是否存在
   * @param scene 选中的场景
   */
  hasScene(scene: SceneStruc) {
    return this.getSceneIndex(scene) >= 0;
  }

  /**
   * 返回场景位置
   * @param scene 选中的场景
   */
  getSceneIndex(scene: SceneStruc): number {
    return this.scenes.findIndex(sc => sc.id === scene.id);
  }
}
