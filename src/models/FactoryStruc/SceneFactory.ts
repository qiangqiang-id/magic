import SceneStruc from '../SceneStruc';

export function createScene<T extends SceneModel>(data?: Partial<T> | null) {
  return new SceneStruc(data);
}
