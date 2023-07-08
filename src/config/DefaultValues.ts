import { LayerType } from '@/constants/LayerTypeEnum';

/** 默认缩放值 */
export const ScaleDefault = { x: 1, y: 1 };

/** 默认锚点值 */
export const AnchorDefault = { x: 0.5, y: 0.5 };

export const CreateMagicDefaultValues: MagicModel = {
  id: '',
  name: '',
  scenes: [],
};

export const SceneDefaultValues: SceneModel = {
  id: '',
  name: '',
  layers: [],
  cover: '',
  width: 1280,
  height: 720,
  actived: false,
};

/**
 * 基础图层默认数据
 */
export const LayerDefaultValues: LayerModel.Base = {
  id: '',
  name: '',
  type: LayerType.UNKNOWN,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  // mask: { x: 0, y: 0, width: 0, height: 0 },
  rotate: 0,
  scale: ScaleDefault,
  anchor: AnchorDefault,
  // tileBlurSize: 0,
  actived: false,
  visible: true,
  isLock: false,
  disabled: false,
  opacity: 1,
};

export const ImageDefaultValues: LayerModel.Image = {
  ...LayerDefaultValues,
  type: LayerType.IMAGE,
  url: '',
  originalHeight: 0,
  originalWidth: 0,
};

export const BackDefaultValues: LayerModel.Background = {
  ...LayerDefaultValues,
  type: LayerType.BACKGROUND,
  fillType: 'Color',
  url: '',
  color: '#fff',
  anchor: { x: 0, y: 0 },
};

export const TextDefaultValues: LayerModel.Text = {
  ...LayerDefaultValues,
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
