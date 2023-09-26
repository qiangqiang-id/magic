export default function copyText(text: string) {
  const textArea = document.createElement('textarea');
  textArea.readOnly = true;
  textArea.style.position = 'absolute';
  textArea.style.left = '-9999999px';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  textArea.setSelectionRange(0, textArea.value.length);
  const isCopy = document.execCommand('copy');
  if (!isCopy) console.warn('复制文本失败');
  document.body.removeChild(textArea);
  return isCopy;
}
