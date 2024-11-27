import { ReactNode } from 'react';

export interface MenuItem {
  label: string;
  onClick?: () => void;
  shortcut?: string;
  icon?: ReactNode;
  disabled?: boolean;
  children?: MenuItem[];
}
