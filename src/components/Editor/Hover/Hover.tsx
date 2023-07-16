import { observer } from 'mobx-react';
import { useStores } from '@/store';
import { getLayerOuterStyles } from '@/helpers/Styles';

import style from './Hover.module.less';

function Hover() {
  const { magic, OS } = useStores();
  const { activedLayers, hoveredLayer } = magic;
  const zoomLevel = OS.zoomLevel;

  const isActived = activedLayers.some(cmp => cmp.id === hoveredLayer?.id);

  if (!hoveredLayer || isActived) {
    return null;
  }
  const hoverStyle = getLayerOuterStyles(hoveredLayer, zoomLevel);

  return <div className={style.hover_wrap} style={hoverStyle} />;
}

export default observer(Hover);
