<template lang="pug">
  .editorial-sets(v-if="validBlocks.length > 0" :class="[schema.settings.bgColor]" :style="{ 'padding-top': `${schema.settings.marginTop}px`, 'padding-bottom': `${schema.settings.marginBottom}px` }")
    .container
      v-arrow-button.editorial-sets__arrow.editorial-sets__arrow--left.u-hidden-mobile-only.u-hidden-tablet-only(@click="prevSlideMain" :disabled="mainPrevDisabled ? 'disabled': false" :primary="true")
        icon(name="arrow-left")
      swiper.editorial-sets__main(:options="mainSwiperOptions" ref="mainSwiper")
        swiperSlide.editorial-sets__main-slide(v-for="(block, index) in validBlocks" :key="block.id")
          .editorial-sets__header
            .editorial-sets__header-text
              .editorial-sets__title.h3(:class="[schema.settings.textColorClass]") {{block.settings.title}}
              v-link.editorial-sets__link.u-hidden-tablet-up(primary :href="block.settings.linkURL" :class="[schema.settings.textColorClass]") {{block.settings.linkText || 'Shop the Set'}}
            v-link.editorial-sets__link.u-hidden-mobile-only(primary :href="block.settings.linkURL" :class="[schema.settings.textColorClass]") {{block.settings.linkText || 'Shop the Set'}}
            .editorial-sets__main-controls(:class="{ 'u-hidden': validBlocks.length <= 1 }")
              icon.editorial-sets__main-arrow(name="chevron-left" size="12px" @click="prevSlideMain" :fillClass="fillColor")
              .editorial-sets__slide-count(:class="[schema.settings.textColorClass]") {{ `${index + 1}${ $mq === 'mobile' ? '/' : ' OF ' }${validBlocks.length}` }}
              icon.editorial-sets__main-arrow(name="chevron-right" size="12px" @click="nextSlideMain" :fillClass="fillColor")
          .editorial-sets__content.bg-white
            .editorial-sets__image(:style="{'background-image': `url(${block.settings.image})`}")
            .editorial-sets__product-container(v-if="productData[index]")
              swiper.editorial-sets__product(:class="{'swiper-no-swiping': productData[index].length <= 1}" :options="{...productSwiperOptions, initialSlide: Math.floor((productData[index].length - 1) / 2),pagination: paginationSettings('.editorial-sets__product-pagination', index)}" ref="productSwiper")
                swiperSlide.editorial-sets__product-slide(v-for="(product, subindex) in productData[index]" :key="subindex")
                  .editorial-sets__product-image-wrapper
                    img.editorial-sets__product-image(:src="product.image" :alt="product.imageAlt")
              .editorial-sets__product-content-container
                fade-transition
                  .editorial-sets__product-content(:key="`${currentProductKey}`")
                    .h6-mobile.h6-tablet.h5-desktop-up.editorial-sets__product-title {{currentProduct.title}}
                    p.body-sm-mobile.body-sm-tablet.body-md-desktop-up.editorial-sets__product-desc {{currentProduct.desc}}
                    v-link.editorial-sets__product-link(primary :href="`/products/${currentProduct.handle}`") Buy Now
              .editorial-sets__product-pagination(:data-pagination="index" :class="{'u-hidden': productData[index].length <= 1}")
      v-arrow-button.editorial-sets__arrow.editorial-sets__arrow--right.u-hidden-mobile-only.u-hidden-tablet-only(@click="nextSlideMain" :disabled="mainNextDisabled ? 'disabled': false" :primary="true")
        icon(name="arrow-right")
</template>

<script>
import axios from 'axios';
import {FadeTransition} from 'vue2-transitions';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import Icon from 'scripts/components/basic/Icon.vue';
import VLink from 'scripts/components/buttons/VLink.vue';
import VArrowButton from 'scripts/components/buttons/VArrowButton.vue';

