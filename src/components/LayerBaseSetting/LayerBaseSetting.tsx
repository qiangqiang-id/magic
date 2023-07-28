import cls from 'classnames';
import { Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { LayerStrucType } from '@/types/model';
import Style from './LayerBaseSetting.module.less';

interface LayerBaseSettingProps {
  model: LayerStrucType;
}
function LayerBaseSetting(props: LayerBaseSettingProps) {
  const { model } = props;

  const handleRemove = () => {
    model.remove();
  };

  const handleCopy = () => {
    model.copy();
  };

  const handleFlip = () => {
    model.flipX();
  };

  return (
    <div>
      <Tooltip title="图层顺序">
        <i className={cls('iconfont icon-left-layer', Style.icon_item)} />
      </Tooltip>

      <Tooltip title="删除">
        <i
          className={cls('iconfont icon-del', Style.icon_item)}
          onClick={handleRemove}
        />
      </Tooltip>

      <Tooltip title="复制">
        <i
          className={cls('iconfont icon-copy', Style.icon_item)}
          onClick={handleCopy}
        />
      </Tooltip>

      <Tooltip title="翻转">
        <i
          className={cls('iconfont icon-symmetric', Style.icon_item)}
          onClick={handleFlip}
        />
      </Tooltip>
    </div>
  );
}

export default observer(LayerBaseSetting);
