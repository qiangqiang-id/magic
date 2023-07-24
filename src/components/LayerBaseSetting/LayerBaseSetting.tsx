import cls from 'classnames';
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

  return (
    <div>
      <i className={cls('iconfont icon-left-layer', Style.icon_item)} />
      <i
        className={cls('iconfont icon-del', Style.icon_item)}
        onClick={handleRemove}
      />
      <i className={cls('iconfont icon-copy', Style.icon_item)} />
      <i className={cls('iconfont icon-symmetric', Style.icon_item)} />
    </div>
  );
}

export default observer(LayerBaseSetting);
