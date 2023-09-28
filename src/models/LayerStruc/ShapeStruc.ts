import { makeObservable, observable } from 'mobx';
import LayerStruc from './LayerStruc';

export default class ShapeStruc
  extends LayerStruc<LayerModel.Shape>
  implements LayerModel.Shape
{
  shapeType!: 'rect';

  rx?: number;

  ry?: number;

  fill?: string;

  strokeColor?: string;

  strokeWidth?: number;

  strokeType?: 'solid' | 'dashed' | 'dotted';

  strokeSpacing?: number;

  strokeLength?: number;

  constructor(data?: Partial<LayerModel.Shape>) {
    super(data);
    makeObservable(this, {
      shapeType: observable,
      rx: observable,
      ry: observable,
      fill: observable,
      strokeType: observable,
      strokeColor: observable,
      strokeSpacing: observable,
      strokeLength: observable,
    });

    this.shapeType = data?.shapeType ?? 'rect';
    this.rx = data?.rx;
    this.ry = data?.ry;
    this.fill = data?.fill;
    this.strokeColor = data?.strokeColor;
    this.strokeWidth = data?.strokeWidth;
    this.strokeType = data?.strokeType;
    this.strokeSpacing = data?.strokeSpacing;
    this.strokeLength = data?.strokeLength;
  }

  model(): LayerModel.Shape {
    const model = super.model();

    return {
      ...model,
      shapeType: this.shapeType,
      rx: this.rx,
      ry: this.ry,
      fill: this.fill,
      strokeType: this.strokeType,
      strokeColor: this.strokeColor,
      strokeSpacing: this.strokeSpacing,
      strokeLength: this.strokeLength,
    };
  }
}
