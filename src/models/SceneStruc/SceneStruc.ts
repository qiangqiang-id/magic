import { makeObservable, observable, action, computed } from 'mobx';
import { cloneDeep } from 'lodash';
import { LayerStrucType } from '@/types/model';
import { getSceneDefaultValues } from '@/config/DefaultValues';
import { deepMerge } from '@/utils/mergeData';
import CreateLayerStruc from '../FactoryStruc/LayerFactory';
import { magic } from '@/store';
import {
  createImageData,
  createTextData,
  createShapeData,
} from '@/core/FormatData/Layer';

import { randomString } from '@/utils/random';
import { CreateScene } from '../FactoryStruc/SceneFactory';
import LayerStruc, { BackgroundStruc } from '../LayerStruc';

export default class SceneStruc implements SceneModel {
  id!: string;

  name!: string;

  layers?: LayerStrucType[] = [];

  cover?: string;

  width?: number;

  height?: number;

  actived?: boolean | null;

  constructor(data?: Partial<SceneModel> | null) {
    makeObservable<this, 'addLayer' | 'addLayerStruc' | 'handleUpdate'>(this, {
      name: observable,
      layers: observable,
      cover: observable,
      width: observable,
      height: observable,
      actived: observable,

      isVerticalTemplate: computed,
      backgroundLayer: computed,

      setSceneBack: action,
      addLayer: action,
      addLayerStruc: action,
      handleUpdate: action,
    });

    const createData = deepMerge(getSceneDefaultValues(), data || {});

    for (const k in createData) {
      if (k in this) {
        this[k] = createData[k];
      }
    }

    this.layers = (data?.layers || [])
      .filter(layer => !!layer.type)
      .map(layer => CreateLayerStruc(layer.type, layer, this));
  }

  model(): SceneModel {
    return {
      id: this.id,
      name: this.name,
      layers: this.layers,
      cover: this.cover,
      width: this.width,
      height: this.height,
      actived: this.actived,
    };
  }

  /**
   * 复制
   */
  clone() {
    const model = cloneDeep(this.model());
    model.id = randomString();
    model.actived = false;
    return CreateScene(model);
  }

  update(data: Partial<SceneModel>) {
    this.handleUpdate(data);
  }

  protected handleUpdate(data: Partial<SceneModel>) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  /**
   * 获取背景
   * @return {Back} 背景图层
   * @memberof SceneStruc
   */
  public getBackLayer(): BackgroundStruc | null {
    const layer = this.layers?.find(layer => layer.isBack());
    if (layer) return layer as BackgroundStruc;

    return null;
  }

  /**
   * 设置背景
   * @param {Partial<LayerModel.Background>} data
   * @memberof SceneStruc
   */
  public setSceneBack(data: Partial<LayerModel.Background>) {
    const backModel = this.getBackLayer();
    backModel?.update<Partial<LayerModel.Background>>(data);
  }

  /**
   * 添加文字
   * @param {Partial<LayerModel.Text>} data
   * @memberof SceneStruc
   */
  public addText(data?: Partial<LayerModel.Text>) {
    const textData = createTextData(this, data);
    this.addLayerStruc(textData);
  }

  /**
   * 添加图片
   * @param {Partial<LayerModel.Image>} data
   * @memberof SceneStruc
   */
  public addImage(data?: Partial<LayerModel.Image>) {
    const imageData = createImageData(this, data);
    this.addLayerStruc(imageData);
  }

  /**
   * 添加形状
   * @param {Partial<LayerModel.Shape>} data
   * @memberof SceneStruc
   */
  public addShape(data?: Partial<LayerModel.Shape>) {
    const shapeData = createShapeData(this, data);
    this.addLayerStruc(shapeData);
  }

  /**
   * 添加图层 构造
   * @protected
   * @param {LayerModel.Layer} model
   * @memberof SceneStruc
   */
  protected addLayerStruc(model: LayerModel.Layer) {
    const layer = CreateLayerStruc(model.type, model, this);
    this.addLayer(layer);
    magic.activeLayer(layer);
  }

  /**
   *  添加图层
   * @param layer 图层
   * @param index 添加的位置
   */
  addLayer(layer: LayerStrucType, index?: number) {
    typeof index === 'number'
      ? this.layers?.splice(index, 0, layer)
      : this.layers?.push(layer);
  }

  /**
   * 删除组件
   * @param layer选中的图层
   */
  public removeLayer(layer: LayerStruc) {
    const index = this.getLayerIndex(layer);
    if (index < 0) return;
    magic.removeActivedLayer(layer);
    this.layers?.splice(index, 1);
    layer.scene = null;
  }

  /**
   * 复制组件
   * @param layer选中的图层
   */
  public copyLayer(layer: LayerStruc) {
    const newLayer = layer.clone();
    this.layers?.push(newLayer);
    magic.activeLayer(newLayer);
  }

  /**
   * 获取组件的下标
   * @param layer 选中的图层
   * @returns {number} 组件的位置
   */
  public getLayerIndex(layer: LayerStruc): number {
    return this.layers?.findIndex(item => item.id === layer.id) || -1;
  }

  /**
   * 是否竖板
   * @readonly
   * @memberof SceneStruc
   */
  get isVerticalTemplate() {
    const { width = 0, height = 0 } = this;
    return height > width;
  }

  /**
   * 背景图层
   * @readonly
   * @memberof SceneStruc
   */
  get backgroundLayer() {
    return this.getBackLayer();
  }
}
