import { ImageResource } from '@/types/resource';
import SceneStruc from '@/models/SceneStruc';
import { randomString } from '@/utils/random';
import { LayerType } from '@/constants/LayerTypeEnum';
import { ImageDefaultValues, AnchorDefault } from '@/config/DefaultValues';

const ADD_IMAGE_TO_CANVAS_RATE = 0.7;

/**
 * 创建图片数据
 */
export function createImageData(
  resource: ImageResource,
  templateInfo: SceneStruc
): LayerModel.Image {
  const { width = 0, height = 0, url, name } = resource;
  const { width: templateWidth = 0, height: templateHeight = 0 } = templateInfo;
  const isVerticalTemplate = templateHeight > templateWidth;
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

  /** 将图片定位到画布中间的位置 */
  const x = (templateWidth - layerWidth) / 2 + AnchorDefault.x * layerWidth;
  const y = (templateHeight - layerHeight) / 2 + AnchorDefault.y * layerHeight;

  return {
    ...ImageDefaultValues,
    id: randomString(),
    type: LayerType.IMAGE,
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
