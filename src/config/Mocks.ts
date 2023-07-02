import { LayerDefaultValues, ImageDefaultValues } from './DefaultValues';
import { LayerType } from '@/constants/LayerTypeEnum';
import { TEMPLATE_HEIGHT, TEMPLATE_WIDTH } from '@/constants/TemplateSize';
import { randomString } from '@/utils/random';

const backLayer: LayerModel.Background = {
  ...LayerDefaultValues,
  id: randomString(),
  name: '第一张图片',
  type: LayerType.BACKGROUND,
  color: 'orange',
  fillType: 'Color',
  width: TEMPLATE_WIDTH,
  height: TEMPLATE_HEIGHT,
  anchor: { x: 0, y: 0 },
  url: 'https://img.miaotui.com//common/mtv/2022/04/11/09/b3f91154c7c43ff71c8afbb27b93bc42.webp',
};

const layer1: LayerModel.Image = {
  ...ImageDefaultValues,
  id: randomString(),
  name: '第一张图片',
  type: LayerType.IMAGE,
  width: 800,
  height: 450,
  x: 100,
  y: 300,
  rotate: 0,
  url: 'https://img.miaotui.com//common/mtv/2022/04/11/09/b3f91154c7c43ff71c8afbb27b93bc42.webp',
};

const layer2: LayerModel.Image = {
  ...ImageDefaultValues,
  id: randomString(),
  name: '第二张图片',
  type: LayerType.IMAGE,
  width: 800,
  height: 450,
  x: 200,
  y: 800,
  rotate: 0,
  url: 'https://img.miaotui.com//common/mtv/2022/04/11/09/b3f91154c7c43ff71c8afbb27b93bc42.webp',
};

const scene1: SceneModel = {
  id: randomString(),
  name: '第一个页面',
  layers: [backLayer, layer1, layer2],
};

export const product1: MagicModel = {
  id: randomString(),
  name: '第一个作品',
  scenes: [scene1],
};
