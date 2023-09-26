import CmdEnum from '@/constants/CmdEnum';
import HotKeyScope from '@/constants/HotKeyScope';
import KeyCodeMap from '@/constants/KeyCode';
import cmdMaps, { CmdItem } from './Cmd';

export interface HotKey extends CmdItem {
  /** 作用范围分组 */
  scope: HotKeyScope;

  /** 键值 - 支持多个键同一个功能 */
  keyCode: number | number[];

  /** 是否按下ctrl/command */
  ctrlKey?: boolean;

  /** 是否按下shift */
  shiftKey?: boolean;

  /** 是否按下alt/option */
  altKey?: boolean;

  /** 组合键 */
  combination?: string;
}

const hotKeyMaps: HotKey[] = [
  {
    ...cmdMaps[CmdEnum.COPY],
    scope: HotKeyScope.LAYER,
    combination: '⌘C/CTRL+C',
    keyCode: KeyCodeMap.C,
    ctrlKey: true,
  },
  {
    ...cmdMaps[CmdEnum.CUT],
    scope: HotKeyScope.LAYER,
    combination: '⌘X/CTRL+X',
    keyCode: KeyCodeMap.X,
    ctrlKey: true,
  },
  {
    ...cmdMaps[CmdEnum.PASTE],
    scope: HotKeyScope.LAYER,
    combination: '⌘V/CTRL+V',
    keyCode: KeyCodeMap.V,
    ctrlKey: true,
  },
  {
    ...cmdMaps[CmdEnum.UNDO],
    scope: HotKeyScope.LAYER,
    combination: '⌘Z/CTRL+Z',
    keyCode: KeyCodeMap.Z,
    ctrlKey: true,
  },
  {
    ...cmdMaps[CmdEnum.REDO],
    scope: HotKeyScope.LAYER,
    combination: '⇧⌘Z/SHIFT+CTRL+Z',
    keyCode: KeyCodeMap.Z,
    shiftKey: true,
    ctrlKey: true,
  },
  {
    ...cmdMaps[CmdEnum.DELETE],
    scope: HotKeyScope.LAYER,
    combination: '⌫ | Del/BACKSPACE | Del',
    keyCode: [KeyCodeMap.BACKSPACE, KeyCodeMap.DELETE],
  },
  {
    ...cmdMaps[CmdEnum['SELECT ALL']],
    scope: HotKeyScope.LAYER,
    combination: 'CTRL+A',
    keyCode: KeyCodeMap.A,
    ctrlKey: true,
  },
  {
    ...cmdMaps[CmdEnum['TO UP']],
    scope: HotKeyScope.LAYER,
    combination: '↑',
    keyCode: KeyCodeMap.UP,
  },
  {
    ...cmdMaps[CmdEnum['TO BUTTOM']],
    scope: HotKeyScope.LAYER,
    combination: '↓',
    keyCode: KeyCodeMap.DOWN,
  },
  {
    ...cmdMaps[CmdEnum['TO LEFT']],
    scope: HotKeyScope.LAYER,
    combination: '←',
    keyCode: KeyCodeMap.LEFT,
  },
  {
    ...cmdMaps[CmdEnum['TO RIGHT']],
    scope: HotKeyScope.LAYER,
    combination: '→',
    keyCode: KeyCodeMap.RIGHT,
  },
  {
    ...cmdMaps[CmdEnum['TO UP 10PX']],
    scope: HotKeyScope.LAYER,
    combination: '↑',
    keyCode: KeyCodeMap.UP,
    shiftKey: true,
  },
  {
    ...cmdMaps[CmdEnum['TO BUTTOM 10PX']],
    scope: HotKeyScope.LAYER,
    combination: '↓',
    keyCode: KeyCodeMap.DOWN,
    shiftKey: true,
  },
  {
    ...cmdMaps[CmdEnum['TO LEFT 10PX']],
    scope: HotKeyScope.LAYER,
    combination: '←',
    keyCode: KeyCodeMap.LEFT,
    shiftKey: true,
  },
  {
    ...cmdMaps[CmdEnum['TO RIGHT 10PX']],
    scope: HotKeyScope.LAYER,
    combination: '→',
    keyCode: KeyCodeMap.RIGHT,
    shiftKey: true,
  },
  {
    ...cmdMaps[CmdEnum['ZOOM IN']],
    scope: HotKeyScope.CANVAS,
    combination: '⌘+/CTRL++',

    keyCode: KeyCodeMap['=+'],
    ctrlKey: true,
  },
  {
    ...cmdMaps[CmdEnum['ZOOM OUT']],
    scope: HotKeyScope.CANVAS,
    combination: '⌘-/CTRL+-',
    keyCode: KeyCodeMap['-_'],
    ctrlKey: true,
  },
];

export default hotKeyMaps;
