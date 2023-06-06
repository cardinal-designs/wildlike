<template lang="pug">
  section.pdp(:class="{ \
    'pb': magnetProduct, \
    'pdp--sidebar-active': settings.recommendationsSidebarCollection.length && customFields.d2_product_widget_enabled \
  }")
    product-breadcrumbs(:product="product" :collection="collection")
    //- product-form-top-mobile(v-bind="$props" v-model="variant" :prices="prices")
    .pdp__main
      div.pdp__main-width-container
        product-gallery(v-bind="$props" v-model="variant" :logo-badge="product.logoBadge ? product.logoBadge : undefined")
        .product-form-detail-container.side-padded-mobile
          product-form(v-bind="$props" v-model="variant" :selected-magnet-variant="selectedMagnetVariant" @selectedMagnetChange="val => selectedMagnetVariant = val" :prices="prices" :atc-cta-class="settings.atcCtaClass" :display-vendor="displayVendor")
          .rewards-message(v-if="product.tags.indexOf('rwds') > -1")
            .pdp-rewards.body-sm Earn {{ product.price.toString().slice(0, -2) }} Reward Points with this purchase.
            .body-sm(v-if="!customer") #[a(class="link link--secondary body-sm" href="/account/register") Sign up] or #[a(class="link link--secondary body-sm" href="/account/login") Login] to start earning.
          product-details.pdp__accordions(v-bind="$props" v-model="variant")
        product-recommendations-sidebar(
          v-if="settings.recommendationsSidebarCollection.length && customFields.d2_product_widget_enabled"
          :products="settings.recommendationsSidebarCollection"
          :product="product"
          :settings="settings"
        )
    product-value-props.pdp__value-props(
      v-if="!hideValueProps"
      :schema="{settings: transformedValuePropsSettings, blocks: settings.valueProps.blocks}"
    )
    .global-product-info-section(v-if="settings.upsellImg")
      .global-product-info-section__background(:style="{ 'background-image': `url(${settings.upsellImg})` }")
        h2.global-product-info-section__heading(:style="{'color': settings.upsellHeadingColor}") {{settings.upsellHeading}}
    .pdp__banner.pdp--side-padded-mobile(v-if="customFields.show_banner")
      about-image-banner-block(:block="bannerData")
    .pdp__tech-specs(v-if="customFields['show_5050']")
      product-tech-specs(v-bind="$props" :v-model="variant")
    //- .pdp__product-recs.pdp--side-padded-mobile(v-if="recommendedProducts.length")
    //-   product-recommendations(:products="recommendedProducts")
    .pdp__collections-linear
      super-collection-linear(:settings="featuredCollectionsSettings", :class="featuredCollectionsSettings.background")
</template>

<script>
import axios from 'axios';
import ProductGallery from './ProductGallery.vue';
import ProductFormTopMobile from './ProductFormTopMobile.vue';
import ProductForm from './ProductForm.vue';
import ProductDetails from './ProductDetails.vue';
import ProductBreadcrumbs from './ProductBreadcrumbs.vue';
import ProductTechSpecs from './ProductTechSpecs.vue';
import ProductReviews from './ProductReviews.vue';
import FeaturedCollection from '../../sections/FeaturedCollection.vue';
import AboutImageBannerBlock from '../../sections/AboutImageBannerBlock.vue';
import { isColorClass, sumVariantPrices, isHiddenProduct, imageSize } from '../../../helpers/util';
import { handleize } from '../../../filters/string';
import ProductRecommendationsSidebar from './ProductRecommendationsSidebar.vue';
import ProductRecommendations from './ProductRecommendations.vue';
import ProductValueProps from './ProductValueProps.vue';
import SuperCollectionLinear from '../../pages/SuperCollection/SuperCollectionLinear.vue';
import BazaarVoiceReviews from 'scripts/components/product/BazaarVoiceReviews.vue'
import prop from 'lodash/property';

