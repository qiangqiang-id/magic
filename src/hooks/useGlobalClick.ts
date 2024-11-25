import { useEffect, RefObject } from 'react';
/**
 * 全局点击事件hooks
 * @param handler 执行钩子
 * @param effective 是否真实有效的交互
 * @param container 面板容器
 */
export default function useGlobalClick(
  handler: (e: MouseEvent) => void,
  effective: boolean,
  container?: RefObject<HTMLElement>
) {
  const handlerClick = (e: MouseEvent) => {
    if (!container?.current) {
      handler(e);
    }

    if (!container?.current?.contains(e.target as HTMLElement)) {
      handler(e);
    }
  };

  useEffect(() => {
    if (effective) {
      window.addEventListener('click', handlerClick, false);
    }

    return () => {
      window.removeEventListener('click', handlerClick);
    };
  }, [handler, effective]);
}
