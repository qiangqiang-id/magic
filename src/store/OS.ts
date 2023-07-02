import { makeAutoObservable } from 'mobx';
import { MagneticLineType } from '@p/EditorTools';
import LocalCache from '@/core/Manager/LocalCache';
import { CANVAS_ZOOM_LEVEL } from '@/constants/CacheKeys';
import {
  CANVAS_MAX_ZOOM_LEVEL,
  CANVAS_MIN_ZOOM_LEVEL,
} from '@/constants/ZoomLevel';

export default class OSStore {
  /** 画布缩放等级 */
  zoomLevel = LocalCache.get(CANVAS_ZOOM_LEVEL, 'number') ?? 1;

  /** 是否在移动中 */
  isMoveing = false;

  /** 是否旋转中 */
  isRotateing = false;

  /** 是否拉伸中 */
  isScaleing = false;

  /** 磁力线集合 */
  magneticLines: MagneticLineType[] | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 是否可以放大
   * @readonly
   * @memberof OSStore
   */
  get canZoomIn() {
    return this.zoomLevel < CANVAS_MAX_ZOOM_LEVEL;
  }

  /**
   * 是否可以缩小
   * @readonly
   * @memberof OSStore
   */
  get canZoomOut() {
    return this.zoomLevel > CANVAS_MIN_ZOOM_LEVEL;
  }

  /**
   * 设置画布缩放登记
   * @param level 传入的等级
   */
  setZoomLevel(level: number) {
    this.handleSetZoomLevel(level);
  }

  /**
   * 放大画布
   */
  zoomIn() {
    this.setZoomLevel(this.zoomLevel + 0.1);
  }

  /**
   * 缩小画布
   */
  zoomOut() {
    this.setZoomLevel(this.zoomLevel - 0.1);
  }

  /**
   * 缩到最小
   */
  zoomMin() {
    this.setZoomLevel(CANVAS_MIN_ZOOM_LEVEL);
  }

  /**
   * 缩到最大
   */
  zoomMax() {
    this.setZoomLevel(CANVAS_MAX_ZOOM_LEVEL);
  }

  /**
   * 恢复默认
   */
  zoomReset() {
    this.setZoomLevel(1);
  }

  protected handleSetZoomLevel(level: number) {
    level = +level.toFixed(2);
    this.zoomLevel = Math.max(
      CANVAS_MIN_ZOOM_LEVEL,
      Math.min(CANVAS_MAX_ZOOM_LEVEL, level)
    );
    LocalCache.set(CANVAS_ZOOM_LEVEL, this.zoomLevel);
  }

  /**
   * 设置移动状态
   * @memberof OSStore
   */
  setMoveState(isMoveing: boolean) {
    this.isMoveing = isMoveing;
  }

  /**
   * 设置旋转状态
   * @memberof OSStore
   */
  setRotateState(isRotateing: boolean) {
    this.isRotateing = isRotateing;
  }

  /**
   * 设置移动状态
   * @memberof OSStore
   */
  setScaleState(isScaleing: boolean) {
    this.isScaleing = isScaleing;
  }

  /**
   * 设置磁力线
   */
  setMagneticLine(lines: MagneticLineType[]) {
    this.magneticLines = lines;
  }

  /**
   * 清除磁力线
   */
  clearMagneticLines() {
    this.magneticLines = null;
  }
}
