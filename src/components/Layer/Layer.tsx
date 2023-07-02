import { ComponentType } from 'react';
import { LayerType } from '@/constants/LayerTypeEnum';
import { LayerStrucType } from '@/types/model';
import Image from './Image';
import Text from './Text';
import Group from './Group';
import Back from './Back';
import Shape from './Shape';
import Style from './Layer.module.less';
import { useStores } from '@/store';
import { getLayerOuterStyles } from '@/helpers/Styles';

const LayerCmpMap = {
  [LayerType.BACKGROUND]: Back,
  [LayerType.GROUP]: Group,
  [LayerType.TEXT]: Text,
  [LayerType.IMAGE]: Image,
  [LayerType.SHAPE]: Shape,
};

export interface LayerProps<M> {
  model: M;
  /**
   * 画布缩放级别
   */
  zoomLevel?: number;
}

export default function Layer<M extends LayerStrucType = LayerStrucType>(
  props: LayerProps<M>
) {
  const { model, zoomLevel } = props;
  const { magic } = useStores();
  const LayerCmp = LayerCmpMap[model.type] as ComponentType<
    LayerProps<LayerStrucType>
  >;

  if (!LayerCmp || !model.visible) return null;
  const outerStyle = getLayerOuterStyles(model, zoomLevel);

  /**
   * 鼠标按下时触发
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button !== 0 || model.actived) return;
    magic.activeLayer(model, e.shiftKey);
  };

  return (
    <div
      data-type={model.type}
      data-id={model.id}
      className={Style.layer}
      onMouseDown={handleMouseDown}
      style={{
        ...outerStyle,
      }}
    >
      <LayerCmp {...props} />
    </div>
  );
}
