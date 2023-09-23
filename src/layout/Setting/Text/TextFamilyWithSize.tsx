import { InputNumber, Select } from 'antd';
import { observer } from 'mobx-react';
import { font } from '@/store';
import { TextProps } from './Text';

import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '@/constants/FontSize';

import Style from './Text.module.less';

function TextFamilyWithSize(props: TextProps) {
  const { model } = props;

  const changeFamily = (family: string) => {
    model.update<LayerModel.Text>({ fontFamily: family });
  };

  const changeFontsize = (fontSize: number | null) => {
    if (fontSize === null) return;
    model.update<LayerModel.Text>({ fontSize });
  };

  return (
    <div className={Style.text_family_with_size}>
      <Select
        value={model.fontFamily}
        placeholder="请选择字体"
        className={Style.font_family_select}
        options={font.fontList}
        onChange={changeFamily}
      />
      <InputNumber
        value={Math.round(model.fontSize || MIN_FONT_SIZE)}
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        onChange={changeFontsize}
      />
    </div>
  );
}

export default observer(TextFamilyWithSize);
