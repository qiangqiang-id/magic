import { useState, useEffect, useRef, useMemo } from 'react';
import { observer } from 'mobx-react';
import cls from 'classnames';
import { EditorBox, POINT_TYPE, RectData } from '@p/EditorTools';
import { LayerStrucType } from '@/types/model';
import { moveHandle } from '@/utils/move';
import { useStores } from '@/store';
import { ALL_POINTS, TEXT_POINTS } from '@/constants/PointList';

import Style from './EditorControl.module.less';
import { getPreviewSizePosition } from '@/utils/getPreviewSizePosition';
import { ImageStruc } from '@/models/LayerStruc';

export interface EditorControlProps {
  zoomLevel?: number;
  model: LayerStrucType;
}

function EditorControl(props: EditorControlProps) {
  const { model, zoomLevel = 1 } = props;
  const { OS } = useStores();

  const [points, setPoints] = useState(ALL_POINTS);

  const [previewSizePosition, setPreviewSizePosition] = useState(() => ({
    x: 0,
    y: 0,
  }));

  /** 是否在当前编辑组件触发的鼠标事件 */
  const isMouseEventFormEditor = useRef(false);

  const previewSizeRef = useRef<HTMLDivElement>(null);

  /**
   * 根据不同组件类型，设置拉伸点
   * */
  const setPointsByCmpTag = () => {
    if (!model) return;
    setPoints(model.isText ? TEXT_POINTS : ALL_POINTS);
  };

  useEffect(() => {
    setPointsByCmpTag();
  }, [model]);

  const scaleType = useMemo(() => {
    if (model.isImage) {
      return 'mask-cover';
    }
    return 'default';
  }, [model.type]);

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

    const rectData: RectData = {
      height,
      width,
      x,
      y,
      anchor,
      rotate,
    };

    if (model.isImage) {
      rectData.mask = (model as ImageStruc).mask;
    }

    return rectData;
  };

  const setPreviewPosition = (e: MouseEvent) => {
    const position = getPreviewSizePosition(
      { x: e.clientX, y: e.clientY },
      previewSizeRef.current
    );
    setPreviewSizePosition(position);
  };

  /**
   * 拉伸开始
   */
  const onStartScale = (_point: POINT_TYPE, e: MouseEvent) => {
    setPreviewPosition(e);
    OS.setScaleState(true);
  };

  /**
   * 拉伸
   *  */
  const onScale = (data: RectData, _point: POINT_TYPE, e: MouseEvent) => {
    setPreviewPosition(e);
    model?.update(data);
  };

  /**
   * 拉伸结束
   */
  const onEndScale = () => {
    OS.setScaleState(false);
  };

  /**
   * 旋转开始
   */
  const onRotateStart = () => {
    OS.setRotateState(true);
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

  /**
   * 旋转结束
   */
  const onRotateEnd = () => {
    OS.setRotateState(false);
  };

  /**
   * 鼠标按下：移动
   */
  const onMouseDown = (e: React.MouseEvent) => {
    if (!model || model?.isLock) return;
    moveHandle(e.nativeEvent, model, zoomLevel);
  };

  const onMouseUp = () => {
    if (OS.isEditing || !isMouseEventFormEditor.current) return;
    isMouseEventFormEditor.current = false;
  };

  const rectInfo = getRectInfo();

  const previewSize = `宽度:${Math.round(rectInfo.width)} 高度:${Math.round(
    rectInfo.height
  )}`;

  return (
    <>
      <EditorBox
        className={cls({ [Style.pointer_events_none]: model.isBack })}
        points={points}
        scaleType={scaleType}
        isShowPoint={!OS.isMoveing && !model.isLock}
        rectInfo={rectInfo}
        zoomLevel={zoomLevel}
        onStartScale={onStartScale}
        onScale={onScale}
        onEndScale={onEndScale}
        onRotateStart={onRotateStart}
        onRotate={onRotate}
        onRotateEnd={onRotateEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        minHeight={10}
        minWidth={10}
      />

      {/* 矩形大小预览 */}
      <div
        ref={previewSizeRef}
        style={{
          transform: `translate(${previewSizePosition.x}px,${previewSizePosition.y}px)`,
          visibility: OS.isScaleing ? 'visible' : 'hidden',
        }}
        className={Style.preview_size}
      >
        {previewSize}
      </div>
    </>
  );
}

export default observer(EditorControl);
