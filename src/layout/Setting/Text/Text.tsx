import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';
import { TextStruc } from '@/models/LayerStruc';
import { SettingProps } from '../Setting';

interface TextProps extends SettingProps<TextStruc> {}

export default function Text(props: TextProps) {
  const { model } = props;
  return (
    <SettingContainer title="文字">
      <div>
        <LayerBaseSetting model={model} />
      </div>
    </SettingContainer>
  );
}
