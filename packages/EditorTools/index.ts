// ========= core ==========
export { default as dragAction } from './core/dragAction';
export { default as ScaleHandler } from './core/ScaleHandler';
export { default as RotateHandler } from './core/RotateHandler';
export { default as MaskCoverScaleHandler } from './core/MaskCoverScaleHandler';
export { default as MaskContainScaleHandler } from './core/MaskContainScaleHandler';
export { default as MagneticLineHandler } from './core/MagneticLineHandler';

// ======== enum ==========
export { POINT_TYPE } from './enum/point-type';

// ======== helper ========
export {
  calcRotatedPoint,
  toRadian,
  toAngle,
  getMiddlePoint,
  getRectCenter,
  getMaskInCanvasRectData,
  valuesToDivide,
  valuesToMultiply,
  pointToAnchor,
  pointToTopLeft,
  getRectRotatedRange,
} from './helper/math';
export {
  pointInRect,
  isCenterPoint,
  keepDecimal,
  processToEditableData,
  processToRawData,
} from './helper/utils';

// =========== types ================
export type { RectData, Coordinate, BaseRectData, Size } from './types/Editor';
export type { EditorBoxProps } from './EditorBox/props';
export type { ScaleHandlerOptions } from './core/ScaleHandler';
export type { MagneticLineType, LineData, Range } from './types/MagneticLine';

// =========== components =============
export { default as EditorBox } from './EditorBox';
export { default as MagneticLine } from './MagneticLine';
