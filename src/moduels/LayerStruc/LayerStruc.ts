import { makeObservable, observable } from 'mobx';

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

  visible?: boolean | undefined;

  isLock?: boolean | undefined;

  disabled?: boolean | undefined;

  loading?: boolean | undefined;

  parent?: null;

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
      parent: observable,
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
      parent: this.parent,
    };
  }
}
