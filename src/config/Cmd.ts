/**
 * 执行终端
 */

import CmdEnum from '@/constants/CmdEnum';

export type CmdHandler = (data?: any) => void;

export interface CmdItem {
  /** 命令名称 */
  name: CmdEnum;

  /** 命令标签 */
  label: string;

  /** 逆向操作命令 */
  reverseLabel?: string;

  /** 命令简介 */
  desc?: string;
}

const cmdMaps: Record<CmdEnum, CmdItem> = {
  [CmdEnum.COPY]: {
    name: CmdEnum.COPY,
    label: '复制',
  },
  [CmdEnum.CUT]: {
    name: CmdEnum.CUT,
    label: '剪切',
  },
  [CmdEnum.PASTE]: {
    name: CmdEnum.PASTE,
    label: '粘贴',
  },
  [CmdEnum.UNDO]: {
    name: CmdEnum.UNDO,
    label: '撤销',
  },
  [CmdEnum.REDO]: {
    name: CmdEnum.REDO,
    label: '恢复',
  },
  [CmdEnum.DELETE]: {
    name: CmdEnum.DELETE,
    label: '删除',
  },
  [CmdEnum.ESC]: {
    name: CmdEnum.ESC,
    label: '取消',
  },
  [CmdEnum.SAVE]: {
    name: CmdEnum.SAVE,
    label: '保存',
  },
  [CmdEnum.LOCK]: {
    name: CmdEnum.LOCK,
    label: '锁定',
  },
  [CmdEnum.UNLOCK]: {
    name: CmdEnum.UNLOCK,
    label: '解锁',
  },
  [CmdEnum.PREVIEW]: {
    name: CmdEnum.PREVIEW,
    label: '预览',
  },
  [CmdEnum.PUBLISH]: {
    name: CmdEnum.PUBLISH,
    label: '发布',
  },
  [CmdEnum['TO UP']]: {
    name: CmdEnum['TO UP'],
    label: '上移',
  },
  [CmdEnum['TO BUTTOM']]: {
    name: CmdEnum['TO BUTTOM'],
    label: '下移',
  },
  [CmdEnum['TO LEFT']]: {
    name: CmdEnum['TO LEFT'],
    label: '左移',
  },
  [CmdEnum['TO RIGHT']]: {
    name: CmdEnum['TO RIGHT'],
    label: '右移',
  },
  [CmdEnum['TO UP 10PX']]: {
    name: CmdEnum['TO UP 10PX'],
    label: '上移10px',
  },
  [CmdEnum['TO BUTTOM 10PX']]: {
    name: CmdEnum['TO BUTTOM 10PX'],
    label: '下移10px',
  },
  [CmdEnum['TO LEFT 10PX']]: {
    name: CmdEnum['TO LEFT 10PX'],
    label: '左移10px',
  },
  [CmdEnum['TO RIGHT 10PX']]: {
    name: CmdEnum['TO RIGHT 10PX'],
    label: '右移10px',
  },
  [CmdEnum['SELECT ALL']]: {
    name: CmdEnum['SELECT ALL'],
    label: '全选',
  },
  [CmdEnum['SELECT MULTI']]: {
    name: CmdEnum['SELECT MULTI'],
    label: '多选',
  },
  [CmdEnum['ZOOM IN']]: {
    name: CmdEnum['ZOOM IN'],
    label: '放大',
  },
  [CmdEnum['ZOOM OUT']]: {
    name: CmdEnum['ZOOM OUT'],
    label: '缩小',
  },
  [CmdEnum.GROUP]: {
    name: CmdEnum.GROUP,
    label: '组合',
  },
  [CmdEnum['BREAK GROUP']]: {
    name: CmdEnum['BREAK GROUP'],
    label: '打散',
  },
};

export default cmdMaps;
