/**
 * @typedef {Object} ShopifyMediaSource
 * @prop {String} format
 * @prop {String} mime_type
 * @prop {String} url
 * @prop {Number} height
 * @prop {Number} width
 */

/**
 * @typedef {Object} ShopifyMediaPreview
 * @prop {Number} aspect_ratio
 * @prop {Number} height
 * @prop {Number} width
 * @prop {String} src
 */

/**
 * @typedef {Object} ShopifyMedia
 * @prop {('image'|'video')} media_type
 * @prop {String} [alt]
 * @prop {String} [src]
 * @prop {Number} id
 * @prop {Number} position
 * @prop {Number} aspect_ratio
 * @prop {Number} height
 * @prop {Number} width
 * @prop {ShopifyMediaPreview} preview_image
 * @prop {ShopifyMediaSource[]} [sources]
 */
