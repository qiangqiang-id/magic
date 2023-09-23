import { ColorPicker } from 'antd';
import cls from 'classnames';
import { observer } from 'mobx-react';
import { TextProps } from './Text';
import Style from './Text.module.less';

function TextColor(props: TextProps) {
  const { model } = props;

  const changeColor = (_value, color: string) => {
    model.update<LayerModel.Text>({ color });
  };

  return (
    <div className={cls('setting-row', 'attribute-row')}>
      <ColorPicker
        value={model.color}
        onChange={changeColor}
        className={Style.text_color_picker}
      />
    </div>
  );
}

export default observer(TextColor);
