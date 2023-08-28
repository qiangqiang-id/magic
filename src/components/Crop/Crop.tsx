import { useState, useRef, useMemo, useEffect, CSSProperties } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import {
  EditorBox,
  POINT_TYPE,
  RectData,
  ScaleHandlerOptions,
  dragAction,
  valuesToDivide,
  valuesToMultiply,
} from '@p/EditorTools';
import { magic, OS, setting } from '@/store';
import Style from './Crop.module.less';
import { ImageStruc } from '@/models/LayerStruc';
import { calcCropRectData, calcMaxWidthAndMaxHeight } from '@/helpers/Crop';
import { getCanvasRectInfo } from '@/helpers/Node';
import CropMove from '@/core/Tools/CropMove';

interface CropProps {
  canvasStyle: CSSProperties;
}

function Crop(props: CropProps) {
  const { canvasStyle } = props;
  const { activedLayers } = magic;
  const { zoomLevel } = OS;
  const layer = activedLayers[0] as ImageStruc;

  const [rectInfo, setRectInfo] = useState<RectData | null>(null);

  const cropRef = useRef<HTMLDivElement>(null);

  /**
   *  转换数据，处理缩放和锚点位置
   */
  const transformData = useMemo(() => {
    if (!layer) return null;
    const { width, height, anchor, mask, scale, rotate } =
      layer.getSafetyModalData();
    const cmpData = valuesToMultiply(
      { width, height, ...layer.getPointAtTopLeft() },
      zoomLevel
    );

    return {
      ...cmpData,
      mask: valuesToMultiply(mask, zoomLevel),
      anchor,
      scale,
      rotate,
    };
  }, [layer]);

  /**
   * 裁剪图片样式
   */
  const picStyle = useMemo(() => {
    if (!transformData) return {};
    const { x, y, width, height, scale, rotate, anchor } = transformData;
    const scaleValue = `${scale.x},${scale.y}`;

    return {
      width,
      height,
      transformOrigin: `${anchor.x * 100}% ${anchor.y * 100}%`,
      transform: `translate(${x}px ,${y}px) rotate(${rotate}deg) scale(${scaleValue})`,
    };
  }, [transformData]);

  /**
   * 九宫格样式
   */
  const gridStyle = useMemo(() => {
    if (!rectInfo) return {};
    const { x, y, width, height, rotate } = rectInfo;
    return {
      width,
      height,
      transform: `translate(${x}px,${y}px) rotate(${rotate}deg)`,
    };
  }, [rectInfo]);

  /**
   * 初始化编辑框数据
   */
  const initRectInfo = () => {
    let rect: RectData | null = null;
    if (transformData) {
      const { x, y, mask, rotate, scale } = transformData;
      rect = {
        x: x + mask.x,
        y: y + mask.y,
        width: mask.width,
        height: mask.height,
        rotate,
        scale,
      };
    }
    setRectInfo(rect);
  };

  /**
   * 移动
   */
  const handleMove = (e: React.MouseEvent) => {
    const canvasRectInfo = getCanvasRectInfo();

    if (!canvasRectInfo || !transformData || !rectInfo) return;

    const mouseData = {
      x: e.clientX - canvasRectInfo.x,
      y: e.clientY - canvasRectInfo.y,
    };

    const cropMove = new CropMove(
      transformData,
      rectInfo,
      transformData?.rotate || 0,
      mouseData
    );

    dragAction(e.nativeEvent, {
      move: e => {
        const currentMouseData = {
          x: e.clientX - canvasRectInfo.x,
          y: e.clientY - canvasRectInfo.y,
        };

        const poi = cropMove.moveHandler(currentMouseData);
        setRectInfo(oldValues => {
          if (!oldValues) return null;
          return { ...oldValues, ...poi };
        });
      },
    });
  };

  /**
   * 拉伸之前，需要计算根据拉伸点计算，最大的拉伸宽高
   * @param point 当前拉伸的点
   * @returns {ScaleHandlerOptions} 拉伸配置项目
   */
  const handleStartScale = (
    point: POINT_TYPE
  ): ScaleHandlerOptions | undefined => {
    if (!transformData || !rectInfo) return undefined;
    const { width, height } = calcMaxWidthAndMaxHeight(
      transformData,
      rectInfo,
      point
    );

    /** 通过拉伸不同的点，设置不同的最大宽高值 */
    return {
      maxWidth: width,
      maxHeight: height,
      isLockProportions: false,
    };
  };

  /**
   * 拉伸
   */
  const handleScale = (data: RectData) => {
    setRectInfo(oldData => ({ ...oldData, ...data }));
  };

  /**
   * 确认裁剪
   *  */
  const confirmCrop = () => {
    if (!transformData || !rectInfo) return;
    const { scale, rotate, anchor } = transformData;
    const { x, y, width, height } = valuesToDivide(transformData, zoomLevel);
    const rectData = {
      x,
      y,
      width,
      height,
      scale,
      rotate,
      anchor,
    };
    const maskData = valuesToDivide(rectInfo, zoomLevel);
    const updateData = calcCropRectData(rectData, maskData);

    layer?.update(updateData);
    closeCrop();
  };

  const closeCrop = () => {
    setting.closeImageCrop();
  };

  useEffect(() => {
    initRectInfo();
  }, [transformData]);

  /**
   * 注册监听事件，关闭裁剪模式
   */
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.target && !cropRef.current?.contains(e.target as Node)) {
        closeCrop();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  if (activedLayers.length !== 1 || !layer.isImage || !rectInfo) return null;

  return (
    <div className={Style.crop} ref={cropRef}>
      <div className={Style.editor_area} style={canvasStyle}>
        {/* 裁剪图像 */}
        <div className={Style.img_box} style={picStyle}>
          <img src={layer?.url} alt="" className={Style.img} />
        </div>

        {/* 九宫格 */}
        <div className={Style.grid_box} style={gridStyle}>
          {Array.from({ length: 2 }, (_, index) => (
            <div
              className={Style.grid_vertical_line}
              style={{ left: `${(100 / 3) * (index + 1)}%` }}
              key={index}
            />
          ))}

          {Array.from({ length: 2 }, (_, index) => (
            <div
              className={Style.grid_horizontal_line}
              style={{ top: `${(100 / 3) * (index + 1)}%` }}
              key={index}
            />
          ))}
        </div>

        {/* 编辑框 */}
        <EditorBox
          className={Style.editor_box}
          onMouseDown={handleMove}
          rectInfo={rectInfo}
          isShowRotate={false}
          onStartScale={handleStartScale}
          onScale={handleScale}
        />
      </div>

      <div className={Style.btn_box}>
        <Button onClick={closeCrop}>取消</Button>
        <Button onClick={confirmCrop} className={Style.confirm} type="primary">
          确定
        </Button>
      </div>
    </div>
  );
}

export default observer(Crop);
