import { observer } from 'mobx-react';
import { ImageStruc } from '@/models/LayerStruc';
import { LayerProps } from '../Layer';
import Style from './Image.module.less';

interface ImageProps extends LayerProps<ImageStruc> {}
function Image(props: ImageProps) {
  const { model } = props;
  const { url } = model;
  return (
    <div className={Style.image_container}>
      <img className={Style.image} src={url} alt="" />
    </div>
  );
}

export default observer(Image);
