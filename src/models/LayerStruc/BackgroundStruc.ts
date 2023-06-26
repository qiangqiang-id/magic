import { makeObservable, observable } from 'mobx';
import LayerStruc from './LayerStruc';

export default class BackgroundStruc
  extends LayerStruc
  implements LayerModel.Background
{
  /** 背景填充类型 */
  fillType?: 'Color' | 'Image';

  /** 图片地址 */
  url?: string;

  /** 颜色 */
  color?: string;

  constructor(data: LayerModel.Background) {
    super(data);
    makeObservable(this, {
      fillType: observable,
      url: observable,
      color: observable,
    });

    this.fillType = data.fillType || 'Color';
    this.url = data.url || '';
    this.color = data.color || '#000';
  }

  model(): LayerModel.Background {
    const model = super.model();
    return {
      ...model,
      fillType: this.fillType,
      url: this.url,
      color: this.color,
    };
  }
}
