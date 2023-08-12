import { makeObservable, observable } from 'mobx';
import LayerStruc from './LayerStruc';
import { magic } from '@/store';

export default class GroupStruc extends LayerStruc implements LayerModel.Group {
  layers?: LayerModel.Layer[];

  constructor(data: LayerModel.Group) {
    super(data);
    makeObservable(this, {
      layers: observable,
    });

    this.layers = data.layers || [];
  }

  model(): LayerModel.Group {
    const model = super.model();

    return {
      ...model,
      layers: this.layers,
    };
  }

  /**
   * 删除组件
   * @param layer选中的图层
   */
  removeLayer(layer: LayerStruc) {
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
  copyLayer(layer: LayerStruc) {
    const newLayer = layer.clone();
    this.layers?.push(newLayer);
  }

  /**
   * 获取组件的下标
   * @param layer 选中的图层
   * @returns {number} 组件的位置
   */
  getLayerIndex(layer: LayerStruc): number {
    return this.layers?.findIndex(item => item.id === layer.id) || -1;
  }
}
