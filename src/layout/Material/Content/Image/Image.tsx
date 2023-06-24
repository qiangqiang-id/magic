import UploadBtn from '@/components/UploadBtn';

export default function Image() {
  const addImage = (files: File[]) => {
    console.log(files);
  };

  return (
    <div>
      <UploadBtn onChange={addImage} btnTitle="添加图片" />
    </div>
  );
}
