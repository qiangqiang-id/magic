import { useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
  transformOrigin: string;
}

/**
 * 自定义钩子，用于计算菜单的位置
 * @param menuRef - 菜单的 ref 对象
 * @param initialX - 初始 x 坐标
 * @param initialY - 初始 y 坐标
 * @param isSubmenu - 是否是子菜单
 * @param parentRect - 父菜单的矩形边界，如果是子菜单则需要
 * @param padding - 菜单与视窗边缘的间距
 * @returns 菜单的位置对象，包含 x、y 坐标和 transformOrigin
 */
export default function useMenuPosition(
  menuRef: React.RefObject<HTMLDivElement>,
  initialX: number,
  initialY: number,
  isSubmenu: boolean,
  parentRect?: DOMRect | null,
  padding = 8
) {
  const [position, setPosition] = useState<Position>({
    x: initialX,
    y: initialY,
    transformOrigin: 'top left',
  });

  useEffect(() => {
    if (!menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = initialX;
    let y = initialY;
    let transformOrigin = 'top left';

    if (isSubmenu && parentRect) {
      /** 默认值：在右侧显示子菜单 */
      x = parentRect.right;
      y = parentRect.top;

      /** 检查子菜单是否超出右边缘 */
      if (x + rect.width > viewportWidth - padding) {
        // 在父菜单的左侧显示子菜单
        x = parentRect.left - rect.width;
        transformOrigin = 'top right';

        /** 检查子菜单是否超出左边缘 */
        if (x < padding) {
          x = parentRect.right - rect.width; // 将子菜单的右边缘与父菜单的右边缘对齐
          y = parentRect.bottom + 4; // 添加小间隙

          // 如果它会在底部溢出，则显示在父菜单项上方
          if (y + rect.height > viewportHeight - padding) {
            y = parentRect.top - rect.height - 4;
            transformOrigin = 'bottom right';
          }
        }
      }

      /** 垂直定位调整 */
      if (y + rect.height > viewportHeight - padding) {
        /** 如果菜单太高，请与视窗底部对齐 */
        if (rect.height > viewportHeight - padding * 2) {
          y = padding;
          menu.style.maxHeight = `${viewportHeight - padding * 2}px`;
          menu.style.overflowY = 'auto';
        } else {
          /** 否则，与视窗底部对齐 */
          y = viewportHeight - rect.height - padding;
        }
      }
    } else {
      /** 根菜单定位 */
      if (x + rect.width > viewportWidth - padding) {
        x = viewportWidth - rect.width - padding;
      }

      if (y + rect.height > viewportHeight - padding) {
        if (rect.height > viewportHeight - padding * 2) {
          y = padding;
          menu.style.maxHeight = `${viewportHeight - padding * 2}px`;
          menu.style.overflowY = 'auto';
        } else {
          y = viewportHeight - rect.height - padding;
          transformOrigin = 'bottom left';
        }
      }
    }

    /** 最后边界检查 */
    x = Math.max(padding, Math.min(x, viewportWidth - rect.width - padding));
    y = Math.max(padding, Math.min(y, viewportHeight - rect.height - padding));

    setPosition({ x, y, transformOrigin });
  }, [initialX, initialY, isSubmenu, parentRect, padding]);

  return position;
}
