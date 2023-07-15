const SANDBOX_ID = 'magic__sandbox';
let sandbox: HTMLIFrameElement | undefined;
const defaultStyles = new Map<string, Record<string, any>>();

/**
 * 获取默认样式
 * @param tagName
 * @returns styles
 */
function getDefaultStyle(tagName: string): Record<string, any> {
  if (defaultStyles.has(tagName)) return defaultStyles.get(tagName)!;

  const sandboxOwnerDocument = window.document;
  if (!sandbox) {
    sandbox = sandboxOwnerDocument.querySelector(
      `#${SANDBOX_ID}`
    ) as HTMLIFrameElement;
    if (!sandbox) {
      sandbox = sandboxOwnerDocument.createElement('iframe');
      sandbox.id = SANDBOX_ID;
      sandbox.width = '0';
      sandbox.height = '0';
      sandbox.style.visibility = 'hidden';
      sandbox.style.position = 'fixed';
      sandboxOwnerDocument.body.appendChild(sandbox);
      sandbox.contentWindow!.document.write(
        '<!DOCTYPE html><meta charset="UTF-8"><title></title><body>'
      );
    }
  }

  const ownerWindow = sandbox.contentWindow!;
  const ownerDocument = ownerWindow.document;

  const el = ownerDocument.createElement(tagName);
  ownerDocument.body.appendChild(el);
  // 确保有一些内容，这样就可以应用像margin这样的属性
  el.textContent = ' ';
  const style = ownerWindow.getComputedStyle(el);
  const styles: Record<string, any> = {};

  for (let i = style.length - 1; i >= 0; i -= 1) {
    const name = style.item(i);
    if (name === 'width' || name === 'height') {
      styles[name] = 'auto';
    } else {
      styles[name] = style.getPropertyValue(name);
    }
  }
  ownerDocument.body.removeChild(el);
  defaultStyles.set(tagName, styles);
  return styles;
}

/**
 * 移除样式沙箱
 * @returns void
 */
export function removeDefaultStyleSandbox() {
  if (!sandbox) return;
  window.document.body.removeChild(sandbox);
  defaultStyles.clear();
  sandbox = undefined;
}

/**
 * 复制css样式
 * @param node
 * @param clone
 * @param ownerWindow
 * @param isRootNode
 */
export function copyCssStyles<T extends HTMLElement>(
  node: T,
  clone: T,
  ownerWindow: Window,
  isRootNode: boolean
) {
  const style = ownerWindow.getComputedStyle(node);
  const cloneStyle = clone.style;
  const defaultStyle = getDefaultStyle(node.tagName);

  for (let i = style.length - 1; i >= 0; i -= 1) {
    const name = style.item(i);
    const value = style.getPropertyValue(name);
    const priority = style.getPropertyPriority?.(name) ?? '';

    // 清理根节点的'margin'
    if (isRootNode && name.startsWith('margin') && value) {
      cloneStyle.setProperty(name, '0', priority);
      continue;
    }
    // 跳过非用户样式
    if (defaultStyle[name] === value && !node.getAttribute(name) && !priority) {
      continue;
    }

    // 兼容 background-clip: text ---- 文字渐变
    if (name === 'background-clip' && value === 'text') {
      clone.classList.add('______background-clip--text');
      continue;
    }

    cloneStyle.setProperty(name, value, priority);

    // 兼容border-style
    if (name.startsWith('border') && name.endsWith('style')) {
      const widthName = name.replace('style', 'width');
      if (!cloneStyle.getPropertyValue(widthName)) {
        cloneStyle.setProperty(widthName, '0');
      }
    }

    // 修复 chromium
    // https://github.com/RigoCorp/html-to-image/blob/master/src/cssFixes.ts
    if (ownerWindow.navigator.userAgent.match(/\bChrome\//)) {
      if (cloneStyle.fontKerning === 'auto') {
        cloneStyle.fontKerning = 'normal';
      }

      if (
        cloneStyle.overflow === 'hidden' &&
        cloneStyle.textOverflow === 'ellipsis' &&
        node.scrollWidth === node.clientWidth
      ) {
        cloneStyle.textOverflow = 'clip';
      }
    }
  }
}
