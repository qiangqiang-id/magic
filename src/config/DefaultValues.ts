import { LayerType } from '@/constants/LayerTypeEnum';
import { randomString } from '@/utils/random';
/** 默认缩放值 */
export const ScaleDefault = { x: 1, y: 1 };

/** 默认锚点值 */
export const AnchorDefault = { x: 0.5, y: 0.5 };

export const CreateMagicDefaultValues: MagicModel = {
  id: randomString(),
  name: '',
  scenes: [],
};

export const SceneDefaultValues: SceneModel = {
  id: randomString(),
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
  id: randomString(),
  name: '',
  type: LayerType.UNKNOWN,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  // mask: { x: 0, y: 0, width: 0, height: 0 },
  // alpha: 1,
  rotate: 0,
  scale: ScaleDefault,
  anchor: AnchorDefault,
  // tileBlurSize: 0,
  actived: false,
  visible: true,
  isLock: false,
  disabled: false,
  alpha: 1,
};

export const ImageDefaultValues: LayerModel.Image = {
  ...LayerDefaultValues,
  url: '',
  originalHeight: 0,
  originalWidth: 0,
};
