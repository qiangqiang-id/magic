import { CSSProperties } from 'react';
import { getMaskInCanvasRectData, pointToTopLeft } from '@p/EditorTools';
import { LayerStrucType } from '@/types/model';

/**
 * 应用在容器上的样式
 */
const onContainerKeys = ['width', 'height', 'opacity'];

/**
 * 在图层上的样式
 */
const onLayerKeys = [
  'fontFamily',
  'color',
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'fontWeight',
  'backgroundColor',
];

/**
 * 获取图层容器上的样式
 * @param model 组件数据
 * @param zoomLevel 缩放比例
 * @returns CSSProperties
 */
export function getLayerOuterStyles<M extends LayerStrucType = LayerStrucType>(
  model: M,
  zoomLevel = 1
): CSSProperties {
  let containeStyle: CSSProperties = onContainerKeys.reduce((styles, key) => {
    if (Reflect.has(model, key)) {
      return {
        ...styles,
        [key]: model[key],
      };
    }
    return styles;
  }, {});

  /** 禁用 */
  if (model.disabled) {
    const { opacity = 1 } = model;
    containeStyle.opacity = +opacity * 0.5;
  }
  containeStyle = {
    ...containeStyle,
    ...getLayerRectStyles(model, zoomLevel),
  };

  return containeStyle;
}

/**
 *  单独拼接transform
 * @param style 组件样式属性
 * @zoomLevel zoomLevel 缩放比例
 * @returns 图层的transform
 */
export function getLayerRectStyles<M extends LayerStrucType = LayerStrucType>(
  model: M,
  zoomLevel = 1
): CSSProperties {
  const {
    x = 0,
    y = 0,
    rotate = 0,
    width = 0,
    height = 0,
    anchor = { x: 0, y: 0 },
    mask,
  } = model;

  const topLeftPoint = pointToTopLeft({ x, y, width, height, anchor });
  let layerWidth = width;
  let layerHeight = height;
  let layerLeft = topLeftPoint.x;
  let layerTop = topLeftPoint.y;

  /** 处理图片蒙层 */
  if (model.isImage) {
    const maskInCanvasRectData = getMaskInCanvasRectData({
      ...topLeftPoint,
      width,
      height,
      mask,
    });
    layerWidth = maskInCanvasRectData.width;
    layerHeight = maskInCanvasRectData.height;
    layerLeft = maskInCanvasRectData.x;
    layerTop = maskInCanvasRectData.y;
  }

  return {
    width: layerWidth * zoomLevel,
    height: layerHeight * zoomLevel,
    transform: `translate(${layerLeft * zoomLevel}px,${
      layerTop * zoomLevel
    }px) rotate(${rotate}deg)`,
  };
}

/**
 * 获取图层的内部样式
 * @param model
 * @param zoomLevel
 * @returns {CSSProperties}
 */
export function getLayerInnerStyles<M extends LayerStrucType = LayerStrucType>(
  model: M,
  zoomLevel = 1
): CSSProperties {
  let styles = onLayerKeys.reduce((styles, key) => {
    if (Reflect.has(model, key)) {
      return {
        ...styles,
        [key]: model[key],
      };
    }
    return styles;
  }, {});

  if (model.isImage) {
    styles = {
      ...styles,
      ...getMaskStyle(model, zoomLevel),
    };
  }

  return styles;
}

/**
 * 获取蒙层样式
 * @param model
 * @param zoomLevel
 * @returns {CSSProperties}
 */
export function getMaskStyle<M extends LayerStrucType = LayerStrucType>(
  model: M,
  zoomLevel = 1
): CSSProperties {
  const { mask, width = 0, height = 0 } = model;
  if (!mask) return {};
  const { x, y } = mask;

  return {
    width: width * zoomLevel,
    height: height * zoomLevel,
    transform: `translate(${-x * zoomLevel}px,${-y * zoomLevel}px)`,
  };
}
