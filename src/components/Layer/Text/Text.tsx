import { TextStruc } from '@/models/LayerStruc';
import { LayerProps } from '../Layer';

interface TextProps extends LayerProps<TextStruc> {}

export default function Text(props: TextProps) {
  const { model, style } = props;

  const { content } = model;

  return (
    <div style={style}>
      <span>{content}</span>
    </div>
  );
}
