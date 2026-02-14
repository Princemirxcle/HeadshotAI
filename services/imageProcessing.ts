/**
 * Client-side image processing utilities for free tier restrictions.
 * - Downscales images to a max resolution (512px for free tier)
 * - Applies a diagonal watermark overlay
 */

const WATERMARK_TEXT = 'ProHeadshot AI';

/**
 * Loads a data URL into an HTMLImageElement.
 */
function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Downscales an image so its longest side is at most `maxPx` pixels.
 * Returns a new data URL. If the image is already smaller, it's returned as-is.
 */
export async function downscaleImage(dataUrl: string, maxPx: number): Promise<string> {
  const img = await loadImage(dataUrl);

  const { naturalWidth: w, naturalHeight: h } = img;
  if (w <= maxPx && h <= maxPx) return dataUrl;

  const scale = maxPx / Math.max(w, h);
  const newW = Math.round(w * scale);
  const newH = Math.round(h * scale);

  const canvas = document.createElement('canvas');
  canvas.width = newW;
  canvas.height = newH;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, newW, newH);

  return canvas.toDataURL('image/png');
}

/**
 * Draws a repeating diagonal watermark across the image.
 * Returns a new data URL with the watermark baked in.
 */
export async function applyWatermark(dataUrl: string): Promise<string> {
  const img = await loadImage(dataUrl);
  const { naturalWidth: w, naturalHeight: h } = img;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  // Semi-transparent white text
  const fontSize = Math.max(16, Math.round(Math.min(w, h) * 0.06));
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Rotate -30 degrees and tile across the image
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 6);

  const gap = fontSize * 4;
  const diagonal = Math.sqrt(w * w + h * h);
  const halfDiag = diagonal / 2;

  for (let y = -halfDiag; y < halfDiag; y += gap) {
    for (let x = -halfDiag; x < halfDiag; x += gap) {
      ctx.fillText(WATERMARK_TEXT, x, y);
    }
  }

  ctx.restore();

  return canvas.toDataURL('image/png');
}

/**
 * Applies free-tier processing: downscale to maxPx then watermark.
 */
export async function processForFreeTier(dataUrl: string, maxPx: number): Promise<string> {
  const downscaled = await downscaleImage(dataUrl, maxPx);
  return applyWatermark(downscaled);
}
