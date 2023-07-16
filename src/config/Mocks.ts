import { getBackDefaultValues, getImageDefaultValues } from './DefaultValues';
import { LayerType } from '@/constants/LayerTypeEnum';
import { TEMPLATE_HEIGHT, TEMPLATE_WIDTH } from '@/constants/TemplateSize';
import { randomString } from '@/utils/random';

const backLayer: LayerModel.Background = {
  ...getBackDefaultValues(),
  id: randomString(),
  name: '第一张图片',
  width: TEMPLATE_WIDTH,
  height: TEMPLATE_HEIGHT,
  isLock: true,
  url: 'https://img.miaotui.com//common/mtv/2022/04/11/09/b3f91154c7c43ff71c8afbb27b93bc42.webp',
};

const layer1: LayerModel.Image = {
  ...getImageDefaultValues(),
  id: randomString(),
  name: '第一张图片',
  type: LayerType.IMAGE,
  width: 800,
  height: 450,
  x: 100,
  y: 300,
  rotate: 0,
  url: 'https://img.miaotui.com//common/mtv/2022/04/11/09/b3f91154c7c43ff71c8afbb27b93bc42.webp',
  mask: {
    x: 0,
    y: 0,
    width: 800,
    height: 450,
  },
};

const layer2: LayerModel.Image = {
  ...getImageDefaultValues(),
  id: randomString(),
  name: '第二张图片',
  type: LayerType.IMAGE,
  width: 800,
  height: 450,
  x: 200,
  y: 800,
  rotate: 0,
  url: 'https://img.miaotui.com//common/mtv/2022/04/11/09/b3f91154c7c43ff71c8afbb27b93bc42.webp',
  mask: {
    x: 0,
    y: 0,
    width: 800,
    height: 450,
  },
};

const scene1: SceneModel = {
  id: randomString(),
  name: '第一个页面',
  layers: [backLayer, layer1, layer2],
  width: TEMPLATE_WIDTH,
  height: TEMPLATE_HEIGHT,
};

export const product1: MagicModel = {
  id: randomString(),
  name: '第一个作品',
  scenes: [scene1],
};
