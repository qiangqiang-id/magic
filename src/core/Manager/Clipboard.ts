import { MAGIC_PREFIX } from '@/constants/CacheKeys';
import CreateLayerStruc from '@/models/FactoryStruc/LayerFactory';
import MagicStore from '@/store/Magic';
import copyText from '@/utils/copyText';

export default class ClipboardManager {
  private static magic: MagicStore;

  /**
   * 注册剪切板并监听粘贴事件
   * @param magic 作品数据
   */
  static register(magic: MagicStore) {
    this.magic = magic;

    const handlePaste = (e: ClipboardEvent) => {
      const data = e.clipboardData?.getData('text/plain');
      data && this.parseLayersFromText(data);
    };
    document.addEventListener('paste', handlePaste, false);
  }

  /**
   * 复制到剪切板
   */
  static copyToClipboard() {
    const layers = this.magic.clipboard;
    if (!layers || !layers.length) return;
    const text = JSON.stringify(layers.map(layer => layer.model()));
    copyText(this.formatText(text));
  }

  /**
   * 格式化剪贴板内容，防止系统其他复制动作干扰
   * @param text 当前复制的内容
   */
  private static formatText(text: string) {
    const host = encodeURIComponent(window.location.href);
    return `###${MAGIC_PREFIX}:COPY###${host}###${text}###`;
  }

  /**
   * 从剪贴板内容解析出 layers
   * @param text 剪贴板内容
   */
  private static parseLayersFromText(text: string) {
    const { key, models = [] } = this.parseText(text) || {};
    const host = key ? decodeURIComponent(key) : '';
    if (host === window.location.href || !models.length) return;
    const layers = models.map(model => CreateLayerStruc(model.type, model));
    this.magic.handlePasteLayers(layers);
  }

  /**
   * 字符串转换为LayerModel
   * @param text 剪贴板内容
   */
  private static parseText(text: string) {
    const reg = /###MAGIC:COPY###(.+?)###(.+?)###/;
    const result = text.match(reg);
    if (!result) return null;
    return {
      key: result[1],
      models: JSON.parse(result[2]) as LayerModel.Layer[],
    };
  }
}
