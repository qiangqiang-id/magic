import { getCanvasRectInfo, getCanvasWrapRectInfo } from '@/helpers/Node';

export const PREVIEW_SIZE_OFFSET_X = 10;
export const PREVIEW_SIZE_OFFSET_Y = 20;

/**
 * 获取编辑区 预览宽高信息框的位置
 * @param point 鼠标以浏览器为基准的坐标点
 * @param previewSizeRef 预览信息框Ref
 * @returns
 */
export function getPreviewSizePosition(
  point: Point,
  previewSizeDom: HTMLDivElement | null
): Point {
  const canvasWrapRectInfo: DOMRect | null = getCanvasWrapRectInfo();
  const canvasRectInfo: DOMRect | null = getCanvasRectInfo();

  if (!canvasWrapRectInfo || !canvasRectInfo || !previewSizeDom) return point;
  const mousePositionInCanvas = {
    x: point.x - canvasRectInfo.left,
    y: point.y - canvasRectInfo.top,
  };

  const result = {
    x: mousePositionInCanvas.x + PREVIEW_SIZE_OFFSET_X,
    y: mousePositionInCanvas.y + PREVIEW_SIZE_OFFSET_Y,
  };

  /** canvas 与 canvas wrap 横轴、纵轴 位置的偏移量 */
  const horizontalOffset = canvasRectInfo.x - canvasWrapRectInfo.x;
  const verticalOffset = canvasRectInfo.y - canvasWrapRectInfo.y;

  // =============== 判断是否超出了四个方向 ===============
  /** left */
  if (point.x + PREVIEW_SIZE_OFFSET_X < canvasWrapRectInfo.x) {
    result.x = -horizontalOffset;
  }

  /** right */
  const previewDomWidth = previewSizeDom.offsetWidth;
  if (point.x + previewDomWidth > canvasWrapRectInfo.right) {
    result.x = canvasRectInfo.width + horizontalOffset - previewDomWidth;
  }

  /** top */
  if (point.y + PREVIEW_SIZE_OFFSET_Y < canvasWrapRectInfo.y) {
    result.y = -verticalOffset;
  }

  /** bottom */
  const previewDomHeight = previewSizeDom.offsetHeight;
  if (
    point.y + previewDomHeight + PREVIEW_SIZE_OFFSET_Y >
    canvasWrapRectInfo.bottom
  ) {
    result.y = canvasRectInfo.height + verticalOffset - previewDomHeight;
  }

  return result;
}
