import { makeObservable, observable } from 'mobx';
import LayerStruc from './LayerStruc';

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
}
