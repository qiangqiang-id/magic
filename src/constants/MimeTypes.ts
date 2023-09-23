export const MIME_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jpe: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  ief: 'image/ief',
  ico: 'image/x-icon',
  icon: 'image/x-icon',
  svg: 'image/svg+xml',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  webp: 'image/webp',
};

/** 可透明图片 */
export const TRANSPARENT_PICTURE_MIME_TYPES = [
  MIME_TYPES.png,
  MIME_TYPES.webp,
  MIME_TYPES.gif,
];
