import { Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import cls from 'classnames';
import { magic } from '@/store';
import Style from './Header.module.less';

const goGithub = () => {
  window.open('https://github.com/qiangqiang-id/magic');
};

export default function Header() {
  return (
    <div className={Style.header}>
      <div>
        <div className={cls(Style.product_name, 'single-line-omit')}>
          {magic.name}
        </div>
      </div>
      <div>
        <Button type="primary">导出</Button>

        <GithubOutlined className={Style.github_icon} onClick={goGithub} />
      </div>
    </div>
  );
}
