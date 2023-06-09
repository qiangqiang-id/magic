import { makeObservable, observable, action, computed } from 'mobx';
import { LayerStrucType } from '@/types/model';
import { getSceneDefaultValues } from '@/config/DefaultValues';
import { deepMerge } from '@/utils/mergeData';
import CreateLayerStruc from '../FactoryStruc/LayerFactory';
import { ImageResource } from '@/types/resource';
import { magic } from '@/store';
import { createImageData, createTextData } from '@/core/FormatData/Layer';

export default class SceneStruc implements SceneModel {
  id!: string;

  name!: string;

  layers?: LayerStrucType[] = [];

  cover?: string;

  width?: number;

  height?: number;

  actived?: boolean | null;

  constructor(data?: Partial<SceneModel> | null) {
    makeObservable<this, 'addCmp' | 'addLayerStruc' | 'handleUpdate'>(this, {
      name: observable,
      layers: observable,
      cover: observable,
      width: observable,
      height: observable,
      actived: observable,

      isVerticalTemplate: computed,

      setSceneBack: action,
      addCmp: action,
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
  public getBackLayer() {
    return this.layers?.find(layer => layer.isBack);
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

  public addText(data: Partial<LayerModel.Text> = {}) {
    const textData = createTextData(data, this);
    this.addLayerStruc(textData);
  }

  /**
   * 添加图片
   * @param {ImageResource} resource
   * @memberof SceneStruc
   */
  public addImage(resource: ImageResource) {
    const imageData = createImageData(resource, this);
    this.addLayerStruc(imageData);
  }

  /**
   * 添加图层
   * @protected
   * @param {LayerModel.Layer} model
   * @memberof SceneStruc
   */
  protected addLayerStruc(model: LayerModel.Layer) {
    const layer = CreateLayerStruc(model.type, model, this);
    this.addCmp(layer);
    magic.activeLayer(layer);
  }

  protected addCmp(layer: LayerStrucType, index?: number) {
    index !== undefined
      ? this.layers?.splice(index, 0, layer)
      : this.layers?.push(layer);
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
}
