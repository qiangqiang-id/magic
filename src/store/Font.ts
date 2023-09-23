import { makeAutoObservable } from 'mobx';
import { SYS_FONTS } from '@/config/Fonts';
import { isSupportFont } from '@/utils/font';

export default class FontStore {
  fontList: typeof SYS_FONTS = [];

  constructor() {
    makeAutoObservable(this);
    this.setFontList();
  }

  setFontList() {
    this.fontList = SYS_FONTS.filter(font => isSupportFont(font.value));
  }
}
