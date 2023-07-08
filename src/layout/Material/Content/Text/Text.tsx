import { Button } from 'antd';
import { magic } from '@/store';
import Style from './Text.module.less';

export default function Text() {
  const { activedScene } = magic;

  return (
    <div className={Style.text}>
      <Button
        type="primary"
        block
        style={{
          height: 40,
        }}
        onClick={() => activedScene?.addText()}
      >
        添加文字
      </Button>
    </div>
  );
}
