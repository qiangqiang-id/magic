import { useMemo, createElement } from 'react';
import { Tabs } from 'antd';
import { observer } from 'mobx-react';
import MaterialStore from '@/store/Material';
import { MenuItemModel } from '@/types/material';

import Style from './SidabarMenu.module.less';

interface MenuProps {
  /** 侧边栏store */
  materialStore: MaterialStore;

  /** 菜单配置项 */
  options: MenuItemModel[];
}

function SidabarMenu(props: MenuProps) {
  const { options = [], materialStore } = props;

  const { activeMenu } = materialStore;

  /** 切换菜单 */
  const handleSwitchMenu = menuKey => {
    materialStore.changeMenu(menuKey);
  };

  /** 当前激活的菜单配置 */
  const actived = useMemo(
    () => options.find(item => item.name === activeMenu),
    [activeMenu, options]
  );

  /** 需要展示的菜单 */
  const showOptions = useMemo(
    () => options.filter(item => !item.hiddenLabel),
    [options]
  );

  const items = useMemo(
    () =>
      showOptions.map(item => ({
        key: item.name,
        label: (
          <div>
            <i className={`iconfont icon ${item.icon}`} />
            {item.label}
          </div>
        ),
        children: null,
      })),
    [showOptions]
  );

  return (
    <div className={Style.sidabar_menu}>
      {/* 菜单区域 */}
      <div className={Style.menu}>
        <Tabs
          items={items}
          tabPosition="left"
          activeKey={activeMenu}
          onChange={handleSwitchMenu}
        />
      </div>

      <div className={Style.content}>
        {actived && createElement(actived.component)}
      </div>
    </div>
  );
}

export default observer(SidabarMenu);
