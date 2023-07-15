import { ShapeList } from '@/config/Shape';
import { useStores } from '@/store';
import ShapeLayer from '@/components/Layer/Shape';

import Style from './Shape.module.less';

export default function Shape() {
  const { magic } = useStores();

  const addShape = (shape: Partial<LayerModel.Shape>) => {
    magic.activedScene?.addShape(shape);
  };

  return (
    <div className={Style.shape}>
      {ShapeList.map((shape, index) => (
        <div
          onClick={() => addShape(shape)}
          className={Style.shape_item}
          key={`${shape.name}-${index}`}
        >
          <ShapeLayer model={shape} />
        </div>
      ))}
    </div>
  );
}
