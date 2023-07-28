import SceneStruc from '../SceneStruc';

export function CreateScene<T extends SceneModel>(data?: Partial<T> | null) {
  return new SceneStruc(data);
}
