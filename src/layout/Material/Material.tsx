import { useStores } from '@/store';
import { MATERIAL_MENUS } from './constants';
import SidabarMenu from './SidabarMenu';
import Style from './Material.module.less';

export default function Material() {
  const { material } = useStores();
  return (
    <div className={Style.material}>
      <SidabarMenu materialStore={material} options={MATERIAL_MENUS} />
    </div>
  );
}
