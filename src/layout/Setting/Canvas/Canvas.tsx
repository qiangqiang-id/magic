import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';

export default function Canvas() {
  return (
    <SettingContainer title="画布">
      <div>
        <LayerBaseSetting />
      </div>
    </SettingContainer>
  );
}
