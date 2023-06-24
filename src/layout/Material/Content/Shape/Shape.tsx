import { SHAPE_LIST } from '@/constants/Shape';
import Style from './Shape.module.less';

export default function Shape() {
  const addShape = () => {
    console.log('addShape');
  };
  return (
    <div className={Style.shape}>
      {SHAPE_LIST.map((shape, index) => (
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
