import HistoryStore from '@/store/History';
import { HistoryRecord } from '@/types/history';

/**
 * 操作记录管理中心
 */
export default class HistoryManager {
  private static history: HistoryStore;

  /**
   * 注册历史管理中心
   * @static
   * @memberof HistoryManager
   */
  static register(history: HistoryStore) {
    HistoryManager.history = history;
  }

  /**
   * 追加新纪录
   * @param record 新的记录
   */
  static push(record: HistoryRecord) {
    HistoryManager.history?.push(record);
  }

  /**
   * 撤销操作
   */
  static undo() {
    const current = HistoryManager.history.undo();
    current?.reverse();
  }

  /**
   * 恢复操作
   */
  static redo() {
    const current = HistoryManager.history.redo();
    current?.obverse();
  }

  /**
   * 重置
   */
  static reset() {
    HistoryManager.history.clear();
  }
}
