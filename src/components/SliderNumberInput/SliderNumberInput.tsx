import { ReactNode } from 'react';
import { Slider, InputNumber } from 'antd';
import Style from './SliderNumberInput.module.less';

interface SliderNumberInputProps {
  prefixIcon?: ReactNode;
  min?: number;
  max?: number;
  value?: number;
  onChange?: (val: number) => void;
}

export default function SliderNumberInput(props: SliderNumberInputProps) {
  const { prefixIcon, value, min = 0, max = 100, onChange } = props;

  const inputChange = (value: number | null) => {
    onChange?.(Number(value));
  };

  return (
    <div className={Style.slider_number_input}>
      {prefixIcon}

      <Slider
        onChange={onChange}
        value={value}
        min={min}
        max={max}
        className={Style.slider}
      />
      <InputNumber
        onChange={inputChange}
        value={value}
        min={min}
        max={max}
        className={Style.input_number}
      />
    </div>
  );
}
