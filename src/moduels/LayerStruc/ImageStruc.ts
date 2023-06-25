import { makeObservable, observable } from 'mobx';
import LayerStruc from './LayerStruc';
import { LayerDefaultValues } from '@/config/DefaultValues';
import { deepMerge } from '@/utils/mergeData';

export default class ImageStruc extends LayerStruc implements LayerModel.Image {
  url?: string;

  originalWidth?: number;

  originalHeight?: number;

  constructor(data: LayerModel.Image) {
    const createData = deepMerge(LayerDefaultValues, data || {});
    super(createData);
    makeObservable(this, {
      url: observable,
      originalWidth: observable,
      originalHeight: observable,
    });

    this.url = createData.url;
    this.originalWidth = createData.originalWidth;
    this.originalHeight = createData.originalHeight;
  }

  model(): LayerModel.Image {
    const model = super.model();

    return {
      ...model,
      url: this.url,
      originalWidth: this.originalWidth,
      originalHeight: this.originalHeight,
    };
  }
}
