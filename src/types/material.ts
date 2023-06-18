import { MaterialEnum } from '@/constants/MaterialEnum';

export interface MenuItemModel {
  /** name */
  name: MaterialEnum;
  /** 名称 */
  label: string;
  /** 图标 */
  icon: string;
  /** 是否隐藏名称 */
  hiddenLabel?: boolean;
  /** 组件 */
  component: () => JSX.Element;
  /** 隐藏右侧把手 */
  hiddenSidebar?: boolean;
}
