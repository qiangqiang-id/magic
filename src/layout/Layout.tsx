import Header from './Header';
import Material from './Material';
import Stage from './Stage';
import Setting from './Setting';

import Style from './Layout.module.less';

export default function Layout() {
  return (
    <div className={Style.layout}>
      <Header />

      <div className={Style.main}>
        <Material />
        <Stage />
        <Setting />
      </div>
    </div>
  );
}
