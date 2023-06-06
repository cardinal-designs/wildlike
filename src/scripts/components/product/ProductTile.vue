<template lang="pug">
  a.product-tile.link-text(
    :href='product.url'
    :id='id'
    tabindex='0'
    aria-live='polite'
    @click="onClickTile"
  )
    div.product-tile__images
      //- Product Badge
      .product-tile__badge-container(v-if="!hideBadges")
        span.product-tile__badge.badge(
          :class='$store.state.badgeColorMap[productBadge]'
          v-if='productBadge'
        )
      //- Product image
      div
        svg.product-tile__img-main.product-tile__img-main--placeholder(
          v-if='!loaded'
          viewBox="0 0 520 690"
          width="100%"
        )
          rect(x="0" y="0" width="100%" height="100%")
        img.product-tile__img-main(
          v-show="loaded"
          :src="imageCrop(imageSize(images.default, '520x690'), 'center')"
          :alt='images.defaultAlt'
          :srcset="`${imageCrop(imageSize(images.default, '260x345'), 'center')} 168w, ${imageCrop(imageSize(images.default, '520x690'), 'center')} 304w, ${imageCrop(imageSize(images.default, '260x345'), 'center')} 1.5x, ${imageCrop(imageSize(images.default, '520x690'), 'center')} 2x`"
          @load="function () { loaded = true; }"
        )
        img.product-tile__img-hover(
          :src="imageCrop(imageSize(images.hover, '520x690'), 'center')"
          :alt='images.hoverAlt'
          :srcset="`${imageCrop(imageSize(images.hover, '260x345'), 'center')} 168w, ${imageCrop(imageSize(images.hover, '520x690'), 'center')} 304w, ${imageCrop(imageSize(images.hover, '260x345'), 'center')} 1.5x, ${imageCrop(imageSize(images.hover, '520x690'), 'center')} 2x`"
        )
    div.product-tile__static-text-content
      .row
        .product-tile__vendor {{ product.vendor }}
      .row
        .product-tile__title
          .product-tile-title {{ staticProductTitle }}
      .row
        .product-tile__price-container
          span.product-tile__price.product-tile__compare-price-new(v-if="onSale && !isCallForPrice(product)")  #[span.visually-hidden Now: ]{{ variant.price | moneyWithoutDecimals }}
          span.product-tile__price(v-else-if="!isCallForPrice(product)") {{ variant.price | moneyWithoutDecimals }}
          span.product-tile__price(v-else)  #[span.visually-hidden Now: ]Call For Price
          span.product-tile__compare-price(v-if='onSale && !isCallForPrice(product)')
            span.product-tile__price #[span.visually-hidden Was: ]{{ variant.compare_at_price | moneyWithoutDecimals }}
</template>

