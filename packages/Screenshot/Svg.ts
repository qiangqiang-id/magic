import { getDocument } from './Document';
import { Context } from './CreateContext';

/**
 * 创建Svg根样式元素
 * @param node
 * @returns style
 */
export function createSvgRootStyleElement(node: Node) {
  const style = getDocument(node).createElement('style');
  const cssText = style.ownerDocument.createTextNode(`
.______background-clip--text {
  background-clip: text;
  -webkit-background-clip: text;
}
`);
  style.appendChild(cssText);
  return style;
}

/**
 * 创建 ForeignObject Svg
 * @param clone
 * @param context
 * @returns svg
 */
export function createForeignObjectSvg(
  clone: Node,
  context: Context
): SVGSVGElement {
  const svg = getDocument(clone.ownerDocument).createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );
  svg.setAttribute('viewBox', `0 0 ${context.width} ${context.height}`);

  const foreignObject = svg.ownerDocument.createElementNS(
    svg.namespaceURI,
    'foreignObject'
  );
  foreignObject.setAttributeNS(null, 'x', '0%');
  foreignObject.setAttributeNS(null, 'y', '0%');
  foreignObject.setAttributeNS(null, 'width', '100%');
  foreignObject.setAttributeNS(null, 'height', '100%');
  foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true');
  foreignObject.append(clone);
  svg.appendChild(foreignObject);
  return svg;
}

/**
 * svg 转 dataUrl
 * @param svg
 * @returns dataUrl
 */
export function svgToDataUrl(svg: SVGElement) {
  const xhtml = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xhtml)}`;
}
