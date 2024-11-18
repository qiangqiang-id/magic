import { ReactElement, cloneElement, useRef } from 'react';

interface UploadProps {
  children: ReactElement;
  accept?: string[];
  multiple?: boolean;
  onChange?: (files: File[]) => void;
}

export default function Upload(props: UploadProps) {
  const { children, multiple, accept, onChange } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
    children.props.onClick?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    onChange?.(files);
  };

  return (
    <>
      {cloneElement(children, { onClick: handleClick })}
      <input
        multiple={multiple}
        ref={inputRef}
        type="file"
        hidden
        accept={accept?.join(',')}
        onChange={handleChange}
      />
    </>
  );
}
