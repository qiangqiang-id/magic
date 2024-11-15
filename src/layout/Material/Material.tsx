import { useStores } from '@/store';
import { MATERIAL_MENUS } from './constants';
import SidebarMenu from './SidebarMenu';
import Style from './Material.module.less';

export default function Material() {
  const { material } = useStores();
  return (
    <div className={Style.material}>
      <SidebarMenu materialStore={material} options={MATERIAL_MENUS} />
    </div>
  );
}
