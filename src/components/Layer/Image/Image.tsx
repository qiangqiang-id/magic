import { ImageStruc } from '@/models/LayerStruc';
import { LayerProps } from '../Layer';
import Style from './Image.module.less';

interface ImageProps extends LayerProps<ImageStruc> {}
export default function Image(props: ImageProps) {
  const { model } = props;
  const { url } = model;
  return (
    <div className={Style.image_container}>
      <img className={Style.image} src={url} alt="" />
    </div>
  );
}
