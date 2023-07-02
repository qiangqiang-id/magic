import * as React from 'react';
import { RectData } from '../types/Editor';
import { ScaleHandlerOptions } from '../core/ScaleHandler';
import { POINT_TYPE } from '../enum/point-type';

/**
 * 鼠标事件属性
 */
export interface MouseEventProps<T extends HTMLElement = HTMLElement> {
  /** 鼠标点击时 */
  onClick?: (e: React.MouseEvent<T>) => void;
  /** 鼠标双击时 */
  onDoubleClick?: (e: React.MouseEvent<T>) => void;
  /** 鼠标右击时 */
  onContextMenu?: (e: React.MouseEvent<T>) => void;
  /** 鼠标按下时 */
  onMouseDown?: (e: React.MouseEvent<T>) => void;
  /** 鼠标弹起时 */
  onMouseUp?: (e: React.MouseEvent<T>) => void;
  /** 鼠标到达时 */
  onMouseEnter?: (e: React.MouseEvent<T>) => void;
  /** 鼠标移出时 */
  onMouseLeave?: (e: React.MouseEvent<T>) => void;
  /** 鼠标移动时 */
  onMouseMove?: (e: React.MouseEvent<T>) => void;
  /** 鼠标移入时 */
  onMouseOver?: (e: React.MouseEvent<T>) => void;
  /** 鼠标移开时 */
  onMouseOut?: (e: React.MouseEvent<T>) => void;
}

export interface EditorBoxProps
  extends Partial<ScaleHandlerOptions>,
    MouseEventProps<HTMLDivElement> {
  className?: string;
  editorPanelStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  /** 是否显示旋转点 */
  isShowRotate?: boolean;
  /** 矩形信息 */
  rectInfo: RectData;
  /** 拉伸点集合，默认所有点 */
  points?: POINT_TYPE[];
  /** 是否显示拉伸点以及旋转点 */
  isShowPoint?: boolean;
  /** 拉伸类型 default 默认拉伸； mask-cover铺满； mask-contain 平铺；
   *  mask-cover 和 mask-contain 只有rectInfo 存在mask才生效*/
  scaleType?: 'default' | 'mask-cover' | 'mask-contain';
  /** 缩放倍数 */
  zoomLevel?: number;
  /** 自定义元素 */
  extra?: React.ReactNode | ((rectData: RectData) => React.ReactNode);
  /** 开始拉伸
   * @param point 当前拉伸的点
   * @param e 事件对象
   */
  onStartScale?: (
    point: POINT_TYPE,
    e: MouseEvent
  ) => ScaleHandlerOptions | undefined;
  /** 拉伸中
   * @param point 当前拉伸的点
   * @param result 拉伸计算的结果
   * @param e 事件对象
   */
  onScale?: (result: RectData, point: POINT_TYPE, e: MouseEvent) => void;
  /** 结束拉伸 */
  onEndScale?: (point: POINT_TYPE, e: MouseEvent) => void;
  /** 开始旋转 */
  onRotateStart?: (e: MouseEvent) => void;
  /** 旋转中 */
  onRotate?: (rotate: number, e: MouseEvent) => void;
  /** 旋转结束 */
  onRotateEnd?: (e: MouseEvent) => void;
}
