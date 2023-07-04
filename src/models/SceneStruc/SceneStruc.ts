import { makeObservable, observable, action } from 'mobx';
import { LayerStrucType } from '@/types/model';
import { SceneDefaultValues } from '@/config/DefaultValues';
import { deepMerge } from '@/utils/mergeData';
import CreateLayerStruc from '../FactoryStruc/LayerFactory';
import { ImageResource } from '@/types/resource';
import { magic } from '@/store';
import { createImageData } from '@/core/FormatData/Layer';

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

      setSceneBack: action,
      addCmp: action,
      addLayerStruc: action,
      handleUpdate: action,
    });

    const createData = deepMerge(SceneDefaultValues, data || {});

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
   *  设置背景
   */
  public setSceneBack(data: Partial<LayerModel.Background>) {
    const backModel = this.layers?.find(layer => layer.isBack);
    backModel?.update<Partial<LayerModel.Background>>(data);
  }

  public addImage(resource: ImageResource) {
    const imageData = createImageData(resource, this);
    this.addLayerStruc(imageData);
  }

  protected addLayerStruc(model: LayerModel.Layer) {
    const layer = CreateLayerStruc(model.type, model, this);
    this.addCmp(layer);
    magic.activeLayer(layer);
  }

  protected addCmp(layer: LayerStrucType, index?: number) {
    index !== undefined
      ? this.layers?.splice(index, 0, layer)
      : this.layers?.push(layer);

    console.log(magic);
  }
}
