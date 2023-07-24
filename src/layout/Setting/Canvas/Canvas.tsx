import SettingContainer from '@/components/SettingContainer';
import { BackgroundStruc } from '@/models/LayerStruc';
import { SettingProps } from '../Setting';

interface CanvasProps extends SettingProps<BackgroundStruc | null> {}

export default function Canvas(props: CanvasProps) {
  const { model } = props;
  console.log(model);
  return (
    <SettingContainer title="画布">
      <div>canvas</div>
    </SettingContainer>
  );
}
