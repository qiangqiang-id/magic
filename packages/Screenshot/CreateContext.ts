import { isElementNode } from './Document';
import { createSvgRootStyleElement } from './Svg';
import type { Options } from './Screenshot';

export interface Context extends Options {
  /** 异步任务 */
  tasks: Promise<void>[];
  /** svg 根节点 */
  svgRootStyleElement: HTMLStyleElement;
  /** 缓存加载过的字体key */
  catchFontKey: string[];
}

/**
 * 创建上下文
 * @param node
 * @param options
 * @returns Context
 */
export function createContext<T extends Node>(
  node: T,
  options: Options
): Context {
  const context = {
    tasks: [],
    catchFontKey: [],
    svgRootStyleElement: createSvgRootStyleElement(node),
    ...options,
  };

  const { width, height } = getSize(node, context);
  context.width = width;
  context.height = height;

  return context;
}

/**
 * 获取截图宽高
 * @param node
 * @param context
 * @returns size
 */
function getSize(node: Node, context: Context) {
  let { width, height } = context;

  if (isElementNode(node) && (!width || !height)) {
    const box = node.getBoundingClientRect();

    width = width || box.width || Number(node.getAttribute('width')) || 0;

    height = height || box.height || Number(node.getAttribute('height')) || 0;
  }

  return { width, height };
}
