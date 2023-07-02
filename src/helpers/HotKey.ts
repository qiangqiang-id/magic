import hotKeyMaps, { HotKey } from '@/config/HotKeys';
import CmdEnum from '@/constants/CmdEnum';
import { isMacOS } from '@/constants/Device';

/**
 * 通过命令获取快捷键
 * @param cmd 命令名称
 * @returns { HotKey | undefined }
 */
export function getHotKeyByCmd(cmd: CmdEnum): HotKey | undefined {
  return hotKeyMaps.find(hotKey => hotKey.name === cmd);
}

export function getHotKeyCmdOfOS(hotKey?: HotKey): string {
  if (!hotKey || !hotKey.combination) return '';
  const key = hotKey.combination.split('/');
  if (!key || key.length <= 0) return hotKey.combination || '';
  return isMacOS ? key[0] : key[1];
}

/**
 * 获取快捷键描述
 * @param cmd 命令名称
 * @param reverse 逆向命令
 * @returns { string }
 */
export function getCombination(cmd: CmdEnum, reverse?: boolean): string {
  const hotKey = getHotKeyByCmd(cmd);
  const combination = getHotKeyCmdOfOS(hotKey);
  const label = reverse ? hotKey?.reverseLabel : hotKey?.label;
  return `${label}(${combination})`;
}

/**
 * 当前光标是否在输入框内
 * @param element 当前的节点位置
 * @returns {boolean}
 */
export function atInput(element: HTMLElement): boolean {
  return (
    ['INPUT', 'TEXTAREA'].includes(element.nodeName) ||
    element.contentEditable === 'true'
  );
}

/**
 * 过滤输入框内的快捷键
 */
export function getInputHotKeys(): Array<HotKey | undefined> {
  return [
    getHotKeyByCmd(CmdEnum.COPY),
    getHotKeyByCmd(CmdEnum.CUT),
    getHotKeyByCmd(CmdEnum.PASTE),
    getHotKeyByCmd(CmdEnum.UNDO),
    getHotKeyByCmd(CmdEnum.REDO),
    getHotKeyByCmd(CmdEnum.DELETE),
    getHotKeyByCmd(CmdEnum['SELECT ALL']),
    getHotKeyByCmd(CmdEnum['TO UP']),
    getHotKeyByCmd(CmdEnum['TO BUTTOM']),
    getHotKeyByCmd(CmdEnum['TO LEFT']),
    getHotKeyByCmd(CmdEnum['TO RIGHT']),
    getHotKeyByCmd(CmdEnum['TO UP 10PX']),
    getHotKeyByCmd(CmdEnum['TO BUTTOM 10PX']),
    getHotKeyByCmd(CmdEnum['TO LEFT 10PX']),
    getHotKeyByCmd(CmdEnum['TO RIGHT 10PX']),
  ];
}