<script>
  import { imageSize, imageCrop, badge, is3rdPartyProduct, getProductImageAlt, getProductImageHover, isCallForPrice } from '../../helpers/util';
  import { withId } from '../../helpers/props';

  /**
   * @typedef ImageSource
   * @type {Object}
   * @prop {String} default
   * @prop {String} defaultAlt
   * @prop {String} hover
   * @prop {String} hoverAlt
   */

  export default {
    name: 'ProductTile',
    data () {
      const state = {
        variant: this.selectedVariant || this.product.selected_or_first_available_variant || this.variants[0],
        loaded: false,
      }
      return state;
    },
    props: {
      product: Object,
      selectedVariant: Object,
      onAddToCart: Function, // if not provided, the atc will not show
      collectionHandle: String, // used for linking to pdp with proper collection
      hideBadges: Boolean,
      onClickProduct: {
        type: Function
      },
      truncateTitle: {
        type: Boolean,
        default: true
      },
      ...withId()
    },
    methods: {
      imageSize,
      imageCrop,
      is3rdPartyProduct,
      isCallForPrice,
      truncate(title) {
        if (this.$mq === 'mobile') {
          if(title.length > 72)
            return `${title.substring(0, 72)}...`;
        }
        if (this.$mq !== 'mobile') {
          if(title.length > 72)
            return `${title.substring(0, 72)}...`;
        }
        return title;
      },
      onClickTile() {
        if (this.onClickProduct) {
          this.onClickProduct(this.product.handle);
        }
      }
    },
    watch: {
      selectedVariant (n, o) {
        if(n.id !== o.id) {
          this.variant = n;
        }
      }
    },
    computed: {
      selectOptionsVerbiage () {
        const { available } = this.variant;
        return available ? 'More Options' : 'Out of Stock';
      },

      /** @returns {String} */
      url() {
        const urlParts = [];
        if(this.collectionHandle)
          urlParts.push(`/collections/${this.collectionHandle}`);

        urlParts.push(`/products/${this.product.handle}`);

        // only add variant if we're not the default
        if(this.product.variants && this.product.variants.map(v => v.id)[0] !== this.variant.id)
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

      /** @returns {Boolean} */
      onSale() {
        return this.variant && this.variant.available && this.variant.compare_at_price && this.variant.price < this.variant.compare_at_price;
      },

      /** @returns {String} */
      productBadge() {
        return badge(this.product, this.variant, this.onSale);
      },

      /** @returns {Boolean} */
      hasLogoBadge() {
        return this.product.logoBadge && this.product.logoBadge.length
      },

      /** @returns {String} */
      staticProductTitle() {
        return this.truncateTitle ? this.truncate(this.product.title) : this.product.title
      }
    },
  }
</script>

<style scoped lang="scss">
  .product-tile {
    position: relative;
    background-color: $color-white;
    user-select: none;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    &-title {
      font-weight: 600;
    }

    @include mobile-tablet {
      box-shadow: none;
      border-radius: 0;
      border-top: none;
      border-left: none;
    }

    &:hover {
      cursor: pointer;
    }

    &:hover &__img-hover,
    &:focus &__img-hover {
      @include desktop-up {
        opacity: 1;
      }
    }

    span:not(.button__content) {
      display: inline-block;
    }

    .row > * {
      margin-bottom: 2px;

      @include mobile-only {
        margin-bottom: 4px;
      }
    }

    &__price {
      font-family: $font-family-secondary;
      font-weight: 600;
      font-size: rem(14);
      line-height: 24px;
      margin-right: 4px;
    }

    &__price-container {
      span, s {
        font-size: rem(14);
        font-weight: 600;
        line-height: rem(24);
      }
    }

    &__compare-price {
      span {
        text-decoration: line-through;
      }
    }

    &__promo-message {
      @include body-sm;

      color: $color-accent-3-200;
    }

    &__badge-container {
      position: absolute;
      bottom: 0px;
      left: 0px;
      height: 100px;
      width: 100px;
      display: flex;
      z-index: 6;
      .badge {
        background-repeat: no-repeat;
        background-size: auto;
        height: 100px;
        width: 100px;
        @include mobile-only {
          height: 75px;
          width: 75px;
          bottom: -6px;
          left: -8px;
        }
        &.badge-bg-sale {
          background-image: url('https://cdn.shopify.com/s/files/1/0559/6456/5658/files/Wildlike-Badge-SALE.svg?v=1637586954');
        }
        &.badge-bg-new {
          background-image: url('https://cdn.shopify.com/s/files/1/0559/6456/5658/files/Wildlike-Badge-NEW.svg?v=1637586954');
        }
        &.badge-bg-wildiespick {
          background-image: url('https://cdn.shopify.com/s/files/1/0559/6456/5658/files/Wildlike-Badge-WILDIES-PICK.svg?v=1637586954');
        }
        &.badge-bg-preorder {
          background-image: url('https://cdn.shopify.com/s/files/1/0559/6456/5658/files/Wildlike-Badge-PRE-ORDER-NOW.svg?v=1637586954');
        }
        &.badge-bg-goingfast{
          background-image: url('https://cdn.shopify.com/s/files/1/0559/6456/5658/files/Wildlike-Badge-GOING-FAST.svg?v=1637586954');
        }
      }
      @include mobile-only {
        bottom: 0px;
        left: 0px;
      }
    }

    &__logo-badge {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 0;
      border-top: 1px solid #DFE0E1;
      border-bottom: 1px solid #DFE0E1;
      width: 100%;
      img {
        width: auto;
        height: 24px;
      }
      @include mobile-only {
        img {
          height: 20px;
        }
      }
      @media screen and (max-width: 320px) {
        img {
          height: 18px;
        }
      }
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

    &__vendor {
      font-weight: 900;
      font-size: rem(16);
      line-height: 24px;
      margin-bottom: 2px;
      text-transform: uppercase;
      font-style: italic;
      font-family: $font-family-primary;
      font-weight: 900;
    }

    &__static-text-content {
      background-color: $color-white;
      padding: 8px 0px;

      &__title {
        font-size: rem(14);
        font-weight: 600;
        line-height: 20px;
      }
    }

    &__overflow {
      position: absolute;
      bottom: 0;
      opacity: 0;
      pointer-events: none;
      width: 100%;
      .button-wrapper {
        padding: 8px;
      }
      .button {
        margin: 0;
      }
    }

    &__overflow-mobile {
      margin-top: auto;
      height: 60px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
      .button-wrapper {
        width: 100%;
      }
    }

    &:hover {
      .product-tile__overflow {
        opacity: 1;
        pointer-events: auto;
        z-index: 5;
      }
    }

    /deep/.spr-badge-starrating {
      padding: 0;
      margin-top: -2px;
    }

    /deep/ .spr-badge {
      display: flex;
      margin-bottom: 8px;
      align-items: center;
      height: 20px;
    }

    /deep/ .spr-badge-caption {
      margin-top: 4px;
      @include mobile-tablet {
        margin-top: 2px;
      }
    }

    /deep/ .bv-reviews-container {
      display: block !important;
    }

    /deep/ .bv_main_container {
      margin-bottom: 8px !important;
    }

    &__img-main--placeholder {
      width: 100%;
      height: 100%;
    }

    &__description {
      color: $color-black-900;

      @include body-sm;
      line-height: rem(16);
      letter-spacing: normal;
    }

    &__compare-price,
    &__compare-price s {
      @include product-tile-compare-price;

      &-new {
        @include product-tile-compare-price-new;
      }
    }
    .button {
      .button__content {
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
        line-height: 20px;
        text-align: center;
      }
    }
    @media screen and (max-width: 400px) {
      .button {
        min-width: initial;
      }
    }
  }
</style>
