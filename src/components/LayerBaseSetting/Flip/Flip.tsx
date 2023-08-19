import { useState } from 'react';
import { Popover } from 'antd';
import cls from 'classnames';
import { LayerStrucType } from '@/types/model';

import Style from './Flip.module.less';

interface FlipProps {
  model: LayerStrucType;
  className: string;
}

export default function Flip(props: FlipProps) {
  const { model, className } = props;

  const [flipPopoverOpen, setFlipPopoverOpen] = useState(false);

  const onFlipPopoverOpenChange = (open: boolean) => {
    const value = model.isLock ? false : open;
    setFlipPopoverOpen(value);
  };

  const handleFlipX = () => {
    !model.isLock && model.flipX();
    setFlipPopoverOpen(false);
  };

  const handleFlipY = () => {
    !model.isLock && model.flipY();
    setFlipPopoverOpen(false);
  };

  const flipOptions = (
    <>
      <div onClick={handleFlipX} className={Style.flip_option_item}>
        水平翻转
      </div>
      <div onClick={handleFlipY} className={Style.flip_option_item}>
        垂直翻转
      </div>
    </>
  );

  return (
    <Popover
      open={flipPopoverOpen}
      overlayClassName={Style.popover_flip}
      title={flipOptions}
      placement="bottom"
      trigger="click"
      onOpenChange={onFlipPopoverOpenChange}
    >
      <i className={cls('iconfont icon-symmetric', className)} />
    </Popover>
  );
}
