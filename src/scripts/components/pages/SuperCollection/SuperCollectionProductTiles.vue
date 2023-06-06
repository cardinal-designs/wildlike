<template lang="pug">
  .super-collection__collection
    .container.super-collection__collection-container(v-for="(collection, index) in settings.collectionArray" :key="index" :class="{ 'super-collection__collection-container--with-slider': !collection.image }")
      .super-collection__collection-header(:class="{'u-hidden-mobile-only': collection.image}")
        .super-collection__collection-header-text
          .h3.super-collection__collection-title {{collection.title}}
          a.link.link--primary(v-if="!collection.image" :href="`/collections/${collection.handle}`")
            span.link__content Shop All
            icon(name="arrow_long_right" size="20px")
        .controls-container.u-hidden-tablet-up(v-if="!collection.image")
          .arrows
            .arrow.arrow-prev(@click="slidePrev(index)")
              icon(name="chevron-left" size="14px")
            .arrow.arrow-next(@click="slideNext(index)")
              icon(name="chevron-right" size="14px")
      .super-collection__collection-grid(v-if="collection.image")
        .super-collection__collection-hero
          .super-collection__collection-hero-content.bg-white
            .super-collection__collection-hero-image-wrapper
              img.super-collection__collection-hero-image(:src="collection.image")
            .super-collection__collection-hero-text
              .super-collection__collection-title.u-hidden-tablet-up {{collection.title}}
              .super-collection__collection-desc.body-sm.body-lg-desktop-up(v-if="collection.description") {{collection.description}}
              a.link.link--primary.u-hidden-mobile-only(:href="`/collections/${collection.handle}`")
                span.link__content Shop All
                icon(name="arrow_long_right" size="20px")
          a.link.link--primary.u-hidden-tablet-up(:href="`/collections/${collection.handle}`")
            span.link__content Shop All
            icon(name="arrow_long_right" size="20px")
        product-tile.super-collection__product-tile(v-for="product in gridCollection[collection.handle]" :key="product.id" :simple="true" :collectionHandle="collection.handle" :product="productWithoutVariants(product)" :showMobileATC="false" :truncateTitle="false") {{product.title}}
      .super-collection__collection-slider-container(v-else)
        swiper(:options="swiperWithScrollbar(`[data-scrollbar='super-collection-progress-${index}']`)" :ref="`superCollectionSwiper_${index}`")
          swiperSlide.super-collection__collection-slide(v-for="product in collectionProducts[collection.handle]" :key="product.id")
            product-tile.super-collection__product-tile(:simple="true" :collectionHandle="collection.handle" :product="productWithoutVariants(product)" :showMobileATC="false" :truncateTitle="false") {{product.title}}
        .arrow.arrow-prev.bg-white(@click="slidePrev(index)")
          icon(name="arrow-left" size="18px")
        .arrow.arrow-next.bg-white(@click="slideNext(index)")
          icon(name="arrow-right" size="18px")
      .super-collection__progress-bar(:data-scrollbar="`super-collection-progress-${index}`")
</template>

<script>
  import axios from 'axios';
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import Icon from 'scripts/components/basic/Icon.vue'
  import ProductTile from 'scripts/components/product/ProductTile.vue'

  export default {
    name: 'SuperCollectionProductTiles',
    components: { 
      swiper, 
      swiperSlide,
      Icon,
      ProductTile,
    },
    props: {
      settings: {
        type: Object,
        default: () => ({}),
      }
    },
    computed: {
      gridCollection() {
        const gridProducts = {};
        const keys = Object.keys(this.collectionProducts);

        keys.forEach(key => {
          if (this.$mq === 'mobile') {
            gridProducts[key] = this.collectionProducts[key].slice(0, 4);
          } else {
            gridProducts[key] = this.collectionProducts[key].slice(0, 6);
          }
        });
        return gridProducts;
      },
    },
    methods: {
      slidePrev(index) {
        this.$refs[`superCollectionSwiper_${index}`][0].swiper.slidePrev();
      },
      slideNext(index) {
        this.$refs[`superCollectionSwiper_${index}`][0].swiper.slideNext();
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
          slidesPerView: 4,
          spaceBetween: 40,
          breakpoints: {
            '1024': {
              slidesPerView: 3,
              spaceBetween: 28,
            },
            '768': {
              slidesPerView: 2,
              spaceBetween: 28,
            },
          }
        },
        collectionProducts: {},
      }
    },
    mounted() {
      this.settings.collectionArray.forEach(collection => {
        axios.get(`/collections/${collection.handle}?view=json`, {withCredentials: true})
          .then((res) => {
            if(res && res.data && res.data.products) {
              this.collectionProducts = { ...this.collectionProducts, [collection.handle]: res.data.products.slice(0, 12) };
            }
          })
          .catch((e) => console.error('error fetching collection', e.message));
      });
    }
  }
</script>

<style scoped lang="scss">
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
        margin-bottom: 16px;
      }
    }

    &__collection-header-text {
      @include tablet-up {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: flex-end;
      }
    }

    .controls-container {
      overflow: hidden;
    }
    
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

    &__collection-slider-container {
      position: relative;

      .arrow {
        display: none;
        position: absolute;
        top: 50%;
        z-index: 1;
        margin: 0;
        padding: 12px;
        border: 2px solid $color-white;
        border-radius: 50%;

        @include tablet-up {
          display: block;
        }
      }

      .arrow-prev {
        left: 2px;
      }

      .arrow-next {
        right: 2px;
      }

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
      margin: 0 auto;
      background-color: $color-black-100;

      @include tablet-up {
        margin-bottom: 40px;
      }

      .swiper-scrollbar-drag {
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

      .super-collection__collection-hero-content & {
        margin-top: 12px;
        letter-spacing: 0.5px;

        @include tablet-up {
          margin-top: 0;
          line-height: 1.4;
        }
      }
    }

    &__collection-desc {
      margin-top: 8px;

      @include tablet-up {
        width: 50%;
        margin-top: 0;
        padding: 24px 0;
        flex-basis: 50%;
      }
    }

    &__collection-grid {
      display: flex;
      margin: 0 -12px -8px;
      flex-wrap: wrap;
      justify-content: flex-start;

      @include desktop-up {
        margin: 0 -20px -24px;
      }
    }

    &__collection-hero {
      flex-basis: calc(100% - 24px);
      margin: 0 12px 20px;
      text-align: center;

      @include tablet-up {
        margin: 0 12px 24px;
        background-color: $color-white;
        flex-basis: calc(50% - 24px);
      }
      @include desktop-up {
        margin: 0 20px 24px;
        flex-basis: calc(50% - 40px);
      }
    }

    &__collection-hero-content {
      margin-bottom: 12px;
      padding-bottom: 24px;
      text-align: center;
      border: 1px solid $color-black-100;
      border-radius: $super-collection-border-radius;
      overflow: hidden;

      @include tablet-up {
        display: flex;
        margin-bottom: 0;
        padding-bottom: 0;
        height: 100%;
        text-align: left;
        flex-direction: column;
      }
    }

    &__collection-hero-image-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: calc(50% - 12px);
      overflow: hidden;

      @include desktop-up {
        padding-bottom: calc(50% - 20px);
      }
    }

    &__collection-hero-image {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__collection-hero-text {
      display: flex;
      margin: 0 auto;
      padding: 0 24px;
      width: 60%;
      flex-direction: column;
      align-items: center;
      flex-grow: 1;

      @include tablet-up {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
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