import LayerStruc from '.';

export default class ShapeStruc extends LayerStruc implements LayerModel.Shape {
  constructor(data: LayerModel.Shape) {
    super(data);
    console.log('ShapeStruc');
  }
}
