import { MaterialEnum } from '@/constants/MaterialEnum';
import { MenuItemModel } from '@/types/material';
import Image from './Content/Image';
import Back from './Content/Back';
import Text from './Content/Text';
import Shape from './Content/Shape';

export const MATERIAL_MENUS: MenuItemModel[] = [
  {
    label: '图片',
    name: MaterialEnum.IMAGE,
    component: Image,
    icon: 'icon-left-image',
  },
  {
    label: '背景',
    name: MaterialEnum.BACK,
    component: Back,
    icon: 'icon-left-background',
  },
  {
    label: '文字',
    name: MaterialEnum.TEXT,
    component: Text,
    icon: 'icon-left-text',
  },
  {
    label: '图形',
    name: MaterialEnum.SHAPE,
    component: Shape,
    icon: 'icon-left-element',
  },
];
