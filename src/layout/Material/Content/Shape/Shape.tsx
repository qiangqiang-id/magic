import { ShapeList } from '@/config/Shape';
import Style from './Shape.module.less';

export default function Shape() {
  const addShape = () => {
    console.log('addShape');
  };

  return (
    <div className={Style.shape}>
      {ShapeList.map((shape, index) => (
        <div
          onClick={addShape}
          className={Style.shape_item}
          key={`${shape.name}-${index}`}
        >
          <div style={shape.style} />
        </div>
      ))}
    </div>
  );
}
