/**
 * 链路节点
 */
export class ChainNode<T> {
  value: T;

  next: ChainNode<T> | null;

  prev: ChainNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

/**
 * 历史链路
 */
export default class HistoryChain<T> {
  private head: ChainNode<T> | null = null;

  constructor(source?: T) {
    source && (this.head = new ChainNode(source));
  }

  /**
   * 返回链路深度
   * @readonly
   * @type {number}
   * @memberof HistoryChain
   */
  get depth(): number {
    let len = 0;
    let node = this.head;

    while (node) {
      len += 1;
      node = node.next;
    }
    return len;
  }

  /**
   * 插入一个元素到指定节点前
   * @param value 新元素
   * @param after 前一个
   * @param discard 是否丢弃前面的
   * @returns {ChainNode<T>} 新的节点
   */
  before(value: T, after: ChainNode<T>, discard = false): ChainNode<T> {
    const node = new ChainNode(value);
    if (!discard) node.prev = after.prev;
    after.prev = node;
    node.next = after;
    return node;
  }

  /**
   * 插入一个元素到指定节点后
   * @param value 新元素
   * @param before 前一个
   * @param discard 是否丢弃前面的
   * @returns {ChainNode<T>} 新的节点
   */
  after(value: T, before: ChainNode<T>, discard = false): ChainNode<T> {
    const node = new ChainNode(value);
    if (!discard) node.next = before.next;
    before.next = node;
    node.prev = before;
    return node;
  }

  /**
   * 尾部追加
   * @param value 新的元素
   * @returns {ChainNode<T>}
   */
  push(value: T): ChainNode<T> {
    const tail = this.last();
    if (!tail) {
      this.head = new ChainNode(value);
      return this.head;
    }
    return this.after(value, tail);
  }

  /**
   * 头部追加
   * @param value 新的元素
   * @returns {ChainNode<T>}
   */
  unshift(value: T): ChainNode<T> {
    if (!this.head) {
      this.head = new ChainNode(value);
      return this.head;
    }
    return this.before(value, this.head);
  }

  /**
   * 删除节点
   * @param node 需要删除的节点
   */
  remove(node: ChainNode<T>) {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    node.next = null;
    node.prev = null;
  }

  /**
   * 返回首位
   * @returns {ChainNode<T> | null}
   */
  first(): ChainNode<T> | null {
    return this.head;
  }

  /**
   * 返回尾部
   * @returns {ChainNode<T> | null}
   */
  last(): ChainNode<T> | null {
    let node = this.head;
    while (node && node.next) {
      node = node.next;
    }
    return node;
  }

  /**
   * 链路是否为空
   * @returns {boolean}
   */
  isEmpty(): boolean {
    return this.head === null;
  }

  /**
   * 清空链路
   */
  clear() {
    this.head = null;
  }
}
