import { useRef, ChangeEvent } from 'react';
import { Button } from 'antd';
import cls from 'classnames';
import Style from './UploadBtn.module.less';

interface UploadBtnProps {
  className?: string;
  btnTitle?: string;
  onChange?: (files: File[]) => void;
  accept?: string;
}

export default function UploadBtn(props: UploadBtnProps) {
  const { className, btnTitle = '上传按钮', onChange, accept } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    onChange?.(Array.from(files || []));
    event.target.value = '';
  };

  return (
    <>
      <Button
        className={cls(className, Style.upload_btn)}
        block
        type="primary"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        {btnTitle}
      </Button>
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept={accept}
        onChange={handleChange}
      />
    </>
  );
}
