import { makeObservable, observable, action } from 'mobx';
import { cloneDeep } from 'lodash';
import {
  pointToTopLeft,
  getRectRotatedRange,
  RectData,
  getMaskInCanvasRectData,
} from '@p/EditorTools';
import GroupStruc from './GroupStruc';
import SceneStruc from '../SceneStruc';
import { LayerTypeEnum } from '@/constants/LayerTypeEnum';
import { filterSameData } from '@/utils/filterData';
import { randomString } from '@/utils/random';
import CreateLayerStruc from '../FactoryStruc/LayerFactory';
import { LayerStrucType } from '@/types/model';
import { ScaleDefault } from '@/config/DefaultValues';
import { COPY_OFFSET_RATIO } from '@/constants/LayerRatio';
import { magic } from '@/store';
import ImageStruc from './ImageStruc';
import ShapeStruc from './ShapeStruc';
import BackgroundStruc from './BackgroundStruc';
import TextStruc from './TextStruc';
import { PixelKey } from '@/types/canvas';
import { layerHistoryDecorator } from '@/core/Decorator/History';
import { UpdateOptions } from '@/types/updateOptions';

/**
 * 连续的操作记录集合
 */
const continuousMaps = new Map<string, any>();

export default class LayerStruc<T extends LayerModel.Base = LayerModel.Base>
  implements LayerModel.Base
{
  id!: string;

  name?: string;

  type!: LayerModel.LayerType;

  anchor?: Anchor;

  scale?: Scale;

  width?: number;

  height?: number;

  x?: number;

  y?: number;

  rotate?: number;

  opacity?: number;

  actived?: boolean;

  visible?: boolean;

  isLock?: boolean;

  disabled?: boolean;

  loading?: boolean;

  /** 所在的组合 */
  group?: GroupStruc | null = null;

  /** 所在的场景 */
  scene?: SceneStruc | null = null;

  mask?: Rect;

  constructor(data?: Partial<LayerModel.Base>) {
    makeObservable<this, 'handleUpdate'>(this, {
      name: observable,
      type: observable,
      scale: observable,
      width: observable,
      height: observable,
      x: observable,
      y: observable,
      rotate: observable,
      actived: observable,
      visible: observable,
      isLock: observable,
      loading: observable,
      disabled: observable,
      opacity: observable,
      mask: observable,
      handleUpdate: action,
    });

    for (const k in data) {
      if (k in this) {
        this[k] = data[k];
      }
    }
  }

  /**
   * 输出组件model结构
   */
  model(): LayerModel.Base {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      anchor: this.anchor,
      width: this.width,
      height: this.height,
      opacity: this.opacity,
      x: this.x,
      y: this.y,
      scale: this.scale,
      rotate: this.rotate,
      visible: this.visible,
      isLock: this.isLock,
      loading: this.loading,
      disabled: this.disabled,
      group: this.group,
      scene: this.scene,
      mask: this.mask,
      /** todo 导出数据默认为false，外部暂时不需要这个状态 */
      actived: false,
    };
  }

  @layerHistoryDecorator(function (_data: Partial<T>, options?: UpdateOptions) {
    const { ignore = false, isContinuous = false } = options || {};
    if (ignore) return null;

    if (isContinuous) {
      if (!continuousMaps.get(this.id)) {
        continuousMaps.set(this.id, this.model());
      }
      return null;
    }

    const last = continuousMaps.get(this.id) || this.model();
    continuousMaps.delete(this.id);

    return () => this.handleUpdate(last);
  })
  public update(
    data: Partial<T> | Partial<LayerModel.Base>,
    _options?: UpdateOptions
  ) {
    this.handleUpdate(data);
  }

  /**
   * 激活/选中组件
   */
  public active() {
    this.actived = true;
  }

  /**
   * 取消选中
   */
  public inactive() {
    this.actived = false;
  }

  /**
   * 复制
   */
  public clone(): LayerStrucType {
    const { width: parentWidth = 0, height: parentHeight = 0 } =
      this.getParent() ?? {};
    const model = cloneDeep(this.model());
    model.id = randomString();
    model.x = (model.x || 0) + COPY_OFFSET_RATIO * parentWidth;
    model.y = (model.y || 0) + COPY_OFFSET_RATIO * parentHeight;
    model.actived = false;
    return CreateLayerStruc(model.type, model, this.getParent());
  }

  /**
   * 删除
   */
  public remove() {
    const parent = this.getParent();
    parent?.removeLayer(this);
  }

  /**
   * 复制
   */
  public copy() {
    const parent = this.getParent();
    parent?.copyLayer(this);
  }

  /**
   * 翻转X
   *  */
  public flipX() {
    const scale = { ...ScaleDefault, ...this.scale };
    scale.x *= -1;
    this.update({ scale });
  }

  /**
   * 翻转Y
   *  */
  public flipY() {
    const scale = { ...ScaleDefault, ...this.scale };
    scale.y *= -1;
    this.update({ scale });
  }

  /**
   * 位置贴顶部
   */
  public toTopInCanvas() {
    const rectData = this.getRectData();
    const { yRange } = getRectRotatedRange(rectData);
    const moveY = yRange[0];
    this.update({ y: this.getSafetyModalData().y - moveY });
  }

  /**
   * 位置贴底部
   * 逻辑：获取到旋转矩形的最大包围盒，因旋转中心相同，可直接加减偏移位置
   */
  public toBottomInCanvas() {
    const { activedScene } = magic;
    const templateHeight = activedScene?.height || 0;
    const rectData = this.getRectData();
    const { yRange } = getRectRotatedRange(rectData);
    const moveY = yRange[1] - templateHeight;
    this.update({ y: this.getSafetyModalData().y - moveY });
  }

  /**
   * 位置贴左部
   */
  public toLeftInCanvas() {
    const rectData = this.getRectData();
    const { xRange } = getRectRotatedRange(rectData);
    const moveX = xRange[0];
    this.update({ x: this.getSafetyModalData().x - moveX });
  }

  /**
   * 位置贴右部
   */
  public toRightInCanvas() {
    const { activedScene } = magic;
    const templateWidth = activedScene?.width || 0;
    const rectData = this.getRectData();
    const { xRange } = getRectRotatedRange(rectData);
    const moveX = xRange[1] - templateWidth;
    this.update({ x: this.getSafetyModalData().x - moveX });
  }

  /**
   * 垂直居中
   * */
  public toVerticalCenterAlignInCanvas(update = true) {
    const { activedScene } = magic;
    const templateHeight = activedScene?.height || 0;
    const rectData = this.getRectData();
    const { yRange } = getRectRotatedRange(rectData);
    /** 范围的高度 */
    const height = yRange[1] - yRange[0];
    /** 移动距离 */
    const moveY = yRange[1] - templateHeight / 2 - height / 2;
    const updateData = { y: this.getSafetyModalData().y - moveY };
    update && this.update(updateData);
    return updateData;
  }

  /**
   * 水平居中
   * */
  public toHorizontalCenterAlignInCanvas(update = true) {
    const { activedScene } = magic;
    const templateWidht = activedScene?.width || 0;
    const rectData = this.getRectData();
    const { xRange } = getRectRotatedRange(rectData);
    /** 范围的宽度 */
    const width = xRange[1] - xRange[0];
    /** 移动距离 */
    const moveX = xRange[1] - templateWidht / 2 - width / 2;
    const updateData = { x: this.getSafetyModalData().x - moveX };
    update && this.update(updateData);
    return updateData;
  }

  /**
   * 居中
   */
  public toCenterAlignInCanvas() {
    const horizontalData = this.toHorizontalCenterAlignInCanvas(false);
    const verticalData = this.toVerticalCenterAlignInCanvas(false);
    this.update({ ...horizontalData, ...verticalData });
  }

  /**
   * 切换锁状态
   *  */
  public switchLock() {
    this.update({ isLock: !this.isLock });
  }

  /**
   * 获取模块的安全数据
   */
  public getSafetyModalData() {
    const {
      x = 0,
      y = 0,
      width = 0,
      height = 0,
      rotate = 0,
      anchor = { x: 0, y: 0 },
      scale = { x: 1, y: 1 },
      mask = { x: 0, y: 0, width: 0, height: 0 },
    } = this;

    return {
      x,
      y,
      width,
      height,
      anchor,
      scale,
      rotate,
      mask,
    };
  }

  /**
   * 解除父级所属
   */
  resetParent() {
    this.scene = null;
    this.group = null;
  }

  /**
   * 获取左上角位置
   * 因为位置储存的是基于锚点的位置，不能进行计算
   *  */
  public getPointAtTopLeft() {
    const { width, height, x, y, anchor } = this.getSafetyModalData();
    return pointToTopLeft({ width, height, x, y, anchor });
  }

  /**
   * 获取矩形数据，定位移动到了左上角，并且合并了mask 框数据
   * @returns {RectData} 矩形数据
   */
  public getRectData() {
    let rectData: Required<RectData> = {
      ...this.getSafetyModalData(),
      ...this.getPointAtTopLeft(),
    };
    if (this.isImage()) {
      rectData = getMaskInCanvasRectData(rectData) as Required<RectData>;
    }
    return rectData;
  }

  /**
   * 获取索引
   */
  public getIndex(): number {
    return this.scene?.layers?.findIndex(cmps => cmps.id === this.id) || -1;
  }

  /**
   * 移动位置
   */
  public onMove(targetIndex: number) {
    const { scene } = this;
    if (!scene) return;
    const currentIndex = this.getIndex();
    const layers = [...(scene.layers || [])];
    layers.splice(targetIndex, 0, ...layers.splice(currentIndex, 1));
    scene.update({ layers });
  }

  /**
   * 下一级
   *  */
  public toDown() {
    if (this.isFirstLayer) return;
    const targetIndex = this.getIndex() - 1;
    this.onMove(targetIndex);
  }

  /**
   * 置底
   *  */
  public toBottom() {
    if (this.isFirstLayer) return;
    this.onMove(1);
  }

  /**
   * 上一级
   *  */
  public toUp() {
    if (this.isLastLayer) return;
    const targetIndex = this.getIndex() + 1;
    this.onMove(targetIndex);
  }

  /**
   * 置顶
   *  */
  public toTop() {
    if (this.isLastLayer) return;
    const targetIndex = Math.max((this.scene?.layers || []).length - 1, 0);
    this.onMove(targetIndex);
  }

  /**
   * 返回父级：场景或者组合
   */
  public getParent() {
    return this.scene || this.group;
  }

  /**
   * 获取根父节点
   */
  public getRootParent() {
    let parent = this.getParent();
    while (parent && !(parent instanceof SceneStruc)) {
      parent = parent.getParent();
    }
    return parent;
  }

  /**
   * 在当前位置上增加偏移
   * @param value 偏移值
   * @param styleKey 方向属性key
   */
  public addPixel(value: number, styleKey: PixelKey) {
    const px = this.getNumPixel(styleKey);
    this.setNumPixel(px + value, styleKey);
  }

  /**
   * 获取数字像素
   * @param styleKey 属性
   * @returns {number}
   */
  public getNumPixel(styleKey: PixelKey): number {
    const safetyModalData = this.getSafetyModalData();
    const pixel = safetyModalData[styleKey];
    return pixel;
  }

  /**
   * 设置方位的具体数值
   * @param value 偏离值
   * @param styleKey 方向属性key
   */
  public setNumPixel(value: number, styleKey: PixelKey) {
    this.update({ [styleKey]: value });
  }

  /**
   * 更新组件数据
   * @param data 组件当前数据
   */
  protected handleUpdate(data: Partial<T> | Partial<LayerModel.Base>) {
    const updateData = filterSameData(this.model(), data);
    Object.keys(updateData).forEach(key => {
      this[key] = updateData[key];
    });
  }

  /**
   * 是否是背景
   * @readonly
   * @memberof LayerStruc
   */
  public isBack(): this is BackgroundStruc {
    return this.type === LayerTypeEnum.BACKGROUND;
  }

  /**
   * 是否是图片
   * @readonly
   * @memberof LayerStruc
   */
  public isImage(): this is ImageStruc {
    return this.type === LayerTypeEnum.IMAGE;
  }

  /**
   * 是否是形状
   * @readonly
   * @memberof LayerStruc
   */
  public isShape(): this is ShapeStruc {
    return this.type === LayerTypeEnum.SHAPE;
  }

  /**
   * 是否是文字
   * @readonly
   * @memberof LayerStruc
   */
  public isText(): this is TextStruc {
    return this.type === LayerTypeEnum.TEXT;
  }

  /**
   * 是否是组合
   * @readonly
   * @memberof LayerStruc
   */
  public isGroup(): this is GroupStruc {
    return this.type === LayerTypeEnum.GROUP;
  }

  /** 是否可copy, 默认可copy，再由子类重写 */
  get isCanCopy() {
    return true;
  }

  /**
   * 层级是否第一个
   *  */
  get isFirstLayer() {
    const index = this.getIndex();
    /** 背景应该是在最下面，背景的索引永远是0 */
    const firstIndex = this.isBack() ? 0 : 1;
    return index === firstIndex;
  }

  /**
   * 层级是否是最后一个
   *  */
  get isLastLayer() {
    const { scene } = this;
    if (!scene?.layers) return false;
    const index = this.getIndex();
    return index === scene.layers.length - 1;
  }
}
