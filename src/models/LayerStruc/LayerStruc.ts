import { makeObservable, observable, computed, action } from 'mobx';
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

export default class LayerStruc implements LayerModel.Base {
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

  constructor(data?: Partial<LayerModel.Base> & Record<string, any>) {
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
      isBack: computed,
      isImage: computed,
      isShape: computed,
      isText: computed,
      isGroup: computed,
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
  model(): LayerModel.Base & Record<string, any> {
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
      actived: this.actived,
      visible: this.visible,
      isLock: this.isLock,
      loading: this.loading,
      disabled: this.disabled,
      group: this.group,
      scene: this.scene,
      mask: this.mask,
    };
  }

  public update<T extends Partial<LayerModel.Base> = Partial<LayerModel.Base>>(
    data: T
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
   * 更新组件数据
   * @param data 组件当前数据
   */
  protected handleUpdate<
    T extends Partial<LayerModel.Base> = Partial<LayerModel.Base>
  >(data: T) {
    const updateData = filterSameData(this.model(), data);
    if (Object.keys(updateData).length === 0) return;

    Object.keys(updateData).forEach(key => {
      this[key] = updateData[key];
    });
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
   * 锁
   *  */
  public lock() {
    this.update({ isLock: true });
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
   * 解锁
   *  */
  public unlock() {
    this.update({ isLock: false });
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
    let rectData: RectData = {
      ...this.getSafetyModalData(),
      ...this.getPointAtTopLeft(),
    };
    if (this.isImage) {
      rectData = getMaskInCanvasRectData(rectData);
    }
    return rectData;
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
   * 是否是背景
   * @readonly
   * @memberof LayerStruc
   */
  get isBack() {
    return this.type === LayerTypeEnum.BACKGROUND;
  }

  /**
   * 是否是图片
   * @readonly
   * @memberof LayerStruc
   */
  get isImage() {
    return this.type === LayerTypeEnum.IMAGE;
  }

  /**
   * 是否是形状
   * @readonly
   * @memberof LayerStruc
   */
  get isShape() {
    return this.type === LayerTypeEnum.SHAPE;
  }

  /**
   * 是否是文字
   * @readonly
   * @memberof LayerStruc
   */
  get isText() {
    return this.type === LayerTypeEnum.TEXT;
  }

  /**
   * 是否是组合
   * @readonly
   * @memberof LayerStruc
   */
  get isGroup() {
    return this.type === LayerTypeEnum.GROUP;
  }
}
