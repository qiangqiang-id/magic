import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { OS } from '@/store';
import Style from './ToolsWithTips.module.less';

function ToolsWithTips() {
  const handleZoomOut = () => {
    OS.zoomOut();
  };

  const handleZoomIn = () => {
    OS.zoomIn();
  };

  const handleResetZoom = () => {
    OS.zoomReset();
  };

  return (
    <div className={Style['tools-with-tips']}>
      <div className={Style['zoom-level-box']}>
        <div className={Style['zoom-level-icon']}>
          <button
            type="button"
            className={Style.icon}
            onClick={handleZoomOut}
            disabled={!OS.canZoomOut}
            aria-label="缩小画布"
            title="缩小画布"
          >
            <MinusOutlined />
          </button>

          <button
            type="button"
            className={Style.icon}
            onClick={handleZoomIn}
            disabled={!OS.canZoomIn}
            aria-label="放大画布"
            title="放大画布"
          >
            <PlusOutlined />
          </button>
        </div>

        <button
          type="button"
          className={Style['zoom-level-num']}
          onClick={handleResetZoom}
          aria-label="重置画布缩放为 100%"
          title="重置为 100%"
        >
          {Math.round(OS.zoomLevel * 100)}%
        </button>
      </div>
    </div>
  );
}

export default observer(ToolsWithTips);
