/**
 * PUST Alumni Network Media Storage Adapter
 * Secure abstraction supporting:
 * 1. Base64 data URLs / Local static assets (built-in default)
 * 2. Cloudinary / S3 configurable adapter
 */

const MAX_IMAGE_SIZE = 12 * 1024 * 1024; // 12 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

function validateMedia(payload = {}) {
  const { mediaType = 'photo', url, data } = payload;
  const content = data || url;

  if (!content) {
    return { ok: false, message: 'Media content or file URL is required' };
  }

  // If it's a data URL, check MIME type and byte size
  if (typeof content === 'string' && content.startsWith('data:')) {
    const mimeMatch = content.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (!mimeMatch) {
      return { ok: false, message: 'Invalid media encoding format' };
    }
    const mime = mimeMatch[1].toLowerCase();

    // Size calculation from base64 string
    const stringLength = content.length - mimeMatch[0].length;
    const approximateByteLength = Math.ceil((stringLength * 3) / 4);

    if (mediaType === 'video' || ALLOWED_VIDEO_TYPES.includes(mime)) {
      if (!ALLOWED_VIDEO_TYPES.includes(mime)) {
        return { ok: false, message: `Unsupported video type: ${mime}. Allowed: MP4, WebM.` };
      }
      if (approximateByteLength > MAX_VIDEO_SIZE) {
        return { ok: false, message: `Video exceeds maximum limit of 50MB.` };
      }
    } else {
      if (!ALLOWED_IMAGE_TYPES.includes(mime)) {
        return { ok: false, message: `Unsupported image type: ${mime}. Allowed: JPEG, PNG, WebP, GIF.` };
      }
      if (approximateByteLength > MAX_IMAGE_SIZE) {
        return { ok: false, message: `Image exceeds maximum limit of 12MB.` };
      }
    }
  }

  return { ok: true };
}

async function uploadMedia(payload) {
  const validation = validateMedia(payload);
  if (!validation.ok) {
    throw new Error(validation.message);
  }

  return {
    url: payload.url,
    thumb: payload.thumb || payload.url,
    storageKey: `pust_media_${Date.now()}`,
  };
}

module.exports = {
  validateMedia,
  uploadMedia,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
};
