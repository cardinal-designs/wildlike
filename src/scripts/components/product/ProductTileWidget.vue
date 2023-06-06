<template lang="pug">
  a.product-tile.widget(
    :href='url'
    :id='id'
    tabindex='0'
    aria-live='polite'
  )
    div.product-tile__images
      div
        svg.product-tile__img-main.product-tile__img-main--placeholder(
          v-if='!loaded'
          viewBox="0 0 304 304"
          width="100%"
        )
          rect(x="0" y="0" width="100%" height="100%")
        img.product-tile__img-main(
          v-show="loaded"
          :src="imageCrop(imageSize(images.default, '304x304'), 'center')"
          :alt='images.defaultAlt'
          :srcset="`${imageCrop(imageSize(images.default, '168x168'), 'center')} 168w, ${imageCrop(imageSize(images.default, '304x304'), 'center')} 304w, ${imageCrop(imageSize(images.default, '456x456'), 'center')} 1.5x`"
          @load="function () { loaded = true; }"
        )
        img.product-tile__img-hover(
          :src="imageCrop(imageSize(images.hover, '304x304'), 'center')"
          :alt='images.hoverAlt'
          :srcset="`${imageCrop(imageSize(images.hover, '168x168'), 'center')} 168w, ${imageCrop(imageSize(images.hover, '304x304'), 'center')} 304w, ${imageCrop(imageSize(images.hover, '456x456'), 'center')} 1.5x`"
        )
    div.product-tile__static-text-content(:class="textAlignment")
      .row
        .col-12-sm.product-tile__title.color-black
          span.product-tile-title {{ staticProductTitle }}
      .row
        .product-tile__price-container(v-if="!product.hidePrice && !product.tags.includes('hiddenprice')")
          span.product-tile__price.strong-medium(:class="{[$store.state.comparePriceColor]: onSale}") {{ variant.price | moneyWithoutDecimals }}
          span.product-tile__compare-price.strong-medium(
            v-if='onSale'
          )
            span {{ variant.compare_at_price | moneyWithoutDecimals }}
</template>

<script>
  import ProductSwatchesSimple from './ProductSwatchesSimple.vue';
  import { imageSize, imageCrop, getProductImageAlt, getProductImageHover } from '../../helpers/util';
  import { withId } from '../../helpers/props';
  import uniqBy from 'lodash/uniqBy';

  /**
   * @typedef ImageSource
   * @type {Object}
   * @prop {String} default
   * @prop {String} defaultAlt
   * @prop {String} hover
   * @prop {String} hoverAlt
   *
   * @typedef Buttons
   * @type {Object}
   * @prop {Boolean} showOptions
   * @prop {Boolean} showAtc
   */

  export default {
    name: 'ProductTileWidget',
    data () {
      return {
        variant: this.selectedVariant || this.product.selected_or_first_available_variant,
        loaded: false,
      }
    },
    props: {
      product: Object,
      onAddToCart: Function, // if not provided, the atc will not show
      collectionHandle: String, // used for linking to pdp with proper collection
      textAlignment: String,
      truncateTitle: {
        type: Boolean,
        default: true
      },
      ...withId()
    },
    filters: {
      truncated(s) {
        if(s.length > 42)
          return `${s.substring(0, 42)}...`;
        return s;
      }
    },
    methods: {
      imageSize,
      imageCrop,
    },
    watch: {
      selectedVariant (n, o) {
        if(n.id !== o.id) {
          this.variant = n;
        }
      },
      product (n, o) {
        if (n.id !== o.id) {
          this.variant = n.selected_or_first_available_variant;
        }
      }
    },
    computed: {
      /** @returns {String} */
      url() {
        const urlParts = [];
        if(this.collectionHandle)
          urlParts.push(`/collections/${this.collectionHandle}`);

        urlParts.push(`/products/${this.product.handle}`);

        // only add variant if we're not the default
        if(this.product.variants.map(v => v.id)[0] !== this.variant.id)
          urlParts.push(`?variant=${this.variant.id}`);

        return urlParts.join('');
      },

      /** @returns {ImageSource} */
      images() {
        const defaultImage = /no-image/.test(this.variant.image.src) && this.product.images[0]
          ? this.product.images[0]
          : this.variant.image;
        const defaultImageAlt = defaultImage.alt;
        const nextImage = /no-image/.test(this.variant.image.src) ? (this.product.images[1] || this.product.images[0] || defaultImage) : this.variant.image;
        const altHoverImage = getProductImageHover(defaultImage);
        const altHoverImageAlt = altHoverImage ? altHoverImage.replace(/hover::.+?\s/, '') : nextImage.alt;

        return {
          default: defaultImage.src,
          defaultAlt: defaultImageAlt,
          hover: altHoverImage || nextImage.src,
          hoverAlt: altHoverImageAlt
        }
      },

      /** @returns {Array<Object>} */
      filteredVariants() {
        return this.product.variants.filter(v => v.title.toLowerCase() !== 'default title');
      },

      filteredColorVariants() {
        if(!this.hasColorVariants) return [];

        return uniqBy(this.product.variants, `option${this.colorIndex + 1}`);
      },

      /** @returns {Boolean} */
      onSale() {
        return this.variant.available && this.variant.compare_at_price && this.variant.price < this.variant.compare_at_price;
      },

      /** @returns {String} */
      staticProductTitle() {
        return this.truncateTitle ? this.$options.filters.truncated(this.product.title) : this.product.title
      }
    },
  }
</script>

<style scoped lang="scss">
  .product-tile {
    position: relative;
    background-color: $color-white;
    user-select: none;
    // box-shadow: 1px 2px 2px -1px rgba(0,0,0,0.08);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    color: inherit;
    cursor: pointer;
    @include mobile-tablet {
      box-shadow: none;
    }
    @include ie {
      display: block;
    }

    &:hover &__img-hover,
    &:focus &__img-hover {
      opacity: 1;
    }

    span:not(.button__content) {
      display: inline-block;
    }

    .row > * {
      margin-bottom: 8px;
    }

    .button-row {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0 8px;
      @include mobile-tablet {
        .button__content {
          font-size: 12px;;
        }
      }
    }

    &__price {
      padding-right: 8px;
    }

    &__compare-price {
      color: $color-grey;
    }

    @media screen and (max-width: 400px) {
      max-width: 100%;
    }

    &:focus {
      outline: none !important;
    }

    a {
      line-height: normal;
    }

    &__images {
      position: relative;
      font-size: 0;
      background-color: $color-white;
    }

    &__images a {
      font-size: 0;
    }

    &__img-hover {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      transition: opacity .2s linear;
    }

    &__img-main {
      z-index: 2;
      position: relative;
      transition: none;
      transition: opacity .2s linear;
    }

    &__img-hover {
      z-index: 5;
    }

    &__img-main--placeholder {
      width: 100%;
      height: 100%;
      z-index: 4;
      fill: $color-white;
    }

    &__img-main,
    &__img-hover {
      width: 100%;
      height: 100%;
      min-width: 100%;
      min-height: 100%;
      object-fit: cover;
    }

    &__static-text-content {
      background-color: $color-white;
      height: 180px;
      padding: 8px;
    }

    &__img-main--placeholder {
      width: 100%;
      height: 100%;
    }

    &__compare-price,
    &__compare-price s {
      @include product-tile-compare-price;
    }

    @media screen and (max-width: 400px) {
      .button {
        min-width: initial;

        .button__content {
          @include body-sm;
          letter-spacing: normal;
        }
      }
    }
  }
</style>
