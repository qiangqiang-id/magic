import * as ReactDOM from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

type CreateRoot = (container: ContainerType) => Root;

type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root;
};

const fullClone = {
  ...ReactDOM,
} as typeof ReactDOM & {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: {
    usingClientEntryPoint?: boolean;
  };
  createRoot?: CreateRoot;
};

const MARK = '__magic_react_root__';

function toggleWarning(skip: boolean) {
  const { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } = fullClone;

  if (
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED &&
    typeof __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED === 'object'
  ) {
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint =
      skip;
  }
}

/**
 * 渲染
 */
export function render(node: React.ReactElement, container: ContainerType) {
  toggleWarning(true);
  const root = container[MARK] || createRoot?.(container);
  toggleWarning(false);

  root?.render(node);
  container[MARK] = root;
}

/**
 * 卸载
 */
export async function unmount(container: ContainerType) {
  // 延迟卸载以避免React 18同步警告
  return Promise.resolve().then(() => {
    container[MARK]?.unmount();
    delete container[MARK];
  });
}

/**
 * 创建容器
 */
export function createContainerById(id: string) {
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.id = id;
    document.body.appendChild(container);
  }
  return container;
}

/**
 * 移除容器
 */
export function removeContainerById(id: string) {
  const container = document.getElementById(id);
  if (container) {
    unmount(container);
    container.remove();
  }
}
