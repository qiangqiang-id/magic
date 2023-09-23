import { NodeNameplate } from '@/constants/NodeNamePlate';

/**
 * 返回画布节点
 * @returns {HTMLElement | null} `HTMLElement` 画布真实节点
 */
export function getCanvasNode(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `[data-nameplate="${NodeNameplate.CANVAS}"]`
  );
}

/**
 * 返回画布的真实尺寸
 * @returns {DOMRect | null } `DOMRect` dom的矩形信息
 */
export function getCanvasRectInfo(): DOMRect | null {
  const $canvas = getCanvasNode();
  if (!$canvas) return null;
  return $canvas.getBoundingClientRect();
}

/**
 * 返回画布包装器节点
 * @returns {HTMLElement | null} `HTMLElement` 画布包装器真实节点
 */
export function getCanvasWrapNode(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    `[data-nameplate="${NodeNameplate.CANVAS_WRAP}"]`
  );
}

/**
 * 返回画布包装器盒子信息
 * @returns {DOMRect | null} `DOMRect` 画布包装器盒子信息
 */
export function getCanvasWrapRectInfo(): DOMRect | null {
  const node = getCanvasWrapNode();
  if (!node) return null;
  return node.getBoundingClientRect();
}

/**
 * 返回相对于画布的坐标
 * @param point 相对的可视坐标
 * @returns {Point}
 */
export function toCanvasPoint(point: Point): Point {
  const cnavasNode = getCanvasNode();
  if (!cnavasNode) return point;
  const { left, top } = cnavasNode.getBoundingClientRect();
  return { x: point.x - left, y: point.y - top };
}
