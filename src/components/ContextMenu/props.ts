export interface MenuItemType {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
  submenu?: MenuItemType[];
  divider?: boolean;
}

export interface MenuPositionType {
  x: number;
  y: number;
  transformOrigin: string;
}
