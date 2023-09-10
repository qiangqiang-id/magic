import { useMemo } from 'react';
import cls from 'classnames';
import { Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { LayerStrucType } from '@/types/model';
import Flip from './Flip';
import LayerPosition from './LayerPosition';
import SliderNumberInput from '../SliderNumberInput';
import Style from './LayerBaseSetting.module.less';

interface LayerBaseSettingProps {
  model: LayerStrucType;
}
function LayerBaseSetting(props: LayerBaseSettingProps) {
  const { model } = props;
  const { isLock } = model;

  const { opacity = 1 } = model;

  const handleRemove = () => {
    !model.isLock && model.remove();
  };

  const handleCopy = () => {
    !model.isLock && model.copy();
  };

  const handleLock = () => {
    isLock ? model.unlock() : model.lock();
  };

  const handleChange = (val: number) => {
    model.update({ opacity: val / 100 });
  };

  const opacityNum = useMemo(() => opacity * 100, [opacity]);

  return (
    <div className={Style.layer_base_setting}>
      <div className={cls(Style.layer_base_row, 'setting-row')}>
        <SliderNumberInput
          prefixIcon={<i className="iconfont icon-icon204" />}
          value={opacityNum}
          onChange={handleChange}
        />
      </div>

      <div className={cls(Style.layer_base_row, 'setting-row')}>
        <Tooltip title="图层位置">
          <span>
            <LayerPosition
              model={model}
              className={cls(Style.icon_item, {
                locked: isLock,
              })}
            />
          </span>
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
          <span>
            <Flip
              model={model}
              className={cls(Style.icon_item, {
                locked: model.isLock,
              })}
            />
          </span>
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
    </div>
  );
}

export default observer(LayerBaseSetting);
