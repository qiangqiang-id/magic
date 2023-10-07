import { useRef, useEffect } from 'react';
import cls from 'classnames';
import Quill, { RangeStatic } from 'quill';
import Delta from 'quill-delta';
import { observer } from 'mobx-react';
import { TextStruc } from '@/models/LayerStruc';
import { getLayerOuterStyles, getLayerInnerStyles } from '@/helpers/Styles';
import useResizeObserver from '@/hooks/useResizeObserver';
import Style from './RichText.module.less';

const getBindings = () => ({
  custom: {
    key: 13,
    shiftKey: true,
    handler() {
      return false;
    },
  },
  tab: {
    key: 9,
    shiftKey: null,
    handler() {
      return false;
    },
  },
});

interface RichTextProps {
  zoomLevel: number;
  model: TextStruc;
  isMultiple: boolean;
}

function RichText(props: RichTextProps) {
  const { model, isMultiple, zoomLevel } = props;

  const { content, charAttrs, isEditing } = model;

  const quillRef = useRef<Quill | null>(null);
  const richTextContainerRef = useRef<HTMLDivElement>(null);
  const richTextRef = useRef<HTMLDivElement>(null);
  const selectedRange = useRef<RangeStatic | null>(null);
  const isFocus = useRef(false);

  const [entry] = useResizeObserver(richTextContainerRef);

  const isShow = !isMultiple && isEditing;

  /**
   * 实例化quill
   * */
  const initEditor = () => {
    if (!richTextRef.current) return;
    quillRef.current = new Quill(richTextRef.current, {
      modules: {
        keyboard: {
          bindings: getBindings(),
        },
      },
    });

    quillRef.current.clipboard.addMatcher(Node.ELEMENT_NODE, editorMatcher);
    quillRef.current.on('selection-change', selectChange);
    quillRef.current.on('text-change', textChange);
    quillRef.current.root.addEventListener('focus', focusChange);
    quillRef.current.root.addEventListener('blur', blurChange);
  };

  /**
   * 捕获粘贴内容并过滤，仅支持纯文本
   */
  const editorMatcher = (_node, delta: Delta) => {
    delta.ops = delta.ops
      .map((op: Delta) => ({
        insert: op.insert.replaceAll(/\n|\t/g, ' '),
      }))
      .filter((op: Delta) => typeof op.insert === 'string');
    return delta;
  };

  /**
   * 绑定selection-change事件
   */
  const selectChange = (
    newRange: RangeStatic,
    _oldRange
    // source: 'api' | 'user'
  ) => {
    selectedRange.current = newRange;

    // 兼容火狐浏览器，保留上一次的选取
    // if (
    //   (/firefox/i.test(window.navigator.userAgent) && newRange === null) ||
    //   source === 'api'
    // ) {
    //   // model.setTextRange(oldRange);
    //   range.current = oldRange;
    //   console.log('oldRange', oldRange);
    // }

    // if (newRange) {
    //   const style = quillRef.current?.getFormat(newRange);
    //   model.setSelectedStyle(style);
    // }
  };

  /**
   * 绑定text-change事件
   */
  const textChange = () => {
    // const delta = quillRef.current?.getContents();
    let content = quillRef.current?.getText();
    // 删除最后一项 \n
    content = content?.substring(0, content.length - 1);
    // const charAttrs = getCharAttrs(delta, fill?.color || '');

    if (selectedRange.current) {
      // const style = quillRef.current?.getFormat(selectedRange.current);
      // model.setSelectedStyle(style);
    }
    model.update({ content });
  };

  /**
   * 聚焦事件回调
   */
  const focusChange = () => {
    isFocus.current = true;
  };

  /**
   * 失焦事件回调
   */
  const blurChange = () => {
    isFocus.current = false;
    if (!model.content) {
      model.remove();
    }
  };

  const formatText = (val: string): Delta => {
    quillRef.current?.setText(val);
    charAttrs?.forEach(i => {
      const { bgColor, color, endPos, start } = i;
      if (bgColor) {
        quillRef.current?.formatText(start, endPos - start, {
          background: bgColor,
        });
      }
      if (color) {
        quillRef.current?.formatText(start, endPos - start, {
          color,
        });
      }
    });
    return quillRef.current?.getContents();
  };

  /**
   * 初始化富文本内容
   *  */
  const initTextContent = (val: string) => {
    const delta = formatText(val);
    quillRef.current?.setContents(delta);
  };

  /**
   *  禁止编辑
   * */
  const disableEdit = () => {
    quillRef.current?.enable(false);
    quillRef.current?.blur();
  };

  /**
   * 开启编辑
   */
  const editableEdit = () => {
    quillRef.current?.enable(true);
    quillRef.current?.focus();
    quillRef.current?.setSelection(0, getTextValue().length);
  };

  /**
   * 更新高度
   *  */
  const uploadHeight = (entry: ResizeObserverEntry) => {
    const offsetHeight = (entry.target as HTMLDivElement).offsetHeight;
    const height = offsetHeight || model.height;
    model.update(
      {
        height,
      },
      { ignore: true }
    );
  };

  /** 获取文字 */
  const getTextValue = () => content || '双击编辑文字';

  /**
   * 初始化富文本
   */
  useEffect(() => {
    initEditor();
    initTextContent(getTextValue());
  }, [model]);

  useEffect(() => {
    isEditing ? editableEdit() : disableEdit();
  }, [isEditing]);

  /** 更新高度 */
  useEffect(() => {
    entry && uploadHeight(entry);
  }, [entry]);

  const containerStyle = getLayerOuterStyles(model, zoomLevel);
  const innerStyle = getLayerInnerStyles(model);
  const outerStyle = {
    ...getLayerOuterStyles(model),
    transform: `scale(${zoomLevel})`,
  };
  Reflect.deleteProperty(outerStyle, 'height');

  return (
    <div
      className={cls(Style.rich_text_contariner, {
        [Style.show]: isShow,
      })}
      style={{ ...containerStyle }}
    >
      <div
        ref={richTextContainerRef}
        style={{
          ...outerStyle,
          transformOrigin: 'top left',
        }}
      >
        <div
          className={Style.rich_text_main}
          style={{ ...innerStyle }}
          spellCheck="false"
          ref={richTextRef}
        />
      </div>
    </div>
  );
}

export default observer(RichText);
