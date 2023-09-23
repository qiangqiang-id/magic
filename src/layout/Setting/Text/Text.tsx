import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';
import { TextStruc } from '@/models/LayerStruc';
import { SettingProps } from '../Setting';
import TextStyle from './TextStyle';
import TextAlign from './TextAlign';
import TextFamilyWithSize from './TextFamilyWithSize';

export interface TextProps extends SettingProps<TextStruc> {}

export default function Text(props: TextProps) {
  const { model } = props;
  return (
    <SettingContainer title="文字">
      <>
        <TextFamilyWithSize model={model} />

        <TextStyle />
        <TextAlign />
        <LayerBaseSetting model={model} />
      </>
    </SettingContainer>
  );
}
