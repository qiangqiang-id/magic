import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';
import { TextStruc } from '@/models/LayerStruc';
import { SettingProps } from '../Setting';
import TextStyle from './TextStyle';
import TextAlign from './TextAlign';
import TextFamilyWithSize from './TextFamilyWithSize';
import TextColor from './TextColor';

export interface TextProps extends SettingProps<TextStruc> {}

export default function Text(props: TextProps) {
  const { model } = props;
  return (
    <SettingContainer title="文字">
      <>
        <TextFamilyWithSize model={model} />

        <TextStyle model={model} />
        <TextAlign model={model} />
        <TextColor model={model} />
        <LayerBaseSetting model={model} />
      </>
    </SettingContainer>
  );
}
