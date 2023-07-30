import { Button } from 'antd';
import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';
import { ImageStruc } from '@/models/LayerStruc';

import { SettingProps } from '../Setting';

interface ImageProps extends SettingProps<ImageStruc> {}

export default function Image(props: ImageProps) {
  const { model } = props;

  return (
    <SettingContainer title="图片">
      <LayerBaseSetting model={model} />

      <Button block type="primary" className="setting-row">
        替换图片
      </Button>
    </SettingContainer>
  );
}
