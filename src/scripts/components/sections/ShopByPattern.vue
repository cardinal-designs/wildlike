<template lang="pug">
  .shop-by-pattern(:class="schema.settings.backgroundColor" :style="{'padding-top': `${schema.settings.marginTop}px`, 'padding-bottom': `${schema.settings.marginBottom}px`}")
    .container
      .shop-by-pattern__header
        .shop-by-pattern__title.h3(:class="schema.settings.titleColor") {{schema.settings.title}}
        .shop-by-pattern_desc.body-sm-mobile.body-lg-tablet-up(:class="schema.settings.descriptionColor") {{schema.settings.description}}
      .shop-by-pattern__collection-list
        .shop-by-pattern__collection-container(v-for="(block, index) in validCollectionBlocks" :key="block.id" :class="{'shop-by-pattern__collection-container--selected': currentIndex === index }")
          .shop-by-pattern__collection(:style="{'background-image': `url(${block.settings.collection_image})`}" @click="setCurrentIndex(index)")
            .shop-by-pattern__collection-overlay(:class="block.settings.overlay_color" :style="{'opacity': block.settings.overlay_opacity/100}")
            .shop-by-pattern__collection-content
              .shop-by-pattern__collection-title.h2-mobile.h4-tablet-up(:class="schema.settings.collectionTitleColor") {{block.settings.collection_title}}
              a.shop-by-pattern__collection-button(:class="schema.settings.ctaStyle" :href="`/collections/${block.settings.collection_handle}`")
                span.button__content Shop All
          .shop-by-pattern__collection-tooltip-container
            .shop-by-pattern__collection-tooltip-border(:class="[schema.settings.productBorderColor]")
            .shop-by-pattern__collection-tooltip(:class="[schema.settings.productBackgroundColor.replace('bg','border')]")
      swiper.shop-by-pattern__collection-list.shop-by-pattern__collection-list--mobile(:options="swiperOptions" ref="patternSwiper")
        swiperSlide.shop-by-pattern__collection(v-for="block in validCollectionBlocks" :key="block.id" :style="{'background-image': `url(${block.settings.collection_image})`}" :data-collection="block.settings.collection_handle")
          .shop-by-pattern__collection-overlay(:class="block.settings.overlay_color" :style="{'opacity': block.settings.overlay_opacity/100}")
          .shop-by-pattern__collection-content
            .shop-by-pattern__collection-title.h2-mobile.h4-tablet-up(:class="schema.settings.collectionTitleColor") {{block.settings.collection_title}}
            a.shop-by-pattern__collection-button(:class="schema.settings.ctaStyle" :href="`/collections/${block.settings.collection_handle}`")
              span.button__content Shop All
      .shop-by-pattern__product-container(:class="[schema.settings.productBackgroundColor, schema.settings.productBorderColor]")
        .shop-by-pattern__collection-tooltip-container.shop-by-pattern__collection-tooltip-container--mobile
          .shop-by-pattern__collection-tooltip-border(:class="[schema.settings.productBorderColor]")
          .shop-by-pattern__collection-tooltip(:class="[schema.settings.productBackgroundColor.replace('bg','border')]")
        fade-transition(:duration="{enter: 600, leave: 200}")
          .shop-by-pattern__product-list(v-if="!isLoading" :key="currentIndex")
            product-tile(v-for="(product, index) in productListByView" :key="product.id" :widget="true" :product="{ ...product, options: [], variants: [] }")
        fade-transition(:duration="{enter: 600, leave: 200}")
          .shop-by-pattern__product-list.shop-by-pattern__product-list--loading(v-if="isLoading")
            product-tile-skeleton(v-for="tile in productCount[$mq]" :key="tile")
</template>

<script>
import axios from 'axios';
import {FadeTransition} from 'vue2-transitions'
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import ProductTile from 'scripts/components/product/ProductTile.vue'
import ProductTileSkeleton from 'scripts/components/product/ProductTileSkeleton.vue'

