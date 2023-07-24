import { makeObservable, observable, computed, action } from 'mobx';
import SceneStruc from '../SceneStruc';
import { LayerStrucType } from '@/types/model';
import { createSceneData } from '@/core/FormatData/Scene';
import { createScene } from '../FactoryStruc/SceneFactory';

export default class MagicStruc implements MagicModel {
  id!: string | null;

  name!: string | null;

  /** 所有的场景 */
  scenes: SceneStruc[] = [];

  /** 激活的场景 */
  activedScene: SceneStruc | null = null;

  /** 当前被激活的图层 */
  activedLayers: LayerStrucType[] = [];

  /** 当前鼠标悬浮图层  */
  hoveredLayer: LayerStrucType | null = null;

  constructor() {
    makeObservable<this, 'handleAddScene'>(this, {
      name: observable,
      scenes: observable,
      activedScene: observable,
      activedLayers: observable,
      hoveredLayer: observable,

      isMultiple: computed,

      update: action,
      releaseAllLayers: action,
      activeLayer: action,
      activeScene: action,
      handleAddScene: action,
      hoverLayer: action,
    });
  }

  public update(data: Partial<MagicModel>) {
    this.handleUpdate(data);
  }

  protected handleUpdate(data: Partial<MagicModel>) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  /**
   *  释放所有活动组件
   */
  public releaseAllLayers() {
    this.activedLayers.forEach(layer => layer.inactive());
    this.activedLayers = [];
  }

  /**
   * 激活组件
   * @param layer 被选中的图层，有可能是多个
   * @param isMulti 是否是多选
   */
  public activeLayer(
    layer: LayerStrucType | LayerStrucType[],
    isMulti?: boolean
  ) {
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
  public activeScene(scene: SceneStruc) {
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
   * @param identify 选中的场景 或者 场景id
   */
  public hasScene(identify: SceneStruc | string) {
    return this.getSceneIndex(identify) >= 0;
  }

  /**
   * 返回场景位置
   * @param identify 选中的场景 或者 场景id
   */
  public getSceneIndex(identify: SceneStruc | string): number {
    const id = typeof identify === 'string' ? identify : identify.id;
    return this.scenes.findIndex(sc => sc.id === id);
  }

  public addScene(data?: Partial<SceneModel>) {
    const sceneData = createSceneData(data);
    const scene = createScene(sceneData);
    this.handleAddScene(scene);
    this.activeScene(scene);
  }

  protected handleAddScene(scene: SceneStruc, index?: number) {
    typeof index === 'number'
      ? this.scenes.splice(index, 0, scene)
      : this.scenes.push(scene);
  }

  public setScenes(scenes: SceneStruc[]) {
    this.update({
      scenes,
    });
  }

  /**
   * 移除激活组件
   *  */
  public removeActivedLayer(layer: LayerStrucType) {
    const index = this.activedLayers.findIndex(item => item.id === layer.id);
    if (index < 0) return;
    this.activedLayers.splice(index, 1);
  }

  /**
   * 高亮组件
   */
  public hoverLayer(layer: LayerStrucType | null) {
    this.hoveredLayer = layer;
  }

  /** 是否多选 */
  get isMultiple() {
    return this.activedLayers.length > 1;
  }
}
