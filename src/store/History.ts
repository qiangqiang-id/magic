import { makeAutoObservable } from 'mobx';
import HistoryChain, { ChainNode } from '@/helpers/Chain';
import { HistoryRecord } from '@/types/history';

export default class HistoryStore {
  /** 最大记录步骤，超过最大步骤数后，最新的顶替掉最老的 */
  static MAX_RECORD = 100;

  records: HistoryChain<HistoryRecord>;

  current: ChainNode<HistoryRecord> | null;

  constructor() {
    this.current = null;
    this.records = new HistoryChain<HistoryRecord>();
    makeAutoObservable(this);
  }

  /**
   * 是否可以撤销
   * @readonly
   * @memberof HistoryStore
   */
  get canUndo() {
    return !!this.current;
  }

  /**
   * 是否可以恢复
   * @readonly
   * @memberof HistoryStore
   */
  get canRedo() {
    const { current, records } = this;
    return !!(current ? current.prev : records.last());
  }

  /**
   * 追加一份记录
   * @param record 新的记录
   */
  push(record: HistoryRecord) {
    const { current, records } = this;
    this.current = !current
      ? records.unshift(record)
      : records.before(record, current, true);
    this.overflow();
  }

  /**
   * 超过最大记录数，清除最旧的记录
   */
  overflow() {
    const { records } = this;
    if (records.depth > HistoryStore.MAX_RECORD) {
      const last = records.last();
      last && records.remove(last);
    }
  }

  /**
   * 撤销
   * @returns {: HistoryRecord | null}
   */
  undo(): HistoryRecord | null {
    const { current } = this;
    if (!current) return null;
    this.current = current.next;
    return current.value;
  }

  /**
   * 恢复
   * @returns {: HistoryRecord | null}
   */
  redo(): HistoryRecord | null {
    const { current, records } = this;
    const node = current ? current.prev : records.last();
    if (!node) return null;
    this.current = node;
    return node.value;
  }

  /**
   * 清除记录
   */
  clear() {
    this.current = null;
    this.records.clear();
  }
}
