import { makeObservable, observable, computed } from 'mobx';
import GroupStruc from './GroupStruc';
import SceneStruc from '../SceneStruc';
import { LayerType } from '@/constants/LayerTypeEnum';
import { filterSameData } from '@/utils/filterData';

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

  constructor(data?: Partial<LayerModel.Base> & Record<string, any>) {
    makeObservable(this, {
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
      isBack: computed,
      isImage: computed,
      isShape: computed,
      isText: computed,
      isGroup: computed,
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

  get isBack() {
    return this.type === LayerType.BACKGROUND;
  }

  get isImage() {
    return this.type === LayerType.IMAGE;
  }

  get isShape() {
    return this.type === LayerType.SHAPE;
  }

  get isText() {
    return this.type === LayerType.TEXT;
  }

  get isGroup() {
    return this.type === LayerType.GROUP;
  }
}
