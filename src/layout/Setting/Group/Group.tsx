import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';

export default function Group() {
  return (
    <SettingContainer title="组合">
      <div>
        <LayerBaseSetting />
      </div>
    </SettingContainer>
  );
}