export default {
  name: "ShopByPattern",
  components: {
    FadeTransition,
    swiper, 
    swiperSlide,
    ProductTile,
    ProductTileSkeleton,
  },
  data() {
    return {
      productList: [],
      currentIndex: 0,
      isLoading: false,
      swiperOptions: {
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        threshold: 5,
        slideToClickedSlide: true,
        spaceBetween: 0,
        breakpoints: {
          767: {
            spaceBetween: -12,
          },
        },
      },
      productCount: {
        'mobile': 2,
        'tablet': 4,
        'desktop': 4,
        'hd': 4,
      },
      collectionCache: {},
    }
  },
  props: {
    schema : {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    setProductLists(handle) {
      if (this.collectionCache[handle]) {
        this.productList = this.collectionCache[handle];
      } else {
        axios.get(`/collections/${handle}?view=json`, {withCredentials: true})
          .then((res) => {
            if (res && res.data && res.data.products) {
              this.productList = res.data.products.slice(0, this.productCount.hd);
              this.isLoading = false;
              this.collectionCache[handle] = this.productList;
            }
          })
          .catch((e) => console.error('error fetching shop by pattern products', e.message));
        this.isLoading = true;
      }
    },
    setCurrentIndex(index) {
      this.currentIndex = index;
    },
  },
  computed: {
    validCollectionBlocks() {
      return this.schema.blocks.filter((block) => block.settings.collection_handle);
    },
    productListByView() {
      return this.productList.slice(0, this.productCount[this.$mq]);
    }
  },
  watch: {
    currentIndex(index) {
      this.setProductLists(this.schema.blocks[index].settings.collection_handle);
      if (this.$mq !== 'mobile') {
        this.$refs.patternSwiper.swiper.slideToLoop(index, 0, false);
      }
    }
  },
  mounted() {
    const initialCollection = Math.floor(this.schema.blocks.length / 2);
    const patternSwiper = this.$refs.patternSwiper.swiper;

    this.setCurrentIndex(initialCollection);
    patternSwiper.on('slideChangeTransitionStart', () => {
      this.setCurrentIndex(patternSwiper.realIndex);
    });
  }
}
</script>

<style scoped lang="scss">
  @mixin pattern-tooltip-border {
    position: absolute;
    left: 0;
    z-index: 1;
    height: 12px;
    border-right: 12px solid transparent !important;
    border-bottom: 12px solid;
    border-left: 12px solid transparent !important;
  }
  @mixin pattern-tooltip {
    position: absolute;
    left: 0;
    z-index: 2;
    height: 12px;
    border-right: 12px solid transparent !important;
    border-bottom: 12px solid;
    border-left: 12px solid transparent !important;
  }

  .shop-by-pattern {
    overflow: hidden;

    &__header {
      text-align: center;
    }

    &__title {
      margin-bottom: 16px;
    }

    &_desc {
      margin-bottom: 24px;

      @include tablet-up {
        margin-bottom: 36px;
      }
    }

    &__collection-list {
      display: none;
      margin-bottom: 32px;
      height: 384px;

      @include desktop-up {
        display: flex;
        height: 432px;
        align-items: center;
      }
    }

    &__collection-list--mobile {
      display: flex;
      margin: 0 -16px 28px;

      @include tablet-up {
        margin-right: -20px;
        margin-left: -20px;
      }
      @include desktop-up {
        display: none;
      }

      .swiper-wrapper {
        padding-bottom: 4px;
        align-items: center;
      }
    }

    &__collection-container {
      position: relative;
      margin: 0 4px;
      padding-top: 32px;
      height: 100%;
      flex-basis: 100%;
      transition: flex-basis 300ms ease-in-out, padding 300ms ease-in-out;

      @include hd-up {
        margin: 0 16px;
      }

      &--selected {
        padding-top: 0;
        flex-basis: 133%;
      }
    }

    &__collection {
      width: 100%;
      height: 384px;
      position: relative;
      background-position: center center;
      background-size: cover;
      border-radius: $border-radius;
      overflow: hidden;
      box-shadow: $drop-shadow--light;
      transform: scale(0.75);
      transition: box-shadow 300ms ease-in-out, max-width 300ms ease-in-out, height 300ms ease-in-out, transform 300ms ease-in-out;
      cursor: pointer;

      @include desktop-up {
        height: 332px;
        transform: scale(1);
      }

      &:nth-child(1) {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        box-shadow: $drop-shadow;
      }

      &.swiper-slide {
        max-width: 284px;
      }

      &.swiper-slide-active {
        transform: scale(1);
        box-shadow: $drop-shadow;
      }

      .shop-by-pattern__collection-container--selected & {
        @include desktop-up {
          height: 432px;
        }
      }
    }

    &__collection-overlay {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
    }

    &__collection-content {
      position: absolute;
      top: 50%;
      left: 0;
      z-index: 2;
      width: 100%;
      text-align: center;
      transform: translateY(calc(-50% + 44px));
      transition: transform 300ms ease-in-out;

      .shop-by-pattern__collection-container--selected &,
      .swiper-slide-active & {
        transform: translateY(-50%);
      }
    }

    &__collection-title {
      margin-bottom: 16px;
      font-family: $font-family-primary;
      font-size: 25px;
      letter-spacing: 0px;
    }

    &__collection-button {
      opacity: 0;
      visibility: hidden;
      transition: opacity 300ms ease-in-out, visibility 300ms ease-in-out;

      .button__content {
        font-size: 1rem;
      }

      .shop-by-pattern__collection-container--selected &,
      .swiper-slide-active & {
        opacity: 1;
        visibility: visible;
      }
    }

    &__collection-tooltip-container {
      display: none;
      position: absolute;
      bottom: -33px;
      left: 50%;
      z-index: 1;
      width: 24px;
      height: 12px;
      transform: translateX(-50%);

      .shop-by-pattern__collection-container--selected & {
        @include desktop-up {
          display: block;
        }
      }
    }

    &__collection-tooltip-container--mobile {
      display: block;
      bottom: auto;
      top: -12px;

      @include desktop-up {
        display: none;
      }
    }

    &__collection-tooltip-border {
      @include pattern-tooltip-border;
      bottom: 0;
    }

    &__collection-tooltip {
      @include pattern-tooltip;
      content: '';
      bottom: -1px;
    }

    &__product-container {
      position: relative;
      padding: 12px 12px 24px;
      text-align: center;
      border: 1px solid;
      border-radius: $border-radius;

      @include tablet-up {
        padding: 24px;
      }
    }

    &__product-list {
      display: inline-flex;
      justify-content: center;

      &.fadeOut {
        position: absolute;
        top: 50%;
        left: 50%;
        width: calc(100% - 24px);
        transform: translate(-50%, -50%);

        @include tablet-up {
          width: calc(100% - 48px);
        }
      }
    }

    /deep/ .product-tile {
      margin: 0 4px;
      width: 100%;
      max-width: 260px;
      border-radius: 0;
      box-shadow: $drop-shadow--light;
      transition: box-shadow 300ms ease-in-out;

      @include tablet-up {
        margin: 0 20px;
      }

      &:nth-child(1) {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        box-shadow: $drop-shadow-hover--light;
      }

      &-title {
        font-size: 1rem;

        @include tablet-up {
          font-size: 1.5rem;
        }
      }

      &__price {
        font-size: 1.125rem;

        @include tablet-up {
          font-size: 1.25rem;
        }
      }

      &__static-text-content {
        height: auto;
        text-align: center;
      }
      
      &__price-container {
        margin-bottom: 0;
      }
    }

    /deep/ .product-skeleton-tile {
      margin: 0 4px;
      width: 100%;
      min-height: 150px;
      box-shadow: $drop-shadow--light;

      @include tablet-up {
        margin: 0 20px;
      }
    }
  }
</style>