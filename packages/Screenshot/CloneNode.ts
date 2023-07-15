import { copyCssStyles } from './CopyCssStyles';
import {
  isElementNode,
  isHTMLElementNode,
  isSVGElementNode,
  isImageElement,
  isDataUrl,
} from './Document';
import { fetchDataUrl } from './Fetch';
import type { Context } from './CreateContext';

/**
 * 应用Css样式与选项
 * @param style
 * @param context
 */
function applyCssStyleWithOptions(
  style: CSSStyleDeclaration,
  context: Context
) {
  const { backgroundColor, width, height, style: styles } = context;

  if (backgroundColor) style.backgroundColor = backgroundColor;
  if (width) style.width = `${width}px`;
  if (height) style.height = `${height}px`;
  if (styles) {
    for (const name in styles) {
      style[name] = styles[name]!;
    }
  }
}

/**
 * 替换url 为 dataurl
 * @param clone
 * @returns
 */
function replaceUrlToDataUrl<T extends HTMLImageElement>(clone: T) {
  if (!isDataUrl(clone.currentSrc || clone.src)) {
    const currentSrc = clone.currentSrc || clone.src;
    clone.srcset = '';
    clone.dataset.originalSrc = currentSrc;
    return [
      fetchDataUrl(currentSrc).then(url => {
        clone.src = url;
      }),
    ];
  }
  return [];
}

/**
 * 克隆子节点
 * @param node
 * @param clone
 * @param context
 * @param ownerWindow
 */
function cloneChildNodes<T extends Node>(
  node: T,
  clone: T,
  context: Context,
  ownerWindow: Window | null | undefined
): void {
  const firstChild =
    (isElementNode(node) ? node.shadowRoot?.firstChild : undefined) ??
    node.firstChild;

  for (let child = firstChild; child; child = child.nextSibling) {
    clone.appendChild(cloneNode(child, context, ownerWindow));
  }
}

/**
 * 克隆节点
 * @param node
 * @param context
 * @param ownerWindow
 * @returns
 */
export function cloneNode<T extends Node>(
  node: T,
  context: Context,
  ownerWindow?: Window | null
) {
  const { fontMap, svgRootStyleElement, catchFontKey, tasks } = context;
  const isRootNode = ownerWindow === undefined;
  const ownerDocument = ownerWindow?.document ?? node.ownerDocument;
  if (isRootNode) ownerWindow = ownerDocument?.defaultView;

  const clone = node.cloneNode(false) as HTMLElement;

  if (
    ownerWindow &&
    isElementNode(node) &&
    (isHTMLElementNode(node) || isSVGElementNode(node))
  ) {
    clone.style.transitionProperty = 'none';
    /** 处理css */
    copyCssStyles(
      node as unknown as HTMLElement,
      clone,
      ownerWindow as Window,
      isRootNode
    );
    cloneChildNodes(node, clone as Node, context, ownerWindow);

    /** 处理图片任务 */
    if (isElementNode(node) && isImageElement(node)) {
      tasks.push(...replaceUrlToDataUrl(clone as HTMLImageElement));
    }

    /** 加载字体任务 */
    const fontFamily = clone.style.fontFamily;
    if (
      fontFamily &&
      fontMap &&
      fontMap[fontFamily] &&
      !catchFontKey.includes(fontFamily)
    ) {
      const fontUrl = fontMap[fontFamily];
      catchFontKey.push(fontFamily);
      tasks.push(
        fetchDataUrl(fontUrl).then(url => {
          const fontCss = svgRootStyleElement.ownerDocument.createTextNode(
            `@font-face{font-family:${fontFamily};src:url(${url})}`
          );
          svgRootStyleElement.appendChild(fontCss);
        })
      );
    }

    if (isRootNode) {
      applyCssStyleWithOptions(clone.style, context);
    }

    return clone;
  }

  cloneChildNodes(node, clone as Node, context, ownerWindow);
  return clone;
}
