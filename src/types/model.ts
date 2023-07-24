import {
  TextStruc,
  ImageStruc,
  BackgroundStruc,
  ShapeStruc,
  GroupStruc,
} from '@/models/LayerStruc';
import { LayerTypeEnum } from '@/constants/LayerTypeEnum';

export type LayerStrucType =
  | TextStruc
  | ImageStruc
  | BackgroundStruc
  | ShapeStruc
  | GroupStruc;

export type LayerType<T extends LayerTypeEnum> =
  T extends LayerTypeEnum.BACKGROUND
    ? BackgroundStruc
    : T extends LayerTypeEnum.GROUP
    ? GroupStruc
    : T extends LayerTypeEnum.IMAGE
    ? ImageStruc
    : T extends LayerTypeEnum.TEXT
    ? TextStruc
    : T extends LayerTypeEnum.SHAPE
    ? ShapeStruc
    : never;
