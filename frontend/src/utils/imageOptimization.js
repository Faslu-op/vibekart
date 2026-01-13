/**
 * Optimizes Cloudinary image URLs for better performance
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const optimizeCloudinaryImage = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width = 800,
    quality = 'auto',
    format = 'auto',
    crop = 'limit'
  } = options;

  // Find the upload section in the URL
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  // Build transformation string
  // f_auto = automatic format selection (WebP, AVIF when supported)
  // q_auto = automatic quality optimization
  // w_X = width limit
  // c_limit = don't upscale, only limit max dimensions
  const transformations = `w_${width},q_${quality},f_${format},c_${crop}`;

  // Insert transformations after /upload/
  const optimizedUrl = url.slice(0, uploadIndex + 8) + transformations + '/' + url.slice(uploadIndex + 8);

  return optimizedUrl;
};

/**
 * Generate a low-quality placeholder for blur-up effect
 * @param {string} url - Original Cloudinary URL
 * @returns {string} - Tiny placeholder URL
 */
export const getImagePlaceholder = (url) => {
  return optimizeCloudinaryImage(url, {
    width: 40,
    quality: 30,
    format: 'auto',
    crop: 'limit'
  });
};
