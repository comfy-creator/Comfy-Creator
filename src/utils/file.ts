import { SUPPORTED_IMAGE_TYPES, SUPPORTED_VIDEO_TYPES } from '../config/constants.ts';

export function getFileKind(file: File) {
  if (file.type === 'application/json') {
    return 'json';
  } else if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return 'image';
  } else if (SUPPORTED_VIDEO_TYPES.includes(file.type)) {
    return 'video';
  }

  throw new Error(`Unsupported file type ${file.type}`);
}

export function getFileAsDataURL(file: File) {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      if (!e.target?.result) {
        reject('Failed to load file data');
      } else {
        resolve(e.target.result);
      }
    };

    reader.readAsDataURL(file);
  });
}
