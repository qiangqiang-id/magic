import SceneStruc from '@/models/SceneStruc';
import {
  getImageDefaultValues,
  getTextDefaultValues,
  getBackDefaultValues,
  getShapeDefaultValues,
} from '@/config/DefaultValues';

/** 矩形加入画布比例 */
const ADD_IMAGE_TO_CANVAS_RATE = 0.7;

/** 文字大小加入画布比例 */
const ADD_TEXT_TO_CANVAS_RATE = 0.05;

/**
 * 获取layer自适应画布的比例
 * @param {Size} layerSize
 * @param {SceneStruc} scene
 * @return {*} ratio 比例
 */
function getRatioCanvasWithLayer(layerSize: Size, scene: SceneStruc) {
  const { width, height } = layerSize;
  const {
    width: templateWidth = 0,
    height: templateHeight = 0,
    isVerticalTemplate,
  } = scene;

  if (isVerticalTemplate) {
    return (templateWidth * ADD_IMAGE_TO_CANVAS_RATE) / width;
  }
  return (templateHeight * ADD_IMAGE_TO_CANVAS_RATE) / height;
}

/**
 * 获取自适应画布的rect 数据，将元素同比例缩放，居中显示
 * @param {LayerModel.Layer} layer
 * @param {SceneStruc} scene
 * @return {*} RectData 矩形数据
 */
function getAdaptRectData(layer: LayerModel.Layer, scene: SceneStruc) {
  const { width = 0, height = 0, anchor = { x: 0, y: 0 } } = layer;
  const { width: templateWidth = 0, height: templateHeight = 0 } = scene;
  const ratio = getRatioCanvasWithLayer({ width, height }, scene);

  const layerWidth = width * ratio;
  const layerHeight = height * ratio;

  /** 将矩形定位到画布中间的位置 */
  const x = (templateWidth - layerWidth) / 2 + anchor.x * layerWidth;
  const y = (templateHeight - layerHeight) / 2 + anchor.y * layerHeight;

  return {
    width: layerWidth,
    height: layerHeight,
    x,
    y,
  };
}

/**
 * 创建图片数据
 * @param {SceneStruc} scene
 * @param {Partial<LayerModel.Image>} [data]
 * @return {*}  {LayerModel.Image}
 */
export function createImageData(
  scene: SceneStruc,
  data?: Partial<LayerModel.Image>
): LayerModel.Image {
  const imageData = { ...getImageDefaultValues(), ...data };
  const rectData = getAdaptRectData(imageData, scene);

  return {
    ...imageData,
    ...rectData,
    originalWidth: imageData.width,
    originalHeight: imageData.height,
  };
}

/**
 * 创建文字数据
 * @param {SceneStruc} scene
 * @param {Partial<LayerModel.Text>} [data]
 * @return {*}  {LayerModel.Text}
 */
export function createTextData(
  scene: SceneStruc,
  data?: Partial<LayerModel.Text>
): LayerModel.Text {
  const {
    width: templateWidth = 0,
    height: templateHeight = 0,
    isVerticalTemplate,
  } = scene;

  const textData = { ...getTextDefaultValues(), ...data };

  const { letterSpacing, content, anchor } = textData;

  const fontSize = isVerticalTemplate
    ? templateWidth * ADD_TEXT_TO_CANVAS_RATE
    : templateHeight * ADD_TEXT_TO_CANVAS_RATE;

  const fontNum = content?.length || 0;

  const width = fontSize * fontNum + (fontNum - 1) * letterSpacing;
  const height = fontSize;

  const x = (templateWidth - width) / 2 + anchor.x * width;
  const y = (templateHeight - height) / 2 + anchor.y * height;

  return { ...textData, fontSize, width, height, x, y };
}

/**
 * 创建背景数据
 * @param {SceneModel} scene
 * @param {Partial<LayerModel.Background>} [data]
 * @return {*}  {LayerModel.Background}
 */
export function createBackData(
  scene: SceneModel,
  data?: Partial<LayerModel.Background>
): LayerModel.Background {
  const { width: templateWidth = 0, height: templateHeight = 0 } = scene;
  const backData = { ...getBackDefaultValues(), ...data };
  const { anchor } = backData;
  const y = templateHeight * anchor.y;
  const x = templateHeight * anchor.x;

  return {
    ...backData,
    width: templateWidth,
    height: templateHeight,
    x,
    y,
  };
}

/**
 * 创建图形数据
 * @param {SceneStruc} scene
 * @param {Partial<LayerModel.Shape>} [data]
 * @return {*}  {LayerModel.Shape}
 */
export function createShapeData(
  scene: SceneStruc,
  data?: Partial<LayerModel.Shape>
): LayerModel.Shape {
  const shapeData = { ...getShapeDefaultValues(), ...data };
  const { width, height, rx, ry } = shapeData;
  const ratio = getRatioCanvasWithLayer({ width, height }, scene);
  const rectData = getAdaptRectData(shapeData, scene);

  return {
    ...shapeData,
    ...rectData,
    rx: rx * ratio,
    ry: ry * ratio,
  };
}
