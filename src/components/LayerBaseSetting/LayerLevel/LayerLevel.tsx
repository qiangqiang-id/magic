import { useState } from 'react';
import { Popover } from 'antd';
import cls from 'classnames';
import { LayerStrucType } from '@/types/model';

interface LayerLevelProps {
  model: LayerStrucType;
  className: string;
}

export default function LayerLevel(props: LayerLevelProps) {
  const { model, className } = props;

  const [levelPopoverOpen, setLevelPopoverOpen] = useState(false);

  const onFlipPopoverOpenChange = (open: boolean) => {
    const value = model.isLock ? false : open;
    setLevelPopoverOpen(value);
  };

  return (
    <Popover
      title="层级"
      open={levelPopoverOpen}
      placement="bottomLeft"
      trigger="click"
      onOpenChange={onFlipPopoverOpenChange}
    >
      <i className={cls('iconfont icon-left-layer', className)} />
    </Popover>
  );
}
