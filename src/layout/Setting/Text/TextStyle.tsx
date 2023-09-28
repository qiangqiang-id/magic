import { Tooltip } from 'antd';
import cls from 'classnames';
import { observer } from 'mobx-react';

import { TextProps } from './Text';
import Style from './Text.module.less';
import {
  FontWeightEnum,
  FontStyleEnum,
  TextDecorationEnum,
} from '@/constants/Font';

function TextStyle(props: TextProps) {
  const { model } = props;

  const { fontWeight, fontStyle, textDecoration } = model;

  const setFontWeight = () => {
    const newFontWeight =
      fontWeight === FontWeightEnum.Bold
        ? FontWeightEnum.Normal
        : FontWeightEnum.Bold;
    model.update({ fontWeight: newFontWeight });
  };

  const setFontStyle = () => {
    const newFontStyle =
      fontStyle === FontStyleEnum.Italic
        ? FontStyleEnum.Normal
        : FontStyleEnum.Italic;
    model.update({ fontStyle: newFontStyle });
  };

  const setTextDecoration = (type: TextDecorationEnum) => {
    const newTextDecoration =
      textDecoration !== type ? type : TextDecorationEnum.None;

    model.update({ textDecoration: newTextDecoration });
  };

  return (
    <div className={cls('setting-row', 'attribute-row')}>
      <Tooltip title="加粗">
        <i
          onClick={setFontWeight}
          className={cls(
            'iconfont icon-01jiacu',
            'icon-item',
            Style.icon_item,
            { [Style.text_style_active]: fontWeight === FontWeightEnum.Bold }
          )}
        />
      </Tooltip>

      <Tooltip title="斜体">
        <i
          onClick={setFontStyle}
          className={cls(
            'iconfont icon-02xieti',
            'icon-item',
            Style.icon_item,
            { [Style.text_style_active]: fontStyle === FontStyleEnum.Italic }
          )}
        />
      </Tooltip>

      <Tooltip title="下划线">
        <i
          onClick={() => setTextDecoration(TextDecorationEnum.Underline)}
          className={cls(
            'iconfont icon-03xiahuaxian',
            'icon-item',
            Style.icon_item,
            {
              [Style.text_style_active]:
                textDecoration === TextDecorationEnum.Underline,
            }
          )}
        />
      </Tooltip>

      <Tooltip title="删除线">
        <i
          onClick={() => setTextDecoration(TextDecorationEnum.LineThrough)}
          className={cls(
            'iconfont icon-04shanchuxian',
            'icon-item',
            Style.icon_item,
            {
              [Style.text_style_active]:
                textDecoration === TextDecorationEnum.LineThrough,
            }
          )}
        />
      </Tooltip>
    </div>
  );
}

export default observer(TextStyle);
