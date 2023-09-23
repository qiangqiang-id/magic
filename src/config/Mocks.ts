import {
  getBackDefaultValues,
  getImageDefaultValues,
  getTextDefaultValues,
} from './DefaultValues';
import { LayerTypeEnum } from '@/constants/LayerTypeEnum';
import { MIME_TYPES } from '@/constants/MimeTypes';
import { TEMPLATE_HEIGHT, TEMPLATE_WIDTH } from '@/constants/TemplateSize';
import { randomString } from '@/utils/random';

const backLayer: LayerModel.Background = {
  ...getBackDefaultValues(),
  name: '第一张图片',
  width: TEMPLATE_WIDTH,
  height: TEMPLATE_HEIGHT,
  isLock: true,
  url: 'https://img.miaotui.com//common/mtv/2022/04/11/09/b3f91154c7c43ff71c8afbb27b93bc42.webp',
};

const layer1: LayerModel.Image = {
  ...getImageDefaultValues(),
  name: '第一张图片',
  type: LayerTypeEnum.IMAGE,
  width: 800,
  height: 450,
  x: 550,
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
  name: '第二张图片',
  type: LayerTypeEnum.IMAGE,
  width: 800,
  height: 450,
  x: 550,
  y: 1000,
  rotate: 0,
  url: 'https://img.miaotui.com//common/mtv/2022/04/11/09/b3f91154c7c43ff71c8afbb27b93bc42.webp',
  mask: {
    x: 0,
    y: 0,
    width: 800,
    height: 450,
  },
};

const layer3: LayerModel.Image = {
  ...getImageDefaultValues(),
  name: '第二张图片',
  type: LayerTypeEnum.IMAGE,
  width: 800,
  height: 450,
  x: 500,
  y: 1000,
  rotate: 0,
  url: 'https://img.shanjian.tv/common/mtv/2022/05/25/11/b33674519d8e5dcf6fd5aa7addd00d74.png',
  mimeType: MIME_TYPES.png,
  mask: {
    x: 0,
    y: 0,
    width: 800,
    height: 450,
  },
};

const textLayer: LayerModel.Text = {
  ...getTextDefaultValues(),
  width: 700,
  x: 300,
  y: 1300,
};

const scene1: SceneModel = {
  id: randomString(),
  name: '第一个页面',
  layers: [backLayer, layer1, layer2, layer3, textLayer],
  width: TEMPLATE_WIDTH,
  height: TEMPLATE_HEIGHT,
};

export const product1: MagicModel = {
  id: randomString(),
  name: '第一个作品',
  scenes: [scene1],
};
