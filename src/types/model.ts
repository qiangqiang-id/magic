import {
  TextStruc,
  ImageStruc,
  BackgroundStruc,
  ShapeStruc,
  GroupStruc,
} from '@/models/LayerStruc';

export type LayerStrucType =
  | TextStruc
  | ImageStruc
  | BackgroundStruc
  | ShapeStruc
  | GroupStruc;
