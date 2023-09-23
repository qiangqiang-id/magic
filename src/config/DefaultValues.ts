import { LayerTypeEnum } from '@/constants/LayerTypeEnum';
import { TEMPLATE_HEIGHT, TEMPLATE_WIDTH } from '@/constants/TemplateSize';
import { randomString } from '@/utils/random';

/** 默认缩放值 */
export const ScaleDefault = { x: 1, y: 1 };

/** 默认锚点值 */
export const AnchorDefault = { x: 0.5, y: 0.5 };

export function getCreateMagicDefaultValues(): MagicModel {
  return {
    id: '',
    name: '',
    scenes: [],
  };
}

export function getSceneDefaultValues(): Required<SceneModel> {
  return {
    id: '',
    name: '',
    layers: [],
    cover: '',
    width: TEMPLATE_WIDTH,
    height: TEMPLATE_HEIGHT,
    actived: false,
  };
}

/**
 * 基础图层默认数据
 */
export function getLayerDefaultValues(): Required<LayerModel.Base> {
  return {
    id: randomString(),
    name: '',
    type: LayerTypeEnum.UNKNOWN,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    mask: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    rotate: 0,
    scale: { ...ScaleDefault },
    anchor: { ...AnchorDefault },
    actived: false,
    visible: true,
    isLock: false,
    disabled: false,
    opacity: 1,
    loading: false,
  };
}

export function getImageDefaultValues(): Required<LayerModel.Image> {
  return {
    ...getLayerDefaultValues(),
    type: LayerTypeEnum.IMAGE,
    url: '',
    originalHeight: 0,
    originalWidth: 0,
    fileType: '',
  };
}

export function getBackDefaultValues(): Required<LayerModel.Background> {
  return {
    ...getLayerDefaultValues(),
    type: LayerTypeEnum.BACKGROUND,
    isLock: true,
    fillType: 'Color',
    url: '',
    color: '#fff',
    anchor: { x: 0, y: 0 },
  };
}

export function getTextDefaultValues(): Required<LayerModel.Text> {
  return {
    ...getLayerDefaultValues(),
    type: LayerTypeEnum.TEXT,
    anchor: { x: 0, y: 0 },
    content: '双击编辑文字',
    charAttrs: [],
    isEditing: false,
    fontFamily: 'Arial',
    color: 'black',
    opacity: 1,
    strokes: [],
    fontSize: 100,
    height: 1.2 * 100,
    lineHeight: 1.2,
    letterSpacing: 0,
    fontWeight: 400,
    backgroundColor: 'transparent',
    backgroundAlpha: 100,
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    verticalAlign: 'top',
  };
}

export function getShapeDefaultValues(): Required<LayerModel.Shape> {
  return {
    ...getLayerDefaultValues(),
    type: LayerTypeEnum.SHAPE,
    shapeType: 'rect',
    rx: 0,
    ry: 0,
    fill: 'rgb(0,0,0)',
    strokeColor: '',
    strokeWidth: 0,
    strokeType: 'solid',
    strokeSpacing: 0,
    strokeLength: 0,
  };
}
