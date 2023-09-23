import { Coordinate, calcRotatedPoint, getRectCenter } from '@p/EditorTools';
import { ImageStruc } from '@/models/LayerStruc';
import { makeImage } from './image';
import { LayerStrucType } from '@/types/model';
import { TRANSPARENT_PICTURE_MIME_TYPES } from '@/constants/MimeTypes';

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

/**
 * 获取图片下鼠标点击的不透明度
 * @param point 坐标点，在图片内部的坐标
 * @param cmp 组件
 * @result 透明度 0 - 1
 */
export async function getMousePointOpacityInImage(
  point: Point,
  imageLayer: ImageStruc
): Promise<number> {
  if (!canvas || !ctx) {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
  }
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  const { url = '' } = imageLayer;
  /** 这里的宽高是真实的 图层宽高 */
  const { mask, width, height, scale } = imageLayer.getSafetyModalData();
  /** 这里的宽高是 计算了mask 的宽高，肉眼可见的编辑框宽高*/
  const { width: canvasWidth, height: canvasHeight } = imageLayer.getRectData();
  const image = await makeImage(url, width, height);

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  /** 处理翻转 */
  ctx?.scale(scale.x, scale.y);
  const translateX = scale.x < 0 ? canvasWidth * scale.x : 0;
  const translateY = scale.y < 0 ? canvasHeight * scale.y : 0;
  ctx?.translate(translateX, translateY);

  ctx?.drawImage(image, -mask.x, -mask.y, width, height);
  const data = ctx?.getImageData(point.x, point.y, 1, 1).data;
  if (!data) return 1;
  /** 透明度的值为0 - 255， 除以255得到 0 - 1 */
  return data[3] / 255;
}

async function getLayer(
  mousePointInCanvas: Coordinate,
  layerList: LayerStrucType[]
) {
  const layer = layerList.pop();
  if (!layer) return null;
  /** 暂时只做图片透传，后续要考虑打组的情况 */
  if (!layer.isImage()) return layer;

  const { mimeType } = layer;
  /** 检测图片类型 */
  if (!mimeType || !TRANSPARENT_PICTURE_MIME_TYPES.includes(mimeType))
    return layer;

  const { x, y, width, height, rotate } = layer.getRectData();

  let pointInLayer = {
    x: mousePointInCanvas.x - x,
    y: mousePointInCanvas.y - y,
  };

  /** 处理旋转情况 */
  if (rotate % 360 !== 0) {
    const centerPosition = getRectCenter({ x, y, width, height });

    const position = calcRotatedPoint(
      mousePointInCanvas,
      centerPosition,
      -rotate
    );

    pointInLayer = {
      x: position.x - x,
      y: position.y - y,
    };
  }
  const opacity = await getMousePointOpacityInImage(pointInLayer, layer);

  if (opacity === 0) return getLayer(mousePointInCanvas, layerList);
  return layer;
}

/**
 * 获取穿透图层
 * @param mousePointInCanvas 鼠标在画布中的位置
 * @param layers 当前鼠标点击位置下的图层
 * @returns
 */
export async function getPenetrationLayer(
  mousePointInCanvas: Coordinate,
  layers: LayerStrucType[]
) {
  const layer = await getLayer(mousePointInCanvas, [...layers]);

  return layer || layers.pop();
}
