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
import { LayerTypeEnum } from '@/constants/LayerTypeEnum';

export default class SceneStruc implements SceneModel {
  id!: string;

  name!: string;

  layers?: LayerStrucType[] = [];

  cover?: string;

  width?: number;

  height?: number;

  actived?: boolean | null;

  constructor(data?: Partial<SceneModel> | null) {
    makeObservable<this, 'handleUpdate'>(this, {
      name: observable,
      layers: observable,
      cover: observable,
      width: observable,
      height: observable,
      actived: observable,

      isVerticalTemplate: computed,
      backgroundLayer: computed,

      updateSceneBack: action,
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
   * 更新数据
   * @param data
   */
  public update(data: Partial<SceneModel>) {
    this.handleUpdate(data);
  }

  /**
   * 复制
   */
  public clone() {
    const model = cloneDeep(this.model());
    model.id = randomString();
    model.actived = false;
    return CreateScene(model);
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
   * 更新背景
   * @param {Partial<LayerModel.Background>} data
   * @memberof SceneStruc
   */
  public updateSceneBack(data: Partial<LayerModel.Background>) {
    const backLayer = this.getBackLayer();
    backLayer?.update(data);
  }

  /**
   * 添加文字
   * @param {Partial<LayerModel.Text>} data
   * @memberof SceneStruc
   */
  public addText(data?: Partial<LayerModel.Text>) {
    this.createAndAddLayer(LayerTypeEnum.TEXT, data);
  }

  /**
   * 添加图片
   * @param {Partial<LayerModel.Image>} data
   * @memberof SceneStruc
   */
  public addImage(data?: Partial<LayerModel.Image>) {
    this.createAndAddLayer(LayerTypeEnum.IMAGE, data);
  }

  /**
   * 添加形状
   * @param {Partial<LayerModel.Shape>} data
   * @memberof SceneStruc
   */
  public addShape(data?: Partial<LayerModel.Shape>) {
    this.createAndAddLayer(LayerTypeEnum.SHAPE, data);
  }

  /**
   * 创建并且增加图层
   * @param type 类型
   * @param data 数据
   * @param index 添加的位置
   * @returns
   */
  public createAndAddLayer(
    type?: LayerModel.LayerType,
    data?: Partial<LayerModel.Layer>
  ) {
    if (!type) return;
    const layerDataMap: Record<LayerTypeEnum, (() => LayerModel.Layer) | null> =
      {
        [LayerTypeEnum.TEXT]: () => createTextData(this, data),
        [LayerTypeEnum.IMAGE]: () => createImageData(this, data),
        [LayerTypeEnum.SHAPE]: () => createShapeData(this, data),
        [LayerTypeEnum.BACKGROUND]: null,
        [LayerTypeEnum.GROUP]: null,
        [LayerTypeEnum.UNKNOWN]: null,
      };
    const createData = layerDataMap[type];
    if (!createData) return;
    const layerData = createData();
    const layer = CreateLayerStruc(type, layerData, this);
    this.addLayer(layer);
  }

  /**
   * 复制图层
   * @param layer选中的图层
   */
  public copyLayer(layer: LayerStruc) {
    const newLayer = layer.clone();
    this.addLayer(newLayer);
  }

  /**
   * 删除图层
   * @param layer 图层
   */
  public removeLayer(layer?: LayerStruc) {
    if (!layer) return;
    const index = this.getLayerIndex(layer);
    if (index < 0) return;
    magic.removeActivedLayer(layer);
    const layers = this.layers?.filter(item => item.id !== layer.id);
    layer.scene = null;
    this.update({ layers });
  }

  /**
   *  添加图层
   * @param layer 图层
   * @param index 添加的位置
   */
  public addLayer(layer: LayerStrucType, index?: number) {
    const layers = [...(this.layers || [])];
    typeof index === 'number'
      ? layers.splice(index, 0, layer)
      : layers.push(layer);

    magic.activeLayer(layer);
    this.update({ layers });
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
   *  更新数据
   */
  protected handleUpdate(data: Partial<SceneModel>) {
    for (const key in data) {
      this[key] = data[key];
    }
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
