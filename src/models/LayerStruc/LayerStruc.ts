import { makeObservable, observable } from 'mobx';
import GroupStruc from './GroupStruc';
import SceneStruc from '../SceneStruc';

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
}