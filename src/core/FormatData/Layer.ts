import { ImageResource } from '@/types/resource';
import SceneStruc from '@/models/SceneStruc';
import { randomString } from '@/utils/random';
import {
  getImageDefaultValues,
  getTextDefaultValues,
  getBackDefaultValues,
} from '@/config/DefaultValues';

/** 图片加入画布比例 */
const ADD_IMAGE_TO_CANVAS_RATE = 0.7;

/** 图片加入画布比例 */
const ADD_TEXT_TO_CANVAS_RATE = 0.05;

/**
 * 创建图片数据
 */
export function createImageData(
  resource: ImageResource,
  scene: SceneStruc
): LayerModel.Image {
  const { width = 0, height = 0, url, name } = resource;
  const {
    width: templateWidth = 0,
    height: templateHeight = 0,
    isVerticalTemplate,
  } = scene;

  let layerWidth = width;
  let layerHeight = height;

  if (isVerticalTemplate) {
    layerWidth = templateWidth * ADD_IMAGE_TO_CANVAS_RATE;
    const rate = layerWidth / width;
    layerHeight *= rate;
  } else {
    layerHeight = templateHeight * ADD_IMAGE_TO_CANVAS_RATE;
    const rate = layerHeight / height;
    layerWidth *= rate;
  }

  const { anchor = { x: 0, y: 0 } } = getImageDefaultValues();

  /** 将图片定位到画布中间的位置 */
  const x = (templateWidth - layerWidth) / 2 + anchor.x * layerWidth;
  const y = (templateHeight - layerHeight) / 2 + anchor.y * layerHeight;

  return {
    ...getImageDefaultValues(),
    id: randomString(),
    url,
    name,
    originalWidth: width,
    originalHeight: height,
    x,
    y,
    width: layerWidth,
    height: layerHeight,
  };
}

export function createTextData(
  data: Partial<LayerModel.Text>,
  scene: SceneStruc
): LayerModel.Text {
  const {
    width: templateWidth = 0,
    height: templateHeight = 0,
    isVerticalTemplate,
  } = scene;

  const result = { ...getTextDefaultValues(), ...data };

  const { letterSpacing = 0, content, anchor = { x: 0, y: 0 } } = result;

  let fontSize = data.fontSize || 0;

  const fontNum = content?.length || 0;

  let width = data.width;
  let height = data.height;
  let x = data.x;
  let y = data.y;

  if (!fontSize) {
    fontSize = isVerticalTemplate
      ? templateWidth * ADD_TEXT_TO_CANVAS_RATE
      : templateHeight * ADD_TEXT_TO_CANVAS_RATE;
  }

  if (!width) {
    width = fontSize * fontNum + (fontNum - 1) * letterSpacing;
  }

  if (!height) {
    height = fontSize;
  }

  /** 将图片定位到画布中间的位置 */
  if (typeof x !== 'number') {
    x = (templateWidth - width) / 2 + anchor.x * width;
  }
  if (typeof y !== 'number') {
    y = (templateHeight - height) / 2 + anchor.y * height;
  }

  return { ...result, fontSize, width, height, x, y };
}

/**
 * 创建背景数据
 * @param data
 */
export function createBackData(
  data: Partial<LayerModel.Background> | null,
  scene: SceneModel
) {
  const { width: templateWidth = 0, height: templateHeight = 0 } = scene;
  const backDefaultValues = getBackDefaultValues();
  const { anchor = { x: 0, y: 0 } } = backDefaultValues;
  const y = templateHeight * anchor.y;
  const x = templateHeight * anchor.x;

  return {
    ...backDefaultValues,
    ...data,
    width: templateWidth,
    height: templateHeight,
    x,
    y,
  };
}
