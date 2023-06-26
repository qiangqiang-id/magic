import { makeObservable, observable } from 'mobx';
import SceneStruc from '../SceneStruc';
import { Layer } from '@/types/model';

export default class MagicStruc implements MagicModel {
  id!: string | null;

  name!: string | null;

  /** 所有的场景 */
  scenes!: SceneStruc[];

  /** 激活的场景 */
  activedScene!: SceneStruc;

  /** 当前被激活的图层 */
  activedLayers: Layer[] = [];

  constructor() {
    makeObservable(this, {
      name: observable,
      scenes: observable,
      activedScene: observable,
      activedLayers: observable,
    });
  }
}
