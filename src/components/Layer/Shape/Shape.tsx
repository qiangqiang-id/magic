import { ShapeStruc } from '@/models/LayerStruc';
import { LayerProps } from '../Layer';

interface ShapeProps extends LayerProps<ShapeStruc | LayerModel.Shape> {}

export default function Shape(props: ShapeProps) {
  const { model } = props;
  const { width, height, rx, ry } = model;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x={0} y={0} ry={rx} rx={ry} width={width} height={height} />
    </svg>
  );
}
