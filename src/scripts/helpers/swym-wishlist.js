import prop from 'lodash/property';

// WishlistProduct human readable aliases
export const PRODUCT_ID = 'empi',
             VARIANT_ID = 'epi',
             IMAGE_URL = 'iu',
             PRICE = 'pr',
             PRODUCT_TITLE = 'dt',
             COMPARE_PRICE = 'op',
             QUANTITY = 'stk',
             PRODUCT_TYPE = 'ct',
             VARIANT_URL = 'du';

/**
 * @typedef {Object} WishlistProduct
 * @prop {String} du product url
 * @prop {String} iu image url
 * @prop {Number|String} epi variant id
 * @prop {Number|String} empi product id
 * @prop {Number} pr 
 * @prop {Object} [cprops]
 * @prop {String[]} [hashtags]
 */

export class SwymWishlistProduct {
  /**
   * @constructor 
   * @param {Object} product 
   * @param {Object} variant 
   */
  constructor(product, variant) {
    this[PRODUCT_ID] = product.id;
    this[VARIANT_ID] = variant.id;
    this[IMAGE_URL] = (variant.image || variant.image.src.indexOf('no-image') ? product.images[0] : variant.image).src;
    this[PRICE] = variant.price / 100;
    this[PRODUCT_TITLE] = product.title;
    this[QUANTITY] = variant.remaining_quantity;
    this[PRODUCT_TYPE] = product.type;
    this[VARIANT_URL] = window.location.protocol + '//' + window.location.host + product.url;
    if(variant.compare_at_price)
      this[COMPARE_PRICE] = variant.compare_at_price / 100;
  }
}


export class SwymWishlist {
  constructor(product) {
    this._product = product;
    this._variants = product.variants;
    this.state = new Set();

    if(!window.SwymCallbacks) { // swym is not loaded yet
      window.SwymCallbacks = [];
    }

    if(window._swat && window._swat.fetch) { // swym loaded, get initial state
      this._init();
    } else {
      window.SwymCallbacks.push(this._init.bind(this)); // get state when swym is ready
    }
  }

  /** set initial wishlist state */
  _init () {
    window._swat.fetch(items => {
      this.state = new Set(items.map(prop(VARIANT_ID)));
    });
  }

  /** Add a variant to the wishlist
   * 
   * @param {String|Number} variantId 
   * @returns {Promise}
   */
  add(variantId) {
    return new Promise((res, rej) => {
      const [ variant ] = this._variants.filter(v => v.id === variantId);
      const swymProduct = new SwymWishlistProduct(this._product, variant);
      
      window._swat.addToWishList(swymProduct, (response) => {
        this.state.add(variantId);
        this.state = new Set(this.state); // create a new set to allow vue & react to detect the change;
        res(response);
      });
    });
  }

  /** Remove a variant from the wishlist
   * 
   * @param {String|Number} variantId 
   * @returns {Promise}
   */
  remove(variantId) {
    return new Promise((res, rej) => {
      const [ variant ] = this._variants.filter(v => v.id === variantId);
      const swymProduct = new SwymWishlistProduct(this._product, variant);
      
      window._swat.removeFromWishList(swymProduct, (response) => {
        this.state.delete(variantId);
        this.state = new Set(this.state); // create a new set to allow vue & react to detect the change;
        res(response);
      });
    });
  }

  /** Toggle an variants presence in the wishlist
   * 
   * @param {String|Number} variantId 
   * @returns {Promise}
   */
  toggle(variantId) {
    if(this.state.has(variantId))
      return this.remove(variantId);
    else
      return this.add(variantId);
  }

  /** Check if the given variant ID is saved
   * 
   * @param {String|Number} variantId 
   * @returns {Boolean}
   */
  includes(variantId) {
    return this.state.has(variantId);
  }
}