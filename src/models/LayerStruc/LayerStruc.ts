import { makeObservable, observable, computed, action } from 'mobx';
import { cloneDeep } from 'lodash';
import GroupStruc from './GroupStruc';
import SceneStruc from '../SceneStruc';
import { LayerTypeEnum } from '@/constants/LayerTypeEnum';
import { filterSameData } from '@/utils/filterData';
import { randomString } from '@/utils/random';
import CreateLayerStruc from '../FactoryStruc/LayerFactory';
import { LayerStrucType } from '@/types/model';
import { ScaleDefault } from '@/config/DefaultValues';
import { COPY_OFFSET_RATIO } from '@/constants/LayerRatio';

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

  update<T extends Partial<LayerModel.Base> = Partial<LayerModel.Base>>(
    data: T
  ) {
    this.handleUpdate(data);
  }

  /**
   * 激活/选中组件
   */
  active() {
    this.actived = true;
  }

  /**
   * 取消选中
   */
  inactive() {
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
  clone(): LayerStrucType {
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
  remove() {
    const parent = this.getParent();
    parent?.removeLayer(this);
  }

  /**
   * 复制
   */
  copy() {
    const parent = this.getParent();
    parent?.copyLayer(this);
  }

  /** 翻转X */
  flipX() {
    const scale = { ...ScaleDefault, ...this.scale };
    scale.x *= -1;
    this.update({ scale });
  }

  /**
   * 返回父级：场景或者组合
   */
  getParent() {
    return this.scene || this.group;
  }

  /**
   * 获取根父节点
   */
  getRootParent() {
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
