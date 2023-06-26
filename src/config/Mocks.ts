import { LayerType } from '@/constants/LayerTypeEnum';
import { randomString } from '@/utils/random';

const layer1: LayerModel.Layer = {
  id: randomString(),
  name: '第一张图片',
  type: LayerType.IMAGE,
  width: 300,
  height: 200,
  x: 0,
  y: 0,
  rotate: 0,
  url: 'https://img.miaotui.com//common/mtv/2022/04/11/09/b3f91154c7c43ff71c8afbb27b93bc42.webp',
};

const scene1: SceneModel = {
  id: randomString(),
  name: '第一个页面',
  layers: [layer1],
};

export const product1: MagicModel = {
  id: randomString(),
  name: '第一个作品',
  scenes: [scene1],
};
