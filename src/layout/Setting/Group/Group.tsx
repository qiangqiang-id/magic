import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';

import { GroupStruc } from '@/models/LayerStruc';
import { SettingProps } from '../Setting';

interface GroupProps extends SettingProps<GroupStruc> {}

export default function Group(props: GroupProps) {
  const { model } = props;
  return (
    <SettingContainer title="组合">
      <div>
        <LayerBaseSetting model={model} />
      </div>
    </SettingContainer>
  );
}
