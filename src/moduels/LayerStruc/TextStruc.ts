import { makeObservable, observable } from 'mobx';
import LayerStruc from './LayerStruc';

export default class TextStruc extends LayerStruc implements LayerModel.Text {
  content!: string;

  charAttrs?: Record<string, any>[] | undefined;

  maxLines?: number | undefined;

  isEdit?: boolean | undefined;

  fontFamily!: string;

  fill?: LayerModel.TextFill | undefined;

  fontSize!: number;

  lineHeight!: number;

  constructor(data?: Partial<LayerModel.Text>) {
    super(data);
    makeObservable(this, {
      content: observable,
      fontFamily: observable,
      charAttrs: observable,
      maxLines: observable,
      isEdit: observable,
      fill: observable,
      fontSize: observable,
      lineHeight: observable,
    });
  }

  model(): LayerModel.Text {
    const model = super.model();

    return {
      ...model,
      content: this.content,
      fontFamily: this.fontFamily,
      charAttrs: this.charAttrs,
      maxLines: this.maxLines,
      isEdit: this.isEdit,
      fill: this.fill,
      fontSize: this.fontSize,
      lineHeight: this.lineHeight,
    };
  }
}
