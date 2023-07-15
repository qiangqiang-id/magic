/**
 *  是否为元素节点
 * @param node
 * @returns boolean
 */
export const isElementNode = (node: Node): node is Element =>
  node.nodeType === 1; // Node.ELEMENT_NODE

/**
 * 是否为svg元素节点
 * @param node
 * @returns boolean
 */
export const isSVGElementNode = (node: Element): node is SVGElement =>
  typeof (node as SVGElement).className === 'object';

/**
 * 是否为HTML元素节点
 * @param node
 * @returns boolean
 */
export const isHTMLElementNode = (node: Node): node is HTMLElement =>
  isElementNode(node) &&
  typeof (node as HTMLElement).style !== 'undefined' &&
  !isSVGElementNode(node);

/**
 * 是否为图片元素
 * @param node
 * @returns boolean
 */
export const isImageElement = (node: Element): node is HTMLImageElement =>
  node.tagName === 'IMG';

/**
 * 是否为dataURl
 * @param url
 * @returns boolean
 */
export const isDataUrl = (url: string) => url.startsWith('data:');

/**
 * 获取文档
 * @param target
 * @returns boolean
 */
export function getDocument<T extends Node>(target?: T | null): Document {
  return ((target && isElementNode(target as any)
    ? target?.ownerDocument
    : target) ?? window.document) as any;
}
