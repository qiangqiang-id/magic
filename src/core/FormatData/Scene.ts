import { SceneDefaultValues } from '@/config/DefaultValues';
import { createBackData } from './Layer';
import { randomString } from '@/utils/random';

/**
 * 创建一个空场景
 */
export function createEmptySceneData(): SceneModel {
  const layers = [createBackData(null, SceneDefaultValues)];
  return { ...SceneDefaultValues, id: randomString(), layers };
}
