import { Tooltip } from 'antd';
import cls from 'classnames';
import { observer } from 'mobx-react';
import { TextProps } from './Text';
import { TextAlignEnum } from '@/constants/Font';

import Style from './Text.module.less';

function TextAlign(props: TextProps) {
  const { model } = props;

  const { textAlign } = model;

  const setTextAlign = (textAlign: TextAlignEnum) => {
    model.update<LayerModel.Text>({ textAlign });
  };

  return (
    <div className={cls('setting-row', 'attribute-row')}>
      <Tooltip title="左对齐">
        <i
          onClick={() => setTextAlign(TextAlignEnum.Left)}
          className={cls(
            'iconfont icon-09zuoduiqi',
            'icon-item',
            Style.icon_item,
            { [Style.text_style_active]: textAlign === TextAlignEnum.Left }
          )}
        />
      </Tooltip>

      <Tooltip title="居中对齐">
        <i
          onClick={() => setTextAlign(TextAlignEnum.Center)}
          className={cls(
            'iconfont icon-11juzhongduiqi',
            'icon-item',
            Style.icon_item,
            { [Style.text_style_active]: textAlign === TextAlignEnum.Center }
          )}
        />
      </Tooltip>

      <Tooltip title="右对齐">
        <i
          onClick={() => setTextAlign(TextAlignEnum.Right)}
          className={cls(
            'iconfont icon-10youduiqi',
            'icon-item',
            Style.icon_item,
            { [Style.text_style_active]: textAlign === TextAlignEnum.Right }
          )}
        />
      </Tooltip>

      <Tooltip title="两端对齐">
        <i
          onClick={() => setTextAlign(TextAlignEnum.Justify)}
          className={cls(
            'iconfont icon-12liangduanduiqi',
            'icon-item',
            Style.icon_item,
            { [Style.text_style_active]: textAlign === TextAlignEnum.Justify }
          )}
        />
      </Tooltip>
    </div>
  );
}

export default observer(TextAlign);
