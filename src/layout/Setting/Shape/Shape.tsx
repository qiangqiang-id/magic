import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';

import { ShapeStruc } from '@/models/LayerStruc';
import { SettingProps } from '../Setting';

interface ShapeProps extends SettingProps<ShapeStruc> {}

export default function Shape(props: ShapeProps) {
  const { model } = props;
  return (
    <SettingContainer title="图形">
      <div>
        <LayerBaseSetting model={model} />
      </div>
    </SettingContainer>
  );
}
