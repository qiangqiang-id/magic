import CmdEnum from '@/constants/CmdEnum';
import MagicStore from '@/store/Magic';
import OSStore from '@/store/OS';

export type CmdHandler = (data?: any) => void;

export default class CmdManager {
  // 命令集合
  private static cmds: Map<CmdEnum, CmdHandler[]> = new Map();

  /**
   * 注册所有命令
   * @param cmd 命令名称
   * @param handle 执行钩子
   */
  static register(cmd: CmdEnum, handle: CmdHandler) {
    const handlers = CmdManager.cmds.get(cmd) || [];
    handlers.push(handle);
    CmdManager.cmds.set(cmd, handlers);
  }

  /**
   * 执行命令
   * @param cmd 命令名称
   * @param data 额外传入的数据
   */
  static execute(cmd: CmdEnum, data?: any) {
    const handlers = CmdManager.cmds.get(cmd) || [];
    handlers.forEach(handle => handle(data));
  }

  /**
   * 检查命令是否已经注册
   * @param cmd 命令名称
   * @returns {boolean}
   */
  static has(cmd: CmdEnum): boolean {
    return CmdManager.cmds.has(cmd);
  }
}

/**
 * 注册相关命令
 */
function registerCmds(cmds: Record<string, CmdHandler>) {
  for (const key in cmds) {
    CmdManager.register(+key, cmds[key]);
  }
}

/**
 * 注册作品相关动作命令
 * @param app 作品数据
 */
export function registerAppActions(magic: MagicStore) {
  console.log('registerAppActions', magic);
  const cmdToAction: Record<string, CmdHandler> = {
    [CmdEnum.SAVE]() {
      console.log('SAVE');
    },
    [CmdEnum.COPY]() {
      console.log('COPY');
    },
    [CmdEnum.CUT]() {
      console.log('CUT');
    },
    [CmdEnum.PASTE]() {
      console.log('PASTE');
    },
    [CmdEnum.DELETE]() {
      console.log('DELETE');
    },
    [CmdEnum['SELECT ALL']]() {
      console.log('SELECT ALL');
    },
    [CmdEnum['TO UP']]() {
      console.log(-1, 'top');
    },
    [CmdEnum['TO BUTTOM']]() {
      console.log(1, 'top');
    },
    [CmdEnum['TO UP 10PX']]() {
      console.log(-10, 'top');
    },
    [CmdEnum['TO BUTTOM 10PX']]() {
      console.log(10, 'top');
    },
    [CmdEnum['TO LEFT']]() {
      console.log(-1, 'left');
    },
    [CmdEnum['TO RIGHT']]() {
      console.log(1, 'left');
    },
    [CmdEnum['TO LEFT 10PX']]() {
      console.log(-10, 'left');
    },
    [CmdEnum['TO RIGHT 10PX']]() {
      console.log(10, 'left');
    },
  };

  registerCmds(cmdToAction);
}

/**
 * 注册系统设置相关动作命令
 * @param OS 系统设置
 */
export function registerOSSActions(OS: OSStore) {
  const cmdToAction: Record<string, CmdHandler> = {
    [CmdEnum['ZOOM IN']]() {
      console.log('ZOOM IN');
      OS.zoomIn();
    },
    [CmdEnum['ZOOM OUT']]() {
      console.log('ZOOM OUT');
      OS.zoomOut();
    },
  };

  registerCmds(cmdToAction);
}

/**
 * 注册操作记录相关动作命令
 */
export function registerHistoryActions() {
  const cmdToAction: Record<string, CmdHandler> = {
    [CmdEnum.UNDO]() {
      // HistoryManager.undo()
      console.log('UNDO');
    },
    [CmdEnum.REDO]() {
      // HistoryManager.redo();
      console.log('REDO');
    },
  };

  registerCmds(cmdToAction);
}
