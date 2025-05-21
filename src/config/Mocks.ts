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
  color: '#09152A',
  width: TEMPLATE_WIDTH,
  height: TEMPLATE_HEIGHT,
  isLock: true,
};

const layer1: LayerModel.Text = {
  ...getTextDefaultValues(),
  content: 'Magic',
  color: '#ffffff',
  width: 285,
  x: 110,
  y: 189,
  fontWeight: 'bold',
  rotate: 0,
};

const layer2: LayerModel.Text = {
  ...getTextDefaultValues(),
  width: 700,
  content: 'React + TypeScript + Vite',
  color: '#ffffff',
  fontSize: 54,
  x: 110,
  y: 329,
};

const layer3: LayerModel.Image = {
  ...getImageDefaultValues(),
  name: '第二张图片',
  type: LayerTypeEnum.IMAGE,
  width: 864,
  height: 889,
  x: 216,
  y: 794,
  rotate: 0,
  url: 'https://img.shanjian.tv/video/document/2025/05/21/17/1196x1280/3b76534d8cb09c15eacc42494c3cfd68.png',
  mimeType: MIME_TYPES.png,
  mask: {
    x: 0,
    y: 0,
    width: 864,
    height: 889,
  },
};

const scene1: SceneModel = {
  id: randomString(),
  name: '第一个页面',
  layers: [backLayer, layer1, layer2, layer3],
  width: TEMPLATE_WIDTH,
  height: TEMPLATE_HEIGHT,
};

const backLayer2: LayerModel.Background = {
  ...backLayer,
  color: '#F9CCAD',
};
const scene2: SceneModel = {
  id: randomString(),
  name: '第一个页面',
  layers: [backLayer2, layer1, layer2, layer3],
  width: TEMPLATE_WIDTH,
  height: TEMPLATE_HEIGHT,
};

export const product1: MagicModel = {
  id: randomString(),
  name: '第一个作品',
  scenes: [scene1, scene2],
};
