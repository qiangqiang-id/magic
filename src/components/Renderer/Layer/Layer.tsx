import { ComponentType, CSSProperties } from 'react';
import { observer } from 'mobx-react';
import { LayerTypeEnum } from '@/constants/LayerTypeEnum';
import { LayerStrucType } from '@/types/model';
import Image from './Image';
import Text from './Text';
import Group from './Group';
import Back from './Back';
import Shape from './Shape';
import Style from './Layer.module.less';
import { useStores } from '@/store';
import { getLayerOuterStyles, getLayerInnerStyles } from '@/helpers/Styles';
import { moveHandle } from '@/utils/move';
import { NodeNameplate } from '@/constants/NodeNamePlate';

const LayerCmpMap = {
  [LayerTypeEnum.BACKGROUND]: Back,
  [LayerTypeEnum.GROUP]: Group,
  [LayerTypeEnum.TEXT]: Text,
  [LayerTypeEnum.IMAGE]: Image,
  [LayerTypeEnum.SHAPE]: Shape,
};

export interface LayerProps<M> {
  model: M;
  /**
   * 画布缩放级别
   */
  zoomLevel?: number;

  style?: CSSProperties;
}

function Layer<M extends LayerStrucType = LayerStrucType>(
  props: LayerProps<M>
) {
  const { model, zoomLevel = 1 } = props;
  const { magic, OS } = useStores();
  const LayerCmp = LayerCmpMap[model.type] as ComponentType<
    LayerProps<LayerStrucType>
  >;

  if (!LayerCmp || !model.visible) return null;
  const outerStyle = getLayerOuterStyles(model);
  const innerStyle = getLayerInnerStyles(model);

  /**
   * 鼠标按下时触发
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button !== 0 || model.actived) return;
    magic.activeLayer(model, e.shiftKey);

    if (model.isLock) return;
    moveHandle(e.nativeEvent, model, zoomLevel);
  };

  /**
   *  鼠标进入时触发
   */
  const handleMouseEnter = () => {
    if (OS.isEditing || model.isBack) return;
    magic.hoverLayer(model);
  };

  /**
   * 鼠标离开时触发
   */
  const handleMouseLeave = () => {
    if (OS.isEditing || model.isBack) return;
    magic.hoverLayer(null);
  };

  return (
    <div
      data-nameplate={NodeNameplate.LAYER}
      data-type={model.type}
      data-id={model.id}
      className={Style.layer}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...outerStyle,
      }}
    >
      <LayerCmp {...props} style={innerStyle} />
    </div>
  );
}

export default observer(Layer);
