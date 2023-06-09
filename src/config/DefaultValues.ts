import { LayerType } from '@/constants/LayerTypeEnum';
import { TEMPLATE_HEIGHT, TEMPLATE_WIDTH } from '@/constants/TemplateSize';

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
    id: '',
    name: '',
    type: LayerType.UNKNOWN,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    // mask: { x: 0, y: 0, width: 0, height: 0 },
    rotate: 0,
    scale: { ...ScaleDefault },
    anchor: { ...AnchorDefault },
    // tileBlurSize: 0,
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
    type: LayerType.IMAGE,
    url: '',
    originalHeight: 0,
    originalWidth: 0,
    fileType: '',
  };
}

export function getBackDefaultValues(): Required<LayerModel.Background> {
  return {
    ...getLayerDefaultValues(),
    type: LayerType.BACKGROUND,
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
    type: LayerType.TEXT,
    content: '双击编辑文字',
    charAttrs: [],
    isEditing: false,
    fontFamily: '',
    color: 'black',
    opacity: 100,
    strokes: [],
    fontSize: 45,
    lineHeight: 1.2,
    letterSpacing: 0,
    fontWeight: 400,
    backgroundColor: 'transparent',
    backgroundAlpha: 100,
  };
}
