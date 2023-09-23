import { Tooltip } from 'antd';
import cls from 'classnames';
import Style from './Text.module.less';

export default function TextAlign() {
  return (
    <div className={cls('setting-row', 'attribute-row')}>
      <Tooltip title="左对齐">
        <i
          className={cls(
            'iconfont icon-09zuoduiqi',
            'icon-item',
            Style.icon_item
          )}
        />
      </Tooltip>

      <Tooltip title="居中对齐">
        <i
          className={cls(
            'iconfont icon-11juzhongduiqi',
            'icon-item',
            Style.icon_item
          )}
        />
      </Tooltip>

      <Tooltip title="右对齐">
        <i
          className={cls(
            'iconfont icon-10youduiqi',
            'icon-item',
            Style.icon_item
          )}
        />
      </Tooltip>

      <Tooltip title="两端对齐">
        <i
          className={cls(
            'iconfont icon-12liangduanduiqi',
            'icon-item',
            Style.icon_item
          )}
        />
      </Tooltip>
    </div>
  );
}