export default {
  name: "BourdainProductDisplay",
  components: {
    ProductGallery,
    ProductFormTopMobile,
    ProductForm,
    ProductDetails,
    ProductBreadcrumbs,
    ProductTechSpecs,
    ProductReviews,
    ProductRecommendationsSidebar,
    ProductRecommendations,
    FeaturedCollection,
    AboutImageBannerBlock,
    ProductValueProps,
    SuperCollectionLinear,
    BazaarVoiceReviews
  },
  props: {
    jsonDesignerCollection: Object,
    collection: Object,
    product: Object,
    customFields: Object,
    customer: Boolean,
    settings: Object,
    magnetProduct: Object,
    globalLogoBadge: String,
    productTileTextAlignment: String,
    displayVendor: Boolean,
    swym: Object,
  },
  data() {
    return {
      variant: this.product.selected_or_first_available_variant ? this.product.variants.filter((variant) => variant.id === this.product.selected_or_first_available_variant.id)[0] : {},
      selectedMagnetVariant: null,
      recommendedProducts: this.settings.overrideRelatedProducts || [],
      reviewSource: window.bvaccel && window.bvaccel.reviewSource,
    }
  },
  mounted() {
    // if (this.recommendedProducts.length <= 0) {
    //   // get recommended products
    //   axios.get(`/recommendations/products?section_id=recommended-products--json&product_id=${this.product.id}&limit=8`, {withCredentials: true})
    //     .then((res) => {
    //       // get json from inside recommended-section div and parse it.
    //       if(res && res.data && res.data.length) {
    //         const temp = document.createElement('div');
    //         temp.innerHTML = res.data;
    //         const data = JSON.parse(temp.firstChild.innerText.trim());
    //         if(data.products instanceof Array)
    //           this.recommendedProducts = data.products
    //             .filter(prod => prod.available && !isHiddenProduct(prod))
    //       }
    //     })
    //     .catch((e) => console.error('error fetching recommended products', e.message));
    // }
  },
  computed: {
    /** convert metafield client readable colors to class names  */
    transformedValuePropsSettings () {
      const transforms = [
        {key: 'backgroundColor', prefix: 'bg'},
        {key: 'borderColor', prefix: 'border'},
        {key: 'dividerColor', prefix: 'bg'},
        {key: 'textColor', prefix: 'color'},
      ]
      const newValues = {};
      for(const tran of transforms) {
        const value = this.settings.valueProps.settings[tran.key];
        if(!isColorClass(value))
          newValues[tran.key] = tran.prefix + '-' + this.$store.state.metafieldColorMap[value];
      }

      return Object.assign(this.settings.valueProps.settings, newValues);
    },

    featuredCollectionsSettings () {
      return {
        heading: this.settings.featuredCollections.heading,
        headingColor: this.settings.featuredCollections.headingColor,
        backgroundColor: this.settings.featuredCollections.backgroundColor,
        linearArray: this.settings.featuredCollections.blocks
      }
    },
    prices() {
      const prices = sumVariantPrices(this.variant, this.selectedMagnetVariant);
      return prices;
    },
    hideValueProps() {
      return this.settings.valueProps.settings.hide || !this.settings.valueProps.blocks.slice(0, 2).every(prop('settings.icon'));
    },
    bannerData() {
      const textColor = /light/i.test(this.customFields.banner_text_color) ? 'color-white' : 'color-black';
      const overlayColor = /light/i.test(this.customFields.banner_overlay_color) ? 'bg-white' : 'bg-black';
      const overlayOpacity = this.customFields.banner_overlay_opacity ? Math.round((parseInt(this.customFields.banner_overlay_opacity))) : 0;// 1-9

      return {
        enableCta: false,
        ctaUrl: '',
        headingColor: textColor,
        heading: this.customFields.banner_header,
        subHeadingColor: textColor,
        subHeading: this.customFields.banner_subheading,
        copyColor: textColor,
        ctaLayout: null,
        ctaText: null,
        heading: this.customFields.banner_header,
        copy: this.customFields.banner_body_copy,
        overlayEnable: true,
        imageMobileEnable: true,
        overlayColor: overlayColor,
        overlayOpacity: overlayOpacity,
        mobileBgColor: 'bg-white',
        layoutVertical: 'middle',
        layoutHorizontal: 'center',
        imageMobile: this.customFields.banner_mobile_image || this.customFields.banner_desktop_image,
        image: this.customFields.banner_desktop_image
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .pdp {
    &__main {
      max-width: $container-max-width;
      margin: 0 auto;
      padding-bottom: 48px;
      @include desktop-up {
        padding-top: 24px;
      }
    }

    .section-padded {
      padding-top: 0;
    }

    .margin-bottom {
      margin-bottom: 20px;

      @include desktop-up {
        margin-bottom: 56px;
      }
    }

    &__main + * { // make sure the next section doesn't float up into the product form/gallery space
      clear: both;
    }

    &__main-width-container {
      margin: 0 auto;
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: center;

      @include mobile-only {
        flex-direction: column;
      }
    }

    &--flex-row {
      display: flex;
      justify-content: space-between;
    }

    &__sku {
      margin-right: 16px;
      color: $color-black-900;
      display: inline-block;
    }

    &__tech-specs{
      @include desktop-up {
        padding-left: $grid-gutter;
        padding-right: $grid-gutter;
      }
    }

    @include mobile-only {
      .hero-banner__content * {
        color: $color-black-900 !important;
      }
    }

    &__product-recs .container {
      padding: 0;
    }

    // Footer overrides
    /deep/ .footer-value-props-container,
    /deep/ .footer-value-props-container .footer-value-prop {
      border: none !important;
    }

    /deep/ .footer-value-prop__title {
      @include h6-tablet;
    }

    /deep/ .footer-value-prop__icon {
      max-width: 100px;
    }

    /deep/ .footer-value-prop__text {
      @include mobile-only {
        margin-bottom: 0;
      }
    }

    /deep/ .footer-value-prop__pagination .swiper-pagination-bullet:not(.swiper-pagination-bullet-active) {
      background: $color-grey;
    }

    /deep/ .footer-value-prop-heading {
      margin-bottom: 24px;
      @include h3-mobile;

      @include desktop-up {
        @include h4-tablet;
        margin-bottom: 48px;
      }
    }
  }


  .pdp {

    /deep/ .super-collection-linear__tile {
      max-width: 200px;
    }

    /deep/ .swiper-pagination-bullet.swiper-pagination-bullet-active {
      color: $color-primary-500;
    }

    @include mobile-only {
      padding-bottom: 24px;
    }

    &--wrapper {
      @include mobile-only {
        padding-bottom: 24px;
      }
    }

    .hero__background {
      @include mobile-only {
        display: none;
      }

      bottom: 120px;
    }

    & > .container {
      margin-top: 24px;

      @include desktop-up {
        padding: 56px $grid-gutter;
      }
    }

    @include mobile-only {
      &--side-padded-mobile {
        margin-left: 10px;
        margin-right: 10px;
        width: calc(100% - 20px);
      }
    }

    @include desktop-up {
      &__main {
        font-size: 0;
      }

      /deep/ .super-collection-linear__heading {
        margin-bottom: 40px;
      }

      &__accordions {
        width: 472px;
        @include mobile-only {
          margin-top: 24px;
        }
      }

      &__sticky-container {
        position: relative;
      }
    }

    // @include desktop-up {
    //   &__product-recs .controls-container {
    //     display: none !important;
    //   }
    // }
  }

  .product-form-detail-container {
    display: flex;
    flex-direction: column;
  }

  .pdp-rewards {
    margin: 0 0 24px 0;

    @include tablet-up {
      margin: 12px 0 0 0;
    }
  }

  .global-product-info-section {
    width: 100%;

    &__background {
      width: 100%;
      height: 200px;
      min-height: 544px;
      background-size: cover;
      background-position: center;
      align-items: center;
      display: flex;
      @include mobile-only {
        max-height: 394px;
      }
    }
    &__heading {
      margin: 0 auto;
      max-width: 850px;
      font-size: 48px;
      text-align: center;
      line-height: 48px;
    }
  }
</style>
