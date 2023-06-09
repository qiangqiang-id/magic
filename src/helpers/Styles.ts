import { CSSProperties } from 'react';
import { pointToTopLeft } from '@p/EditorTools';
import { LayerStrucType } from '@/types/model';

/**
 * 应用在容器上的样式
 */
const onContainerKeys = [
  'width',
  'height',
  'paddingTop',
  'paddingRight',
  'paddingLeft',
  'paddingBottom',
  'padding',
  'lineHeight',
  'opacity',
];

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
  } = model;

  const rectData = pointToTopLeft({ x, y, width, height, anchor });

  return {
    width: width * zoomLevel,
    height: height * zoomLevel,
    transform: `translate(${rectData.x * zoomLevel}px,${
      rectData.y * zoomLevel
    }px) rotate(${rotate}deg)`,
    transformOrigin: `${anchor.x * 100}% ${anchor.y * 100}%`,
  };
}

export function getLayerInnerStyles<M extends LayerStrucType = LayerStrucType>(
  model: M
) {
  return onLayerKeys.reduce((styles, key) => {
    if (Reflect.has(model, key)) {
      return {
        ...styles,
        [key]: model[key],
      };
    }
    return styles;
  }, {});
}
