import { observer } from 'mobx-react';
import { BackgroundStruc } from '@/models/LayerStruc';
import { LayerProps } from '../Layer';
import Style from './Back.module.less';

interface BackProps extends LayerProps<BackgroundStruc> {}

function Back(props: BackProps) {
  const { model } = props;
  const { url, color, isColorFill, isImageFill } = model;

  return (
    <div className={Style.back_container}>
      {isImageFill && (
        <img src={url} alt="" className={Style.image_background} />
      )}
      {isColorFill && (
        <div style={{ background: color }} className={Style.color_background} />
      )}
    </div>
  );
}

export default observer(Back);
