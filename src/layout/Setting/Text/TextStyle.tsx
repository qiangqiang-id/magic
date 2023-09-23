import { Tooltip } from 'antd';
import cls from 'classnames';
import Style from './Text.module.less';

export default function TextStyle() {
  return (
    <div className={cls('setting-row', 'attribute-row')}>
      <Tooltip title="加粗">
        <i
          className={cls('iconfont icon-01jiacu', 'icon-item', Style.icon_item)}
        />
      </Tooltip>

      <Tooltip title="斜体">
        <i
          className={cls('iconfont icon-02xieti', 'icon-item', Style.icon_item)}
        />
      </Tooltip>

      <Tooltip title="下划线">
        <i
          className={cls(
            'iconfont icon-03xiahuaxian',
            'icon-item',
            Style.icon_item
          )}
        />
      </Tooltip>

      <Tooltip title="删除线">
        <i
          className={cls(
            'iconfont icon-04shanchuxian',
            'icon-item',
            Style.icon_item
          )}
        />
      </Tooltip>
    </div>
  );
}
