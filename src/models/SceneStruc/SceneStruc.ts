import { makeObservable, observable } from 'mobx';
import { Layer } from '@/types/model';
import { SceneDefaultValues } from '@/config/DefaultValues';
import { deepMerge } from '@/utils/mergeData';

export default class SceneStruc implements SceneModel {
  id!: string;

  name!: string;

  layers?: Layer[];

  cover?: string;

  width?: number;

  height?: number;

  actived?: boolean | null;

  constructor(data?: Partial<SceneModel> | null) {
    makeObservable(this, {
      name: observable,
      layers: observable,
      cover: observable,
      width: observable,
      height: observable,
      actived: observable,
    });

    const createData = deepMerge(SceneDefaultValues, data || {});

    for (const k in createData) {
      if (k in this) {
        this[k] = createData[k];
      }
    }
  }

  model(): SceneModel {
    return {
      id: this.id,
      name: this.name,
      layers: this.layers,
      cover: this.cover,
      width: this.width,
      height: this.height,
      actived: this.actived,
    };
  }
}
