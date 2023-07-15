import { POINT_TYPE } from '../enum/point-type';

/**
 * 锚点鼠标样式
 */
export const POINT_CURSORS = ['nwse', 'ns', 'nesw', 'ew'];

/** 拉伸点集合 */
export const POINT_LIST = [
  {
    point: POINT_TYPE.LEFT_TOP,
    className: 'left-top',
  },
  {
    point: POINT_TYPE.LEFT_CENTER,
    className: 'left-center',
  },
  {
    point: POINT_TYPE.LEFT_BOTTOM,
    className: 'left-bottom',
  },
  {
    point: POINT_TYPE.RIGHT_TOP,
    className: 'right-top',
  },
  {
    point: POINT_TYPE.RIGHT_CENTER,
    className: 'right-center',
  },
  {
    point: POINT_TYPE.RIGHT_BOTTOM,
    className: 'right-bottom',
  },
  {
    point: POINT_TYPE.TOP_CENTER,
    className: 'top-center',
  },
  {
    point: POINT_TYPE.BOTTOM_CENTER,
    className: 'bottom-center',
  },
];

/** 中间点最大的间隔 */
export const MIN_SPACING = 24;
/** 中间点的宽度 */
export const VERTICAL_AXIS_WIDTH = 8;
export const HORIZONTAL_AXIS_WIDTH = 18;

export const prefixCls = 'magic-editor-box';

/**
 * 拉伸类型
 */
export const ScaleTypeMap = {
  default: 'default',
  maskCover: 'mask-cover',
  maskContain: 'mask-contain',
} as const;
