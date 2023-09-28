import { makeObservable, observable, computed, action } from 'mobx';
import SceneStruc from '../SceneStruc';
import { LayerStrucType } from '@/types/model';
import { createSceneData } from '@/core/FormatData/Scene';
import { CreateScene } from '../FactoryStruc/SceneFactory';
import LayerStruc, { GroupStruc } from '../LayerStruc';
import { Axis } from '@/types/canvas';
import ClipboardManager from '@/core/Manager/Clipboard';

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

  /** 是否打开图像裁剪 */
  isOpenImageCrop = false;

  constructor() {
    makeObservable<this, 'handleRemoveLayer' | 'handleAddLayer'>(this, {
      name: observable,
      scenes: observable,
      activedScene: observable,
      activedLayers: observable,
      hoveredLayer: observable,
      isOpenImageCrop: observable,

      isMultiple: computed,

      update: action,
      releaseAllLayers: action,
      activeLayer: action,
      activeScene: action,
      hoverLayer: action,
      handleRemoveLayer: action,
      handleAddLayer: action,
      openImageCrop: action,
      closeImageCrop: action,
      removeActivedLayer: action,
    });
  }

  public update(data: Partial<MagicModel>) {
    this.handleUpdate(data);
  }

  /**
   * 开启裁剪
   */
  public openImageCrop() {
    this.isOpenImageCrop = true;
  }

  /**
   * 关闭裁剪
   */
  public closeImageCrop() {
    this.isOpenImageCrop = false;
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

  /**
   * 创建并添加场景
   * @param data 场景数据
   * @param index 添加的位置
   */
  public createAndAddScene(data?: Partial<SceneModel> | null, index?: number) {
    const sceneData = createSceneData(data);
    const scene = CreateScene(sceneData);
    this.addScene(scene, index);
    this.activeScene(scene);
  }

  /**
   * 移除激活组件
   *  */
  public removeActivedLayer(layer: LayerStruc) {
    this.activedLayers = this.activedLayers.filter(
      item => item.id !== layer.id
    );
  }

  /**
   * 高亮组件
   */
  public hoverLayer(layer: LayerStrucType | null) {
    this.hoveredLayer = layer;
  }

  /**
   * 删除场景
   * @param scene 当前场景
   */
  public removeScene(scene?: SceneStruc) {
    if (!scene) return;
    const scenes = [...this.scenes];
    const index = scenes.findIndex(s => s.id === scene.id);
    if (index === -1) return;
    scenes.splice(index, 1);
    this.update({ scenes });
    /** 删除的恰好是选中的场景，则选中下一个场景 */
    if (scene.id === this.activedScene?.id) {
      const nextScene = scenes[index] || scenes[scenes.length - 1];
      nextScene && this.activeScene(nextScene);
    }
  }

  /**
   * 复制场景
   * @param scene 场景
   * @param index 复制插入的位置
   */
  public copyScene(scene: SceneStruc) {
    const index = this.getSceneIndex(scene);
    const newScene = scene.clone();
    /** 加入到当前场景的后一位 */
    this.addScene(newScene, index + 1);
    this.activeScene(newScene);
  }

  /**
   * 键盘移动组件
   * @param value 移动的量
   * @param axis 坐标轴
   */
  public moveCmpBy(value: number, axis: Axis) {
    this.activedLayers.forEach(layer => {
      if (layer.isLock) return;
      layer.addPixel(value, axis);
    });
  }

  /**
   * 删除图层
   * @param layer 选中的图层
   */
  public removeLayer(layer: LayerStrucType | LayerStrucType[]) {
    this.handleRemoveLayer(layer);
  }

  /**
   * 添加图层
   * @param layer 新添加的图层
   * @param parent 父级
   * @param index 插入的位置
   */
  public addLayer(
    layer: LayerStrucType | LayerStrucType[],
    parent?: SceneStruc | GroupStruc | null,
    index?: number
  ) {
    this.handleAddLayer(layer, parent, index);
  }

  /**
   * 粘贴组件
   * @param layers 剪贴板的组件
   */
  public handlePasteLayers(layers: LayerStrucType[]) {
    const newLayers = layers.map(layer => layer.clone());
    const activedLayer =
      this.activedLayers.length === 1 ? this.activedLayers[0] : null;
    const parent = activedLayer?.isGroup() ? activedLayer : null;
    this.addLayer(newLayers, parent);
  }

  /**
   * 是否是激活图层
   * @param layer 图层或图层的id
   * @returns {boolean}
   */
  public isActiveLayer(layer: LayerStrucType | string): boolean {
    const id = typeof layer === 'string' ? layer : layer.id;
    return !!this.activedLayers.find(item => item.id === id);
  }

  /**
   * 复制组件，通过剪贴板实现跨作品复制
   */
  public copyLayers() {
    const layers = this.activedLayers.reduce(
      (list: LayerStrucType[], layer: LayerStrucType) => {
        if (!layer.isCanCopy) return list;
        const newLayer = layer.clone();
        newLayer.resetParnth();
        newLayer.isLock = false;
        return [...list, newLayer];
      },
      []
    );

    ClipboardManager.copyToClipboard(layers);
  }

  /**
   * 粘贴组件，通过剪贴板实现跨作品复制
   */
  public pasteLayers(layers?: LayerStrucType[]) {
    if (!layers?.length) return;
    const newLayers = layers.map(layer => layer.clone());
    const activedLayer =
      this.activedLayers.length === 1 ? this.activedLayers[0] : null;
    const parent = activedLayer?.isGroup() ? activedLayer : null;
    this.addLayer(newLayers, parent);
  }

  /**
   * 剪切组件，通过剪贴板实现跨作品复制
   */
  public cutLayers() {
    this.copyLayers();
    this.activedLayers.forEach(layer => {
      if (!layer.isCanCopy) return;
      if (layer.isLock) return;
      this.removeLayer(layer);
    });
  }

  /**
   * 添加场景
   *  */
  public addScene(scene: SceneStruc, index?: number) {
    const scenes = [...this.scenes];
    typeof index === 'number'
      ? scenes.splice(index, 0, scene)
      : scenes.push(scene);
    this.update({ scenes });
  }

  /**
   * 更新数据
   */
  protected handleUpdate(data: Partial<MagicModel>) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  /**
   * 添加图层
   * @param layer
   * @param parent
   * @param index
   */
  protected handleAddLayer(
    layer: LayerStrucType | LayerStrucType[],
    parent?: SceneStruc | GroupStruc | null,
    index?: number
  ) {
    if (!parent) parent = this.activedScene;
    const layers = Array.isArray(layer) ? layer : [layer];
    for (const item of layers) {
      parent?.addLayer(item, index);
    }
  }

  /**
   * 删除图层
   * @param layer
   */
  protected handleRemoveLayer(layer: LayerStrucType | LayerStrucType[]) {
    const layers = Array.isArray(layer) ? layer : [layer];
    layers.forEach(item => {
      if (item.isLock) return;
      const parent = item.getParent() || this.activedScene;
      parent?.removeLayer(item);
      if (this.isActiveLayer(item)) this.removeActivedLayer(item);
    });
  }

  /** 是否多选 */
  get isMultiple() {
    return this.activedLayers.length > 1;
  }
}
