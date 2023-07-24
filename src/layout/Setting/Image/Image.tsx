import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';
import { ImageStruc } from '@/models/LayerStruc';

import { SettingProps } from '../Setting';

interface ImageProps extends SettingProps<ImageStruc> {}

export default function Image(props: ImageProps) {
  const { model } = props;

  return (
    <SettingContainer title="图片">
      <div>
        <LayerBaseSetting model={model} />
      </div>
    </SettingContainer>
  );
}
