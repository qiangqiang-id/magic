import { RefObject, useEffect, useRef, useState } from 'react';

/**
 * 监听dom大小变化
 * @param {RefObject<Element>} [target] 元素ref
 * @return [entryData,observerRef]
 * entryData 回调事件对象
 * observerRef ResizeObserver 实例
 */
export default function useResizeObserver<T extends Element>(
  target: RefObject<T>
): [ResizeObserverEntry | null, ResizeObserver | null] {
  const [entryData, setEntryData] = useState<ResizeObserverEntry | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  /** 注册监听事件 */
  const registerHandler = (node: Element) => {
    if (!ResizeObserver) {
      console.log('不支持监听元素大小');
      return;
    }
    observerRef.current = new ResizeObserver(entries => {
      entries[0] && setEntryData(entries[0]);
    });
    observerRef.current.observe(node);
  };

  useEffect(() => {
    const node = target.current;
    node && registerHandler(node);
    return () => {
      node && observerRef.current?.unobserve(node);
    };
  }, []);

  return [entryData, observerRef.current];
}
