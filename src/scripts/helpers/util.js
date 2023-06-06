import intersection from 'lodash/intersection';

export const debounce = (func, wait, immediate) => {
	var timeout

	return function() {
		var context = this, args = arguments
		var later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		}

		var callNow = immediate && !timeout

		clearTimeout(timeout)
		timeout = setTimeout(later, wait)

		if (callNow) func.apply(context, args)
	}
}

export const hash = (str) => {
  var hash = 0, i, chr

  if (str.length === 0) return hash

  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i)
    hash  = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }

  return hash
}

export const clone = (obj) => {
	return JSON.parse(JSON.stringify(obj))
}

/** 
  This handles a weird edge case caused by the theme editor.
  When customizing a theme, for some reason HTML comments are injected
  into templates, breaking the response data. This means we need to
  remove the comments and parse it back into JSON format, allowing for
  the data to load properly when the theme editor is open.

  @param data The response to check.
*/
export const parseDataForEditor = data => {
  if(typeof data === 'string') {
    let parsed = data.replace(/<!--[\s\S]*?-->/g, '')

    try {
      return JSON.parse(parsed)
    } catch (error) {
      console.error('Could not parse data:', data)
      return
    }
  }

  return data
}

/**
 * @desc get the shopify cdn file url from the file name. 
 * @param {String} filename 
 * @returns {String}
 */
export const fileUrl = filename => window.bvaccel.fileUrl.replace('test.jpg', `${filename}`);

/**
 * @desc modify a shopify cdn image url to return a specific size image.
 * @param {String} file 
 * @param {String} size 
 * @returns String
 */
export const imageSize = (file, size) => (file ? file.replace(/\.(png|jpg|jpeg|gif|webp)/, `_${size}.$1`) : '');

/**
 * @desc modify a shopify cdn image url to return a cropped version of the image
 * @param {String} file 
 * @param {String} size 
 * @returns String
 */
export const imageCrop = (file, position) => file.replace(/\.(png|jpg|jpeg|gif|webp)/, `_crop_${position}.$1`);

export const is3rdPartyProduct = (product) => {
  return product.thirdPartyATCURL && product.thirdPartyATCURL.length > 0;
};

export const isCallForPrice = (product) => {
  return product.tags.includes('Availability::call-for-price');
}

/**
 * Returns a badge if available
 * @prop {Object} product
 * @prop {Object} variant 
 * @returns {String} */
export const badge = (product, variant, onSale) => {
  let badge;
  if(!variant.available) {
    return;
  } else if(variant.inventory_quantity <= 0 && variant.inventory_policy === 'continue') {
    badge = 'preorder';
  } else if(onSale) {
    badge = 'sale';
  } else if(product.tags.some(t => t.toLowerCase() === 'new')) {
    badge = 'new';
  } else if(product.tags.some(t => t.toLowerCase() === 'wildiespick')) {
    badge = 'wildiespick';
  } else if(product.tags.some(t => t.toLowerCase() === 'goingfast')) {
    badge = 'goingfast';
  } 
  return badge;
}

/**
 * Returns a list of badges if available
 * @prop {Object} product
 * @prop {Object} variant 
 * @prop {Boolean} onSale 
 * @returns {String} */
export const badgeList = (product, variant, onSale) => {
  const availableBadges = ['new', 'wildiespick', 'goingfast'];
  const badges = intersection(availableBadges, product.tags.map(s => s.toLowerCase()));
  if (onSale) {
    badges.push('sale');
  }
  if (variant.inventory_quantity <= 0 && variant.inventory_policy === 'continue') {
    badges.push('preorder');
  }
  return badges;
};

/**
 * @typedef Truncate
 * @type {Function}
 * @param {String} str
 * @returns {String}
 */

/**
 * @param {Number} count 
 * @returns {Truncate}
 */
export const truncateEllipsis = (count) => (str) => {
  if(str && str.length > count)
    return `${str.substring(0, count)}...`;
  return str;
}

/**
 * @param {Object} [collection] 
 * @param {Object} product 
 * @param {Object} [variant] 
 * @returns {String}
 */
export const getProductUrl = (collection, product, variant) => {
  return `${collection ? `/collections/${collection.handle}` : ''}/products/${product.handle}?variant=${(variant || product.variants[0]).id}`
}

/**
 * @param {String} domain 
 * @param {Object} [collection] 
 * @param {Object} product
 * @param {Object} [variant]
 * @returns {Object}
 */
