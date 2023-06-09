import { makeObservable, observable } from 'mobx';
import LayerStruc from './LayerStruc';

export default class TextStruc extends LayerStruc implements LayerModel.Text {
  content?: string;

  charAttrs?: Record<string, any>[];

  isEditing?: boolean;

  fontFamily?: string;

  fontSize?: number;

  lineHeight?: number;

  color?: string;

  strokes?: Stroke[];

  /** 字间距 */
  letterSpacing?: number;

  /** 字体粗细 */
  fontWeight?: number;

  /** 背景颜色 */
  backgroundColor?: string;

  /** 背景透明度 0-100 */
  backgroundAlpha?: number;

  constructor(data?: Partial<LayerModel.Text>) {
    super(data);
    makeObservable(this, {
      content: observable,
      fontFamily: observable,
      charAttrs: observable,
      isEditing: observable,
      fontSize: observable,
      lineHeight: observable,
      color: observable,
      strokes: observable,
      letterSpacing: observable,
      fontWeight: observable,
      backgroundColor: observable,
    });

    this.content = data?.content;
    this.charAttrs = data?.charAttrs;
    this.isEditing = data?.isEditing;
    this.fontFamily = data?.fontFamily;
    this.fontSize = data?.fontSize;
    this.lineHeight = data?.lineHeight;
    this.color = data?.color;
    this.strokes = data?.strokes;
    this.letterSpacing = data?.letterSpacing;
    this.fontWeight = data?.fontWeight;
    this.backgroundColor = data?.backgroundColor;
    this.backgroundAlpha = data?.backgroundAlpha;
  }

  model(): LayerModel.Text {
    const model = super.model();

    return {
      ...model,
      content: this.content,
      fontFamily: this.fontFamily,
      charAttrs: this.charAttrs,
      isEditing: this.isEditing,
      fontSize: this.fontSize,
      lineHeight: this.lineHeight,
      color: this.color,
      strokes: this.strokes,
      letterSpacing: this.letterSpacing,
      fontWeight: this.fontWeight,
      backgroundColor: this.backgroundColor,
      backgroundAlpha: this.backgroundAlpha,
    };
  }
}
