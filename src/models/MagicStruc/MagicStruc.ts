import { makeObservable, observable, computed } from 'mobx';
import SceneStruc from '../SceneStruc';
import { LayerStrucType } from '@/types/model';

export default class MagicStruc implements MagicModel {
  id!: string | null;

  name!: string | null;

  /** 所有的场景 */
  scenes: SceneStruc[] = [];

  /** 激活的场景 */
  activedScene: SceneStruc | null = null;

  /** 当前被激活的图层 */
  activedLayers: LayerStrucType[] = [];

  constructor() {
    makeObservable(this, {
      name: observable,
      scenes: observable,
      activedScene: observable,
      activedLayers: observable,
      isMultiple: computed,
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
  releaseAllLayers() {
    this.activedLayers.forEach(layer => layer.inactive());
    this.activedLayers = [];
  }

  /**
   * 激活组件
   * @param layer 被选中的图层，有可能是多个
   * @param isMulti 是否是多选
   */
  activeLayer(layer: LayerStrucType | LayerStrucType[], isMulti?: boolean) {
    let layers = Array.isArray(layer) ? layer : [layer];
    layers = layers.filter(item => item.visible);

    if (layers.every(item => item.actived)) return;

    if (isMulti) {
      this.activedLayers = this.activedLayers.concat(layers);
    } else {
      this.activedLayers.forEach(item => item.inactive());
      this.activedLayers = layers;
    }
    this.activedLayers.forEach(item => item.active());
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

    this.releaseAllLayers();
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

  /** 是否多选 */
  get isMultiple() {
    return this.activedLayers.length > 1;
  }
}
