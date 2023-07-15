import { useMemo, useState } from 'react';
import { Button, Modal, Image } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import cls from 'classnames';
import screenshot from '@p/Screenshot';
import { magic } from '@/store';
import { CANVAS_REF } from '@/constants/Refs';
import { singleDownload } from '@/utils/download';
import { randomString } from '@/utils/random';
import Style from './Header.module.less';

const goGithub = () => {
  window.open('https://github.com/qiangqiang-id/magic');
};

export default function Header() {
  const { activedScene, name } = magic;

  const [blobUrl, setBlobUrl] = useState('');

  /** 导出 */
  const handleExport = async () => {
    const node = CANVAS_REF.current?.firstChild as HTMLElement;
    if (!node || !activedScene) return;
    const { width, height } = activedScene;
    const blob = await screenshot(node, {
      width,
      height,
      style: { transform: 'none' },
    });
    setBlobUrl(URL.createObjectURL(blob));
  };

  const open = useMemo(() => !!blobUrl, [blobUrl]);

  /** 取消 */
  const closeModal = () => {
    URL.revokeObjectURL(blobUrl);
    setBlobUrl('');
  };

  const onDownload = () => {
    singleDownload(blobUrl, name || randomString());
  };

  return (
    <div className={Style.header}>
      <div>
        <div className={cls(Style.product_name, 'single-line-omit')}>
          {magic.name}
        </div>
      </div>
      <div>
        <Button type="primary" onClick={handleExport}>
          导出
        </Button>

        <GithubOutlined className={Style.github_icon} onClick={goGithub} />
      </div>

      <Modal
        title="导出"
        width={400}
        open={open}
        centered
        onCancel={closeModal}
        okText="下载"
        cancelText="取消"
        onOk={onDownload}
      >
        <Image src={blobUrl} />
      </Modal>
    </div>
  );
}
