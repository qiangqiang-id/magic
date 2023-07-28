import { getSceneDefaultValues } from '@/config/DefaultValues';
import { createBackData } from './Layer';
import { randomString } from '@/utils/random';

/**
 * 创建一个空场景
 */
export function createSceneData(data?: Partial<SceneModel> | null): SceneModel {
  const layers = [
    createBackData(getSceneDefaultValues()),
    ...(data?.layers ?? []),
  ];
  return { ...getSceneDefaultValues(), id: randomString(), layers, ...data };
}
