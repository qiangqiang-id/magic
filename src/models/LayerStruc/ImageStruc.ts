import { makeObservable, observable } from 'mobx';
import LayerStruc from './LayerStruc';

export default class ImageStruc extends LayerStruc implements LayerModel.Image {
  url?: string;

  originalWidth?: number;

  originalHeight?: number;

  fileType?: string;

  constructor(data: LayerModel.Image) {
    super(data);
    makeObservable(this, {
      url: observable,
      originalWidth: observable,
      originalHeight: observable,
      fileType: observable,
    });

    this.url = data.url;
    this.originalWidth = data.originalWidth;
    this.originalHeight = data.originalHeight;
    this.fileType = data?.fileType;
  }

  model(): LayerModel.Image {
    const model = super.model();

    return {
      ...model,
      url: this.url,
      originalWidth: this.originalWidth,
      originalHeight: this.originalHeight,
      fileType: this.fileType,
    };
  }
}
