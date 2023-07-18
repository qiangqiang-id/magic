import { useRef, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Quill from 'quill';
import Delta from 'quill-delta';
import { TextStruc } from '@/models/LayerStruc';
import { LayerProps } from '../Layer';
import Style from './Text.module.less';

interface TextProps extends LayerProps<TextStruc> {}

function Text(props: TextProps) {
  const { model, style } = props;

  const { content, charAttrs } = model;

  const [textValue, setTextValue] = useState('');

  const textMainRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  /**
   * 实例化quill
   * */
  const initEditor = () => {
    if (!textMainRef.current) return;
    quillRef.current = new Quill(textMainRef.current, {});
    quillRef.current?.enable(false);
    quillRef.current?.blur();
  };

  const formatTitleText = (val: string): Delta => {
    quillRef.current?.setText(val);
    if (charAttrs?.length) {
      charAttrs.forEach((i: Delta) => {
        const { bgColor, color, start, endPos } = i;
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
    }
    return quillRef.current?.getContents();
  };

  /**
   * 初始化富文本内容
   *  */
  const initTextContent = (val: string) => {
    const delta = formatTitleText(val);
    quillRef.current?.setContents(delta);
  };

  /** 获取文字 */
  const getTextValue = () => content || '双击编辑文字';

  /** 初始化文字内容 */
  useEffect(() => {
    setTextValue(getTextValue());
  }, [content]);

  /** 初始化富文本 */
  useEffect(() => {
    initEditor();
  }, []);

  useEffect(() => {
    initTextContent(textValue);
  }, [textValue, charAttrs]);

  return (
    <div style={style} className={Style['text-container']}>
      {/* 文字主体 */}
      <div
        spellCheck="false"
        className={Style['text-main']}
        ref={textMainRef}
        style={
          {
            // visibility: model.isEditing ? 'hidden' : 'visible',
          }
        }
      />
    </div>
  );
}

export default observer(Text);