export default {
  name: "EditorialSets",
  components: {
    Icon,
    FadeTransition,
    swiper,
    swiperSlide,
    VLink,
    VArrowButton
  },
  props: {
    schema: Object
  },
  data() {
    const vue = this;

    return {
      mainSwiperOptions: {
        slidesPerView: 1,
        allowTouchMove: false,
        threshold: 5,
        on: {
          slideChange: function() {
            vue.currentBlock = this.activeIndex;

            const productIndex = vue.$refs.productSwiper[vue.currentBlock].swiper.activeIndex;
            vue.currentProductKey = `${vue.currentBlock}-${productIndex}`;
            vue.currentProduct = vue.productData[vue.currentBlock][productIndex];
          }
        }
      },
      productSwiperOptions: {
        slidesPerView: 'auto',
        spaceBetween: -36,
        centeredSlides: true,
        nested: true,
        slideToClickedSlide: true,
        threshold: 5,
        breakpoints: {
          1023: {
            slidesPerView: 1,
            spaceBetween: 0,
          }
        },
        on: {
          slideChange: function() {
            vue.currentProductKey = `${vue.currentBlock}-${this.activeIndex}`;
            vue.currentProduct = vue.productData[vue.currentBlock][this.activeIndex];
          }
        }
      },
      currentBlock: 0,
      currentProductKey: '0-0',
      currentProduct: {product: {}},
      productData: [],
    };
  },
  computed: {
    validBlocks() {
      return this.schema.blocks.filter((block) => block.settings.title && block.settings.image && this.filterEmptyProducts(block.settings.products).length > 0);
    },
    mainPrevDisabled() {
      return this.currentBlock === 0;
    },
    mainNextDisabled() {
      return this.currentBlock === this.validBlocks.length - 1;
    },
    fillColor() {
      return this.schema.settings.textColorClass.replace('color', 'fill');
    }
  },
  methods: {
    prevSlideMain() {
      this.$refs.mainSwiper.swiper.slidePrev();
    },
    nextSlideMain() {
      this.$refs.mainSwiper.swiper.slideNext();
    },
    paginationSettings(el, index) {
      return {
        el: `${el}[data-pagination="${index}"]`,
        clickable: true,
      };
    },
    filterEmptyProducts(products) {
      const filteredProducts = products.filter((product) => product.handle);

      return filteredProducts;
    },
    getProductJSON(handle, callback) {
      axios.get(`/products/${handle}?view=json`, {withCredentials: true})
        .then((res) => {
          if(res && res.data) {
            callback(res.data);
          }
        })
        .catch((e) => console.error('error fetching recommended products', e.message));
    }
  },
  mounted() {
    if (this.validBlocks.length > 0) {
      this.validBlocks.forEach((block, index) => {
        const productArray = [];
        this.filterEmptyProducts(block.settings.products).forEach((product, subindex) => {
          productArray.push({...product});

          if (product.title && product.image) {
            return;
          }

          this.getProductJSON(product.handle, (data) => {
            if (this.productData[index] && this.productData[index][subindex]) {
              const dupArray = this.productData[index];
              if (!dupArray[subindex].title) {
                dupArray[subindex].title = data.title;
              }
              if (!dupArray[subindex].image) {
                dupArray[subindex].image = data.images[0].src;
                dupArray[subindex].imageAlt = data.images[0].alt;
              }
              this.productData.splice(index, 1, dupArray);
            }
          });
        });
        this.productData.push(productArray);
      });

      const initialIdx = Math.floor((this.productData[0].length - 1) / 2);
      this.currentProduct = this.productData[0][initialIdx];
      this.currentProductKey = `0-${initialIdx}`;
    }
  }
}
</script>

<style scoped lang="scss">
  .editorial-sets {
    .container {
      position: relative;

      @include desktop-up {
        padding: 0 80px;
      }
      @include hd-up {
        padding: 0 100px;
      }
    }

    /deep/ &__arrow {
      position: absolute;
      top: 50% !important;
      transform: translateY(-50%);
      cursor: pointer;

      &:not(:active):not(:focus) {
        border-color: $color-white;
      }
    }

    &__arrow--left {
      left: 20px;
    }

    &__arrow--right {
      right: 20px;
    }

    &__main {
      max-width: 1168px;
      margin: 0 auto;
    }

    &__main-slide {
      padding: 0 4px 4px;

      &:not(.swiper-slide-active) {
        pointer-events: none;
      }
    }

    &__header {
      display: flex;
      margin-bottom: 12px;
      align-items: center;

      @include tablet-up {
        flex-wrap: wrap;
        justify-content: space-between;
      }
    }

    &__header-text {
      flex-basis: 100%;
    }

    &__title {
      margin-bottom: 12px;
    }

    &__main-controls {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex: 0 0 auto;
    }

    &__main-arrow {
      cursor: pointer;
    }

    &__slide-count {
      @include body-lg-tablet;

      margin: 0 12px;

      @include tablet-up {
        margin: 0 16px;
      }
    }

    &__content {
      border: 1px solid $color-black-100;
      box-shadow: $drop-shadow--light;

      @include tablet-up {
        display: flex;
        align-items: stretch;
      }
    }

    &__image {
      width: 100%;
      padding-bottom: 100%;
      background-size: cover;
      background-position: center center;

      @include tablet-up {
        height: 420px;
        padding-bottom: 0;
      }
      @include desktop-up {
        height: 520px;
      }
    }

    &__product-container {
      position: relative;
      display: flex;
      width: 100%;
      height: 336px;
      padding: 32px 40px;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;

      @include tablet-up {
        height: auto;
        padding: 32px 8px;
        justify-content: center;
      }
    }

    &__product {
      width: 100%;
      margin-bottom: 8px;

      @include tablet-up {
        max-width: 408px;
        margin: 0 auto 8px;
      }
    }

    &__product-slide {
      @include desktop-up {
        max-width: 200px;
        transform: scale(0.4);
        transition: transform 300ms ease-in-out;
      }

      &.swiper-slide-active,
      &.swiper-slide-duplicate-active {
        @include tablet-up {
          transform: scale(1);
        }
      }
    }

    &__product-image-wrapper {
      display: flex;
      margin: 0 auto;
      max-width: 112px;
      height: 112px;
      cursor: pointer;

      @include tablet-up {
        max-width: 172px;
        height: 172px;
      }
      @include desktop-up {
        max-width: 200px;
        height: 200px;
      }

    }

    &__product-image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      font-family: 'object-fit: contain;';
    }

    &__product-content-container {
      position: relative;
      width: 100%;
      max-width: 260px;
      margin: 0 auto;

      @include tablet-up {
        max-width: 324px;
      }
    }

    &__product-content {
      width: 100%;
      text-align: center;

      &.fadeOut {
        position: absolute;
      }
    }

    &__product-title {
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      text-transform: none;

      @include tablet-up {
        letter-spacing: 0;
      }
    }

    &__product-desc {
      margin-bottom: 16px;
    }

    &__product-link {
      .fadeOut & {
        pointer-events: none;
      }
    }

    &__product-pagination {
      position: absolute;
      left: 50%;
      bottom: 16px;
      z-index: 1;
      transform: translateX(-50%);

      /deep/ .swiper-pagination-bullet {
        margin: 0 4px;
        background: $color-white;
        border: 1px solid $color-primary-500;

        &.swiper-pagination-bullet-active {
          background: $color-primary-500;
        }
      }
    }
  }
</style>
