import { observer } from 'mobx-react';
import { ImageStruc } from '@/models/LayerStruc';
import { LayerProps } from '../Layer';
import Style from './Image.module.less';

interface ImageProps extends LayerProps<ImageStruc> {}

function Image(props: ImageProps) {
  const { model, style } = props;
  const { url } = model;
  return (
    <div style={style} className={Style.image_container}>
      <img className={Style.image} src={url} alt="" />
    </div>
  );
}

export default observer(Image);
