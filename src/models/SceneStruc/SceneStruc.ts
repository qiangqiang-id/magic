import { makeObservable, observable, action, computed } from 'mobx';
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

  protected addLayer(layer: LayerStrucType, index?: number) {
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
