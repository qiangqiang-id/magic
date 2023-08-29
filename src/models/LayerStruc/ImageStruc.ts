import { makeObservable, observable } from 'mobx';
import { pointToAnchor } from '@p/EditorTools';
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

  /**
   *
   * @param url 图片地址
   * @param size  图片的原始宽高
   */
  replaceUrl(url: string, size?: Size) {
    let updateDate: Partial<LayerModel.Image> = { url };

    if (size) {
      const { x, y } = this.getPointAtTopLeft();

      const { mask, anchor } = this.getSafetyModalData();
      const { width: maskW, height: maskH, x: maskX, y: maskY } = mask;

      const ratioW = size.width / maskW;
      const ratioH = size.height / maskH;
      const ratio = Math.min(ratioH, ratioW);

      const newWidth = size.width / ratio;
      const newHeight = size.height / ratio;
      /**
       * 偏移坐标，保证图片显示在蒙层的中间位置
       * 保证mask 物理位置不动，图层的位置需要重新计算
       *  */
      const newMaskX = (newWidth - maskW) / 2;
      const newMaskY = (newHeight - maskH) / 2;

      const rectData = {
        width: newWidth,
        height: newHeight,
        x: x + maskX - newMaskX,
        y: y + maskY - newMaskY,
        anchor,
      };

      const position = pointToAnchor(rectData);

      updateDate = {
        ...updateDate,

        mask: {
          width: maskW,
          height: maskH,
          x: newMaskX,
          y: newMaskY,
        },
        originalHeight: size.height,
        originalWidth: size.width,
        ...rectData,
        ...position,
      };
    }

    this.update(updateDate);
  }
}
