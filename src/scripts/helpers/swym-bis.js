// BackInStockProduct human readable aliases
export const PRODUCT_ID = 'empi',
             VARIANT_ID = 'epi',
             IMAGE_URL = 'iu',
             PRICE = 'pr';

/**
 * @typedef {Object} SwymBIPProduct
 * @prop {String} iu image url
 * @prop {Number|String} epi variant id
 * @prop {Number|String} empi product id
 * @prop {Number} pr product price
 */

export class SwymBIPProduct {
  /**
   * @constructor 
   * @param {Object} product 
   * @param {Object} variant 
   */
  constructor(product, variant) {
    this[PRODUCT_ID] = product.id;
    this[VARIANT_ID] = variant.id;
    this[IMAGE_URL] = product.images[0];
    this[PRICE] = variant.price / 100;
  }
}


export class SwymBIS {
  constructor(product, swymSettings) {
    this._product = product;
    this._variants = product.variants;
    this._settings = swymSettings;

    this._init();
  }

  /** set initial state */
  _init () {
    if(!window._swat) {
      (function (s, w, r, e, l, a, y) {
        r['SwymRetailerConfig'] = s;
        r[s] = r[s] || function (k, v) {
        r[s][k] = v;
        };
      })('_swrc', '', window);
      _swrc('RetailerId', this._settings.pid);
    }else if(window._swat.postLoader){
        _swrc = window._swat.postLoader;
        _swrc('RetailerId', this._settings.pid);
    }
  }

  /** subscribe to the alert */
  subscribe (email, variant, callback) {
    if( !this.validateEmail(email) ) {
        callback('Invalid Email')
    } else {
      const prod_settings = new SwymBIPProduct(this._product, variant);
      window._swat.sendWatchlist(
        email,
        "email",
        prod_settings,
        function(r) {
          callback(null, r);
        },
        function(e) {
          callback(e);
        },
        1
      );
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}