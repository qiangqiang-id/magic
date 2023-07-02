import { observer } from 'mobx-react';
import { EditorBox, RectData } from '@p/EditorTools';
import { LayerStrucType } from '@/types/model';
import { moveHandle } from '@/utils/move';

export interface EditorControlProps {
  zoomLevel?: number;
  model: LayerStrucType;
}

function EditorControl(props: EditorControlProps) {
  const { model, zoomLevel = 1 } = props;

  /**
   * 获取矩形的信息
   */
  const getRectInfo = () => {
    const {
      height = 0,
      width = 0,
      x = 0,
      y = 0,
      rotate = 0,
      anchor = { x: 0, y: 0 },
    } = model;

    const rectData = {
      height,
      width,
      x,
      y,
      anchor,
      rotate,
    };

    return rectData;
  };

  /**
   * 拉伸
   *  */
  const onScale = (data: RectData) => {
    model?.update(data);
  };

  /**
   * 鼠标按下：移动
   */
  const onMouseDown = (e: React.MouseEvent) => {
    if (!model || model?.isLock) return;
    moveHandle(e.nativeEvent, model, zoomLevel);
  };

  /**
   * 旋转
   */
  const onRotate = (rotate: number) => {
    if (Math.abs(rotate) < 1) {
      rotate = 0;
    }
    model?.update({ rotate });
  };

  return (
    <EditorBox
      scaleType="default"
      rectInfo={getRectInfo()}
      zoomLevel={zoomLevel}
      onScale={onScale}
      onRotate={onRotate}
      onMouseDown={onMouseDown}
    />
  );
}

export default observer(EditorControl);
