import { useState } from 'react';
import cls from 'classnames';
import { Tooltip, Popover } from 'antd';
import { observer } from 'mobx-react';
import { LayerStrucType } from '@/types/model';
import Style from './LayerBaseSetting.module.less';

interface LayerBaseSettingProps {
  model: LayerStrucType;
}
function LayerBaseSetting(props: LayerBaseSettingProps) {
  const { model } = props;
  const { isLock } = model;

  const [flipPopoverOpen, setFlipPopoverOpen] = useState(false);

  const onFlipPopoverOpenChange = (open: boolean) => setFlipPopoverOpen(open);

  const handleRemove = () => {
    !model.isLock && model.remove();
  };

  const handleCopy = () => {
    !model.isLock && model.copy();
  };

  const handleFlipX = () => {
    !model.isLock && model.flipX();
    setFlipPopoverOpen(false);
  };

  const handleFlipY = () => {
    !model.isLock && model.flipY();
    setFlipPopoverOpen(false);
  };

  const handleLock = () => {
    isLock ? model.unlock() : model.lock();
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
    <div className={cls(Style.layer_base_setting, 'setting-row')}>
      <Tooltip title="图层顺序">
        <i
          className={cls('iconfont icon-left-layer', Style.icon_item, {
            locked: isLock,
          })}
        />
      </Tooltip>

      <Tooltip title="删除">
        <i
          className={cls('iconfont icon-del', Style.icon_item, {
            locked: isLock,
          })}
          onClick={handleRemove}
        />
      </Tooltip>

      <Tooltip title="复制">
        <i
          className={cls('iconfont icon-copy', Style.icon_item, {
            locked: isLock,
          })}
          onClick={handleCopy}
        />
      </Tooltip>

      <Tooltip title="翻转">
        <Popover
          open={flipPopoverOpen}
          overlayClassName={Style.popover_flip}
          title={flipOptions}
          placement="bottom"
          trigger="click"
          onOpenChange={onFlipPopoverOpenChange}
        >
          <i
            className={cls('iconfont icon-symmetric', Style.icon_item, {
              locked: isLock,
            })}
          />
        </Popover>
      </Tooltip>

      <Tooltip title={isLock ? '解锁' : '锁定'}>
        <i
          style={{ fontSize: 24 }}
          className={cls(
            'iconfont',
            isLock ? 'icon-linshimima' : 'icon-kaisuo',
            Style.icon_item,
            {
              [Style.locked_icon]: isLock,
            }
          )}
          onClick={handleLock}
        />
      </Tooltip>
    </div>
  );
}

export default observer(LayerBaseSetting);