export const getProductSocialLinks = (domain = window.location.host, collection, product, variant) => {
  const url = window.encodeURIComponent(`https://${domain}/${getProductUrl(collection, product, variant)}`);
  let image = product.images[0] || {};
  let imageUrl = image.src;
  if(variant && variant.image) {
    if(!(/no-image/.test(variant.image.src)))
      image = variant.image;
    else
      image = product.images[0];
  }
  
  if(image && typeof image.src === 'string')
    imageUrl = image.src.replace(/^\/\//, 'https://');

  const encodedImageUrl = window.encodeURIComponent(imageUrl);
  return {
    facebook: `https://facebook.com/sharer/sharer.php?u=${url})}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${url}&media=${encodedImageUrl}&description=${window.encodeURIComponent(product.title)}`,
    email: `mailto:info@example.com?&subject=&body=${url}`
  }
}

export const generateId = () => Math.random().toString(16).substring(2);

export const getKitLineItemHeader = items => {
  switch (items.length) {
    case 2:
      return 'LUNCHBOX';
    default: 
      return 'LUNCHBOX KIT';
  }
}

/**
 * @typedef Prices
 * @type {Object}
 * @prop {Number} price
 * @prop {Number} [compare_at_price]
 * 
 * 
 * @param {*} variant 
 * @param  {...Prices} additionalVaraints 
 * @returns {Prices}
 */
export const sumVariantPrices = (variant, ...additionalVaraints) => {
  if(!variant) return;

  const prices = {
    price: variant.price,
    compare_at_price: variant.compare_at_price || 0
  }

  return additionalVaraints
    .filter(Boolean)
    .reduce((prices, variant) => {
      if(typeof variant.price === 'number')
        prices.price += variant.price;
      if(typeof variant.compare_at_price === 'number')
        prices.compare_at_price += variant.compare_at_price;
      return prices;
    }, prices);
}

export const isHiddenProduct = product => product.tags.some(tag => tag.toLowerCase().trim() === 'hide-product');

/**
 * 
 * @param {ShopifyMedia[]} productImages 
 * @param {String} option 
 * @param {String} optionValue 
 */
export const getVariantImages = (productImages, option, optionValue) => {
  // for product images
    // find images with that option
  const match = `${option.toLocaleLowerCase()}::${optionValue.toLocaleLowerCase()}`;
  return productImages
    .filter(productImage => typeof productImage.alt === 'string')
    .filter(productImage => {
      const optionTagArray = productImage.alt
        .split('|')[0]
        .split(',')
        .map((tag) => tag.toLowerCase().trim());

      return optionTagArray.includes(match);
    });
}

/**
 * 
 * @param {ShopifyMedia} productImage
 */
export const getProductImageAlt = (productImage) => {
  if (!productImage.alt) return '';
  const altArray = productImage.alt.split('|').map(alt => alt.trim());
  if (altArray.length > 1) {
    return altArray[1];
  }

  if (altArray[0].includes('::')) {
    return '';
  }

  return altArray[0];
}

/**
 * 
 * @param {ShopifyMedia} productImage
 */
export const getProductImageHover = (productImage) => {
  if (!productImage.alt) return null;

  const altArray = productImage.alt.split('|').map(alt => alt.trim());
  if (!altArray[0].includes('::')) return null;

  const hoverArray = altArray[0].split(',').filter(tag => tag.includes('hover::'));
  if (hoverArray.length <= 0) return null;

  return hoverArray[0].replace('hover::', '');
}

/**
 * A Shopify "no image" media object 
 * 
 * @returns {ShopifyMedia}
 */
export const noImageMedia = () => ({
  media_type: 'image', 
  src: '//cdn.shopify.com/s/assets/no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c.gif',
  preview_image: {
    src: '//cdn.shopify.com/s/assets/no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c.gif',
  }
});


export const overrideDataOnChange = function (name) {
  return function(newValue, oldValue) {
    if(newValue && newValue !== oldValue) 
      this[name] = newValue;
  }
}

export const tempATCDatalayer = (productDataArray) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'Add to Cart',
    products: [...productDataArray],
  });
}

export const stripHtml = str => str.replace(/(<([^>]+)>)/gim, '');

export const isColorClass = str => /^color-|^bg-|^fill-|^border-|^placeholder-/.test(str);

export const checkUndefined = (value, fallback) => {
  return typeof value !== 'undefined' ? value : fallback;
}

export const elementOrAncestorHasClass = (el, classList) => {
  if (!el || el.length === 0) {
    return false;
  }

  let parent = el;
  do {
    for (let i = 0; i < classList.length; i++) {
      const className = classList[i];

      if (parent.classList.contains(className)) {
        return true;
      }
    }
    parent = parent.parentNode;
  } while (parent !== document);
  return false;
};

export const swiperLoopInit = (swiper, slidesPerView) => {
  // Get array of non duplicate slides
  const nonDupSlides = [...swiper.slides].filter((el) => !el.matches('.swiper-slide-duplicate'));

  // loop: true and direction: 'vertical' adds 1 slide to the front and end of swiper
  //// subtract 1 from the activeIndex to get the realActiveIndex
  const realActiveIndex = swiper.params.direction === 'vertical' ? swiper.activeIndex - 1 : swiper.activeIndex - slidesPerView;

  // if active index exceeds last slide
  // if not enough slides to fill swiper
  // go to first slide
  if (realActiveIndex > nonDupSlides.length || slidesPerView > nonDupSlides.length) {
    swiper.slideToLoop(0);
  } else if ((realActiveIndex > nonDupSlides.length - slidesPerView)||(realActiveIndex < swiper.realIndex)) {
    // if active index exceeds last slide - slidesPerView
    // if active index is less than real index go to last slide
    //// only happens when swiper tries to go before first slide
    // go to last set of slides
    swiper.slideToLoop(nonDupSlides.length - slidesPerView);
  }
};

export const swiperLoopSlideChange = (swiper, slidesPerView, customSlideTo) => {
  // Get array of non duplicate slides
  const nonDupSlides = [...swiper.slides].filter((el) => !el.matches('.swiper-slide-duplicate'));
  // loop: true adds # of slides to equal slidesPerView to the front and end of swiper
  //// subtract the slidesPerView from the activeIndex to get the realActiveIndex
  const realActiveIndex = swiper.params.direction === 'vertical' ? swiper.activeIndex - 1 : swiper.activeIndex - slidesPerView;

  // if active index exceeds last slide go to first slide
  if (realActiveIndex > nonDupSlides.length - slidesPerView) {
    if (customSlideTo) {
      customSlideTo(0);
    } else {
      swiper.slideToLoop(0);
    }
  } else if (realActiveIndex < swiper.realIndex) {
    // if active index is less than real index go to last slide
    //// only happens when swiper tries to go before first slide
    if (customSlideTo) {
      customSlideTo(nonDupSlides.length - slidesPerView);
    } else {
      swiper.slideToLoop(nonDupSlides.length - slidesPerView);
    }
  }
};
