import SettingContainer from '@/components/SettingContainer';
import LayerBaseSetting from '@/components/LayerBaseSetting';

export default function Shape() {
  return (
    <SettingContainer title="图形">
      <div>
        <LayerBaseSetting />
      </div>
    </SettingContainer>
  );
}
