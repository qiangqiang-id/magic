import { makeObservable, observable } from 'mobx';
import MagicStruc from '@/models/MagicStruc';
import { CreateMagicDefaultValues } from '@/config/DefaultValues';
import { createScene } from '@/models/FactoryStruc/SceneFactory';

export default class MagicStore extends MagicStruc {
  /** 全局loading */
  public globalLoading = false;

  constructor() {
    super();
    makeObservable(this, { globalLoading: observable });

    this.init();
  }

  private init() {
    this.create();
  }

  private create() {
    const scene = createScene();
    this.update({ ...CreateMagicDefaultValues, scenes: [scene] });
    this.activeScene(scene);
  }
}
