import { useState, CSSProperties, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import {
  EditorBox,
  POINT_TYPE,
  RectData,
  ScaleHandlerOptions,
  valuesToMultiply,
} from '@p/EditorTools';
import { magic, OS } from '@/store';
import Style from './Crop.module.less';
import { ImageStruc } from '@/models/LayerStruc';
import { calcMaxWidthAndMaxHeight } from '@/helpers/Crop';

interface CropProps {
  canvasStyle: CSSProperties;
}

function Crop(props: CropProps) {
  const { canvasStyle } = props;
  const { activedLayers } = magic;
  const { zoomLevel } = OS;
  const layer = activedLayers[0] as ImageStruc;

  const [rectInfo, setRectInfo] = useState<RectData | null>(null);

  /**
   *  转换数据，处理缩放和锚点位置
   */
  const transformData = useMemo(() => {
    if (!layer) return null;
    const {
      width = 0,
      height = 0,
      anchor = { x: 0, y: 0 },
      mask = { x: 0, y: 0, height: 0, width: 0 },
      scale = { x: 1, y: 1 },
      rotate = 0,
    } = layer;
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
    const scaleValue = `${scale.x > 0 ? 1 : -1},${scale.y > 0 ? 1 : -1}`;

    return {
      width,
      height,
      transform: `translate(${x}px ,${y}px) rotate(${rotate}deg) scale(${scaleValue})`,
      transformOrigin: `${anchor.x * 100}% ${anchor.y * 100}%`,
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
   * 阻止冒泡
   */
  const stopPropagation = (e: React.MouseEvent | MouseEvent) => {
    e.stopPropagation();
  };

  const handleMove = () => {
    console.log('handleMove');
  };

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

  useEffect(() => {
    initRectInfo();
  }, [transformData]);

  if (activedLayers.length !== 1 || !layer.isImage || !rectInfo) return null;

  return (
    <div className={Style.crop}>
      <div className={Style.editor_area} style={canvasStyle}>
        {/* 裁剪图像 */}
        <div
          className={Style.img_box}
          style={picStyle}
          onMouseDown={stopPropagation}
        >
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
          onMouseDown={handleMove}
          rectInfo={rectInfo}
          isShowRotate={false}
          onStartScale={handleStartScale}
          onScale={handleScale}
          minHeight={5}
          minWidth={5}
        />
      </div>

      <div className={Style.btn_box}>
        <Button>取消</Button>
        <Button className={Style.confirm} type="primary">
          确定
        </Button>
      </div>
    </div>
  );
}

export default observer(Crop);
