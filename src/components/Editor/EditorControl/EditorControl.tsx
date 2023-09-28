import { useState, useEffect, useRef, useMemo } from 'react';
import { observer } from 'mobx-react';
import cls from 'classnames';
import { EditorBox, POINT_TYPE, RectData, isCenterPoint } from '@p/EditorTools';
import { LayerStrucType } from '@/types/model';
import { moveHandle } from '@/utils/move';
import { useStores } from '@/store';
import { ALL_POINTS, TEXT_POINTS } from '@/constants/PointList';

import Style from './EditorControl.module.less';
import { getPreviewSizePosition } from '@/utils/getPreviewSizePosition';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '@/constants/FontSize';
import { toCanvasPoint } from '@/helpers/Node';
import { getLayersByPoint } from '@/utils/layers';
import { getPenetrationLayer } from '@/utils/penetration';

export interface EditorControlProps {
  zoomLevel?: number;
  model: LayerStrucType;
}

function EditorControl(props: EditorControlProps) {
  const { model, zoomLevel = 1 } = props;
  const { OS, magic } = useStores();

  const { layers = [] } = magic.activedScene || {};

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
    setPoints(model.isText() ? TEXT_POINTS : ALL_POINTS);
  };

  useEffect(() => {
    setPointsByCmpTag();
  }, [model]);

  const scaleType = useMemo(() => {
    if (model.isImage()) {
      return 'mask-cover';
    }
    return 'default';
  }, [model.type]);

  /**
   * 获取矩形的信息
   */
  const getRectInfo = () => {
    const { height, width, x, y, rotate, anchor, scale } =
      model.getSafetyModalData();

    const rectData: RectData = {
      height,
      width,
      x,
      y,
      anchor,
      rotate,
      scale,
    };

    if (model.isImage()) {
      rectData.mask = model.mask;
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
  const onScale = (data: RectData, point: POINT_TYPE, e: MouseEvent) => {
    setPreviewPosition(e);

    const updateData = { ...data };

    const preWidth = +(model?.width ?? 0);
    const ratio = updateData.width / preWidth;

    /** 如果是文字组件，并且拉伸的是顶点，一些属性需要做同比例缩放 */
    if (model.isText() && !isCenterPoint(point)) {
      const { fontSize = 12 } = model;
      const newFontSize = Math.min(
        MAX_FONT_SIZE,
        Math.max(MIN_FONT_SIZE, +fontSize * ratio)
      );
      /** 如果字体大小到了最小值，不允许缩小了 */
      if (newFontSize <= MIN_FONT_SIZE || newFontSize >= MAX_FONT_SIZE) return;
      Object.assign(updateData, { fontSize: newFontSize });
    }

    /**
     * 如果是文字，并拉伸的是左右改变宽度时，这里不改变文字的高度，富文本会改变文字的高度
     * */
    if (
      model.isText() &&
      [POINT_TYPE.RIGHT_CENTER, POINT_TYPE.LEFT_CENTER].includes(point)
    ) {
      Reflect.deleteProperty(updateData, 'height');
    }

    model?.update(updateData);
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
    isMouseEventFormEditor.current = true;
    if (!model || model?.isLock) return;
    moveHandle(e.nativeEvent, model, zoomLevel);
  };

  /**
   * 鼠标抬起：切换活动图层
   */
  const onMouseUp = async (e: React.MouseEvent) => {
    if (OS.isEditing || !isMouseEventFormEditor.current) return;
    isMouseEventFormEditor.current = false;

    /**
     *  如果没有发生过移动，判断是否需要切换活动组件
     *  需要对透明图片做透传选择
     * */
    const pointInCanvas = toCanvasPoint({
      x: e.clientX,
      y: e.clientY,
    });

    pointInCanvas.x /= zoomLevel;
    pointInCanvas.y /= zoomLevel;

    /** 鼠标坐标下的图层 */
    const layersInPoint = getLayersByPoint(layers, {
      x: pointInCanvas.x,
      y: pointInCanvas.y,
    });

    if (!layersInPoint.length) return;

    const layer = await getPenetrationLayer(pointInCanvas, layersInPoint);

    layer && magic.activeLayer(layer, e.shiftKey);
  };

  const onDoubleClick = () => {
    if (model.isLock) return;
    if (model.isText()) model.onEdit();
    if (model.isImage()) magic.openImageCrop();
  };

  const rectInfo = getRectInfo();

  const previewSize = useMemo(() => {
    const { width, height, mask } = rectInfo;
    const w = mask?.width || width;
    const h = mask?.height || height;
    return `宽度:${Math.round(w)} 高度:${Math.round(h)}`;
  }, [rectInfo]);

  return (
    <>
      <EditorBox
        className={cls({
          [Style.pointer_events_none]: model.isBack(),
          [Style.editor_control]: !model.isLock,
        })}
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
        onDoubleClick={onDoubleClick}
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
