import { observer } from 'mobx-react';
import { LayerType } from '@/constants/LayerTypeEnum';
import TextSetting from './Text';
import ImageSetting from './Image';
import CanvasSetting from './Canvas';
import ShapeSetting from './Shape';
import GroupSetting from './Group';
import { useStores } from '@/store';
import { LayerStrucType } from '@/types/model';
import Style from './Setting.module.less';

const SettingMap = {
  [LayerType.BACKGROUND]: CanvasSetting,
  [LayerType.IMAGE]: ImageSetting,
  [LayerType.TEXT]: TextSetting,
  [LayerType.SHAPE]: ShapeSetting,
  [LayerType.GROUP]: GroupSetting,
};

export interface SettingProps<M extends LayerStrucType = LayerStrucType> {
  model: M;
}

function Setting() {
  const { magic } = useStores();
  const { activedLayers, isMultiple } = magic;

  const getSetingRender = () => {
    if (activedLayers.length === 0) return <CanvasSetting />;

    /** 选中多个图层 */
    if (isMultiple) {
      return <div>选择多个组件</div>;
    }
    const layer = activedLayers[0];
    const LayerSetting = SettingMap[layer.type];
    if (!LayerSetting) return null;

    return <LayerSetting />;
  };

  return <div className={Style.setting}>{getSetingRender()}</div>;
}

export default observer(Setting);
