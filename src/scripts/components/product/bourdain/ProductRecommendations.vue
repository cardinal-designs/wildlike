<template lang="pug">
  .super-collection__collection
    .container.super-collection__collection-container
      .super-collection__collection-header
        .super-collection__collection-header-text
          .h3.super-collection__collection-title Recommended Products
        .controls-container.u-hidden-tablet-up
          .arrows
            .arrow.arrow-prev(@click="slidePrev")
              icon(name="chevron-left" size="14px")
            .arrow.arrow-next(@click="slideNext")
              icon(name="chevron-right" size="14px")
      .super-collection__collection-slider-container
        swiper(:options="swiperWithScrollbar(`[data-scrollbar='super-collection-progress']`)" :ref="`superCollectionSwiper`")
          swiperSlide.super-collection__collection-slide(v-for="(product, index) in gridProducts" :key="product.id")
            product-tile.super-collection__product-tile(:simple="true" :product="productWithoutVariants(product)" :showMobileATC="false" :truncateTitle="false" :fullTileClick="true") {{product.title}}
      .super-collection__progress-bar(data-scrollbar="super-collection-progress")
</template>

<script>
  import axios from 'axios';
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import Icon from 'scripts/components/basic/Icon.vue'
  import ProductTile from 'scripts/components/product/ProductTile.vue'

  export default {
    name: 'RecommendedProducts',
    components: { 
      swiper, 
      swiperSlide,
      Icon,
      ProductTile,
    },
    props: {
      products: Array
    },
    computed: {
      gridProducts() {
        const { products } = this;
        if (this.$mq === 'mobile') {
          return products.slice(0, 6);
        } else {
          return products.slice(0, 5);
        }
      },
    },
    methods: {
      slidePrev(index) {
        this.$refs[`superCollectionSwiper`].swiper.slidePrev();
      },
      slideNext(index) {
        this.$refs[`superCollectionSwiper`].swiper.slideNext();
      },
      swiperWithScrollbar(el) {
        return { ...this.swiperOptions, scrollbar: { el, draggable: true } };
      },
      productWithoutVariants(product) {
        return { ...product, variants: [], options: [] }
      },
    },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 5,
          spaceBetween: 24,
          breakpoints: {
            '1024': {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            '768': {
              slidesPerView: 2,
              spaceBetween: 24,
            },
          }
        },
        collectionProducts: {},
      }
    }
  }
</script>

<style scoped lang="scss">
  .arrows {
    display: flex;
    margin: 0 -16px;
  }

  .arrow {
    margin: 0 16px;

    &:hover {
      cursor: pointer;
    }

    .icon {
      display: block;
    }
  }

  .super-collection {
    &__collection-container {
      padding-top: 16px;
      padding-bottom: 16px;

      @include tablet-up {
        padding-bottom: 40px;
      }
    }

    &__collection-container--with-slider {
      padding-bottom: 24px;

      &:nth-child(1) {
        @include tablet-up {
          padding-top: 24px;
        }
      }
    }

    &__collection {
      overflow: hidden;
    }

    &__collection-header {
      display: flex;
      margin-bottom: 16px;
      justify-content: space-between;
      align-items: center;

      @include tablet-up {
        margin-bottom: 40px;
      }
    }

    &__collection-header-text {
      @include tablet-up {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
      }
    }

    .controls-container {
      overflow: hidden;
    }

    &__collection-slider-container {
      position: relative;

      /deep/ .swiper-container {
        padding-right: 1px;
      }

      /deep/ .swiper-wrapper {
        padding: 0 1px 1px 0;
      }
    }

    &__collection-slide {
      height: auto;
    }

    &__progress-bar {
      max-width: 1070px;
      margin: 16px auto 0;
      background-color: $color-black-100;
      height: 4px;

      @include tablet-up {
        margin-bottom: 40px;
      }

      /deep/ .swiper-scrollbar-drag {
        height: 4px;
        margin-top: 16px;
        background-color: $color-brand-primary;
        border-radius: 0;

        @include tablet-up {
          margin-top: 44px;
        }
      }
    }

    &__collection-title {
      margin-bottom: 4px;

      @include mobile-only {
        @include h5-tablet;
      }
      @include tablet-up {
        margin-bottom: 0;
      }
    }

    /deep/ &__product-tile {
      height: auto;
      border: 1px solid $color-black-100;
      border-radius: $super-collection-border-radius;
      overflow: hidden;
      transition: box-shadow 300ms ease-in-out;
      box-shadow: $drop-shadow--light;

      &:hover {
        box-shadow: $drop-shadow;
      }

      .super-collection__collection-grid & {
        margin: 0 12px 8px;
        flex-basis: calc(50% - 24px);
        
        @include tablet-up {
          margin: 0 12px 24px;
          flex-basis: calc(25% - 24px);
        }
        @include desktop-up {
          margin: 0 20px 24px;
          flex-basis: calc(25% - 40px);
        }
      }

      .super-collection__collection-slide & {
        height: 100%;
      }
      
      .product-tile__static-text-content {
        height: auto;
        border-top: 1px solid $color-black-100;
      }
    }
  }
</style>