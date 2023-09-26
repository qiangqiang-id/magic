import { makeObservable, observable } from 'mobx';
import MagicStruc from '@/models/MagicStruc';
import { getCreateMagicDefaultValues } from '@/config/DefaultValues';
import { CreateScene } from '@/models/FactoryStruc/SceneFactory';
import { product1 } from '@/config/Mocks';
import isEquals from '@/utils/equals';

export default class MagicStore extends MagicStruc {
  /** 全局loading */
  public globalLoading = false;

  /** 原本的作品数据 */
  private rawAppModel: MagicModel | null = null;

  constructor() {
    super();
    makeObservable(this, { globalLoading: observable });

    this.init();
  }

  private init() {
    const data = product1;
    if (data) {
      this.initData(data);
    } else {
      this.create();
    }
  }

  private initData(data: MagicModel) {
    const scenes = data.scenes.map(scene => CreateScene(scene));
    this.update({ ...data, scenes });
    this.activeScene(scenes[0] || null);
  }

  private create() {
    const scene = CreateScene();
    this.update({ ...getCreateMagicDefaultValues(), scenes: [scene] });
    this.activeScene(scene);
  }

  /** 检测内容是否改变 */
  hasChange(data: MagicModel) {
    return !isEquals(this.rawAppModel, data);
  }

  save() {
    console.log('保存数据');
  }
}
