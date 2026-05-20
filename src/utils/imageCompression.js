/**
 * Client-side image compression using Canvas API
 * Reduces file size by 60-80% with minimal quality loss
 */

const MAX_WIDTH = 1200;
const TARGET_MAX_SIZE = 2 * 1024 * 1024; // 2MB
const INITIAL_QUALITY = 0.7;
const MIN_QUALITY = 0.3;
const QUALITY_STEP = 0.1;

/**
 * Compress an image file
 * @param {File} file - The image file to compress
 * @returns {Promise<{file: File, originalSize: number, compressedSize: number}>}
 */
export async function compressImage(file) {
  // Only compress images
  if (!file.type.startsWith('image/')) {
    return { file, originalSize: file.size, compressedSize: file.size };
  }

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.onload = async () => {
          // Calculate dimensions maintaining aspect ratio
          let { width, height } = img;
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Try compressing with decreasing quality
          let quality = INITIAL_QUALITY;
          let blob = await canvasToBlob(canvas, quality);

          while (blob.size > TARGET_MAX_SIZE && quality > MIN_QUALITY) {
            quality -= QUALITY_STEP;
            blob = await canvasToBlob(canvas, quality);
          }

          // Create new File from blob
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          resolve({
            file: compressedFile,
            originalSize,
            compressedSize: compressedFile.size,
          });
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality);
  });
}

/**
 * Generate a preview URL for a file
 * @param {File} file
 * @returns {string} Object URL for preview
 */
export function generatePreview(file) {
  return URL.createObjectURL(file);
}

/**
 * Format file size in human-readable format
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
