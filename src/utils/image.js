export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 25000000;

export async function getImageError(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'type';
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return 'size';
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const pixels = img.naturalWidth * img.naturalHeight;
      URL.revokeObjectURL(url);
      if (pixels > MAX_IMAGE_PIXELS) {
        resolve('pixels');
      } else {
        resolve(null);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve('type');
    };

    img.src = url;
  });
}
