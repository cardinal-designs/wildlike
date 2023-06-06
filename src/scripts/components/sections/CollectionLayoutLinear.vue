<template lang="pug">
  section.hpc-linear(
    :class="[schema.settings.backgroundColor, `hpc-linear--block-count-${blocksByShape.length}`, {'hpc-linear--background-image': schema.settings.backgroundImage}]"
    :style="{'padding-top': `${schema.settings.marginTop}px`,'padding-bottom': `${schema.settings.marginBottom}px`,'background-image': schema.settings.backgroundImage ? `url(${schema.settings.backgroundImage})` : 'none'}"
  )
    .hpc-linear__content(:class="[schema.settings.backgroundColor]")
      div.container
        div.row.hpc-linear__header-bar(v-if="schema.settings.textAlignment.toLowerCase() === 'center'")
          h3.h3.col-12-sm.hpc-linear__header.text-center(:class="[schema.settings.headerColor]") {{ schema.settings.sectionHeader }}
          div.col-12-sm.text-center(v-if="schema.settings.shopAllLink")
            v-link.hpc-linear__shop-all-block(:href="schema.settings.shopAllLink", primary ) Shop All
        div.row.hpc-linear__header-bar.hpc-linear__side-by-side-container(v-else)
          h3.h3.col-8-sm.hpc-linear__header(:class="[schema.settings.headerColor]") {{ schema.settings.sectionHeader }}
          div.col-4-sm.text-right(v-if="schema.settings.shopAllLink")
            v-link.hpc-linear__shop-all-block(:href="schema.settings.shopAllLink", primary ) Shop All
      div.hpc-linear__blocks.hpc-linear__blocks--static(v-show="showStaticBlocks")
        a.hpc-linear__block(v-if="block.settings.linear_image" :href="block.settings.linear_link", v-for="block in blocksByShape" :class="[`hpc-linear__block--${schema.settings.imageShape}`]")
          figure.hpc-linear__block-content(:class="{'hpc-linear__block-content--rectangle bg-white': schema.settings.imageShape === 'rectangle'}")
            img(v-if="schema.settings.imageShape === 'square'" :src="imageCrop(imageSize(block.settings.linear_image, '320x320'), 'center')", :srcset="srcsetSquare(block.settings.linear_image)", alt="")
            .hpc-linear__block-image-wrapper(v-else)
              img(:src="imageSize(block.settings.linear_image, 'x256')", :srcset="srcsetRectangle(block.settings.linear_image)", alt="")
            figcaption.h7.color-black.text-center {{ block.settings.linear_collection_name }}
      div.hpc-linear__blocks.hpc-linear__blocks--swiper(v-show="!showStaticBlocks")
        swiper(v-if="blocksByShape.length > 4" :options="swiperOptions" :class="{'u-hidden-mobile-only': schema.settings.imageShape === 'rectangle'}")
          div.hpc-linear__pagination.hpc-linear__pagination--desktop(slot="pagination")
          swiper-slide(v-for="block in blocksByShape", :key="block.settings.linear_link + block.settings.linear_image" :class="[`swiper-slide--${schema.settings.imageShape}`]")
            a.hpc-linear__block(v-if="block.settings.linear_image" :href="block.settings.linear_link" :class="[`hpc-linear__block--${schema.settings.imageShape}`]")
              figure.hpc-linear__block-content(:class="{'hpc-linear__block-content--rectangle bg-white': schema.settings.imageShape === 'rectangle'}")
                img(v-if="schema.settings.imageShape === 'square'" :src="imageCrop(imageSize(block.settings.linear_image, '320x320'), 'center')", :srcset="srcsetSquare(block.settings.linear_image)", alt="")
                .hpc-linear__block-image-wrapper(v-else)
                  img(:src="imageSize(block.settings.linear_image, 'x256')", :srcset="srcsetRectangle(block.settings.linear_image)", alt="")
                figcaption.h7.color-black.text-center {{ block.settings.linear_collection_name }}
        swiper.u-hidden-tablet-up(v-if="schema.settings.imageShape === 'rectangle'" :options="swiperOptionsMobile")
          div.hpc-linear__pagination.hpc-linear__pagination--mobile(slot="pagination")
          swiper-slide(v-for="block in blocksByShape", :key="block.settings.linear_link + block.settings.linear_image" :class="[`swiper-slide--${schema.settings.imageShape}`]")
            a.hpc-linear__block(v-if="block.settings.linear_image" :href="block.settings.linear_link" :class="[`hpc-linear__block--${schema.settings.imageShape}`]")
              figure.hpc-linear__block-content.hpc-linear__block-content--rectangle.bg-white
                .hpc-linear__block-image-wrapper
                  img(:src="imageSize(block.settings.linear_image, 'x256')", :srcset="srcsetRectangle(block.settings.linear_image)", alt="")
                figcaption.h7.color-black.text-center {{ block.settings.linear_collection_name }}
</template>

<script>
import VLink from '../buttons/VLink.vue';
import { imageSize, imageCrop } from '../../helpers/util';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  name: "CollectionLayoutLinear",
  components: {
    VLink,
    swiper,
    swiperSlide
  },
  props: {
    schema: Object,
  },
  data() {
    return {
      swiperOptions: {
        pagination: {el: '.hpc-linear__pagination--desktop', clickable: true},
        spaceBetween: this.schema.settings.imageShape === 'square' ? 32 : 16,
        slidesPerView: 'auto',
      },
      swiperOptionsMobile: {
        pagination: {el: '.hpc-linear__pagination--mobile', clickable: true},
        spaceBetween: 16,
        slidesPerView: 1,
        slidesPerColumn: 2,
      }
    }
  },
  computed: {
    blocksByShape() {
      const maxBlocks = this.schema.settings.imageShape === 'square' ? 7 : 6;
      return this.schema.blocks.slice(0,maxBlocks);
    },
    showStaticBlocks() {
      return (this.blocksByShape.length <= 4 && (this.schema.settings.imageShape === 'square' || (this.schema.settings.imageShape === 'rectangle' && this.$mq !== 'mobile'))) || (this.$mq === 'hd');
    }
  },
  methods: {
    srcsetSquare(image) {
      return [
        `${imageCrop(imageSize(image, '240x240'), 'center')} 1.5x`,
        `${imageCrop(imageSize(image, '320x320'), 'center')} 2x`,
      ].join(', ')
    },
    srcsetRectangle(image) {
      return [
        `${imageSize(image, 'x192')} 1.5x`,
        `${imageSize(image, 'x256')} 2x`,
      ].join(', ')
    },
    imageSize,
    imageCrop
  },
}
</script>

<style lang="scss">
.hpc-linear {
  display: flex;
  justify-content: center;

  &__side-by-side-container {
    display: flex;
    align-items: baseline;
    padding: 0 12px;

    @include tablet-up {
      padding: 0;
    }
  }

  &__content {
    width: 100%;
    .hpc-linear--background-image & {
      margin: 0 $grid-gutter-sm;
      padding: 12px;
      max-width: ($container-max-width + ($grid-gutter-sm * 2));
      border-radius: $border-radius;
      overflow: hidden;

      @include tablet-up {
        margin: 0 $grid-gutter;
        padding: 40px;
        max-width: ($container-max-width + ($grid-gutter * 2));
      }
    }
  }

  &__header {
    padding: 0 !important;

    @include tablet-up {
      padding: 0 8px !important;
    }
  }

  &__side-by-side-container * {
    vertical-align: middle;
  }

  &__blocks {
    position: relative;
    font-size: 0;
    text-align: center;
    display: flex;
    align-items: flex-start;
    max-width: 1440px;
    margin: 0 auto;
    overflow: hidden;

    .swiper-slide:nth-child(1) {
      margin-left: 12px;
    }

    .swiper-slide:last-child {
      margin-right: 12px !important;
    }

    .swiper-slide--rectangle:nth-child(1) {
      margin-left: 0;
    }

    .swiper-slide--rectangle:last-child {
      margin-right: 0 !important;
    }
  }

  &__blocks--static {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;

    @include hd-up {
      flex-wrap: nowrap;
    }
  }

  &__block {
    display: block;
    margin: 0 8px;

    @include hd-up {
      width: 100% !important;
      min-width: 0 !important;
    }

    &:hover figcaption,
    &:focus figcaption {
      // todo
      transform: translateY(-2px);
    }
  }

  &__block--square {
    margin-bottom: 12px;
  }

  &__block--rectangle {
    margin: 0 auto;
    padding: 0 16px;

    @include hd-up {
      margin: 0 8px;
    }

    &:hover figcaption,
    &:focus figcaption {
      // todo
      transform: none;
    }
  }

  &__block * {
    width: 100%;
  }

  &__block:focus {
    outline: none;
  }

  &__block-content--rectangle {
    padding-bottom: 4px;
    border-radius: $border-radius;
    box-shadow: $drop-shadow--light;
    transition: box-shadow 300ms ease-in-out, transform 300ms ease-in-out;

    &:hover {
      transform: translate3d(0, -2px, 0);
      box-shadow: $drop-shadow-hover--light;
    }
  }

  &__block-image-wrapper {
    position: relative;
    display: flex;
    width: 100%;
    height: 0;
    margin-bottom: 8px;
    padding-bottom: 47%;

    img {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: contain;
      font-family: 'object-fit: contain;';
    }
  }

  &--block-count-5,
  &--block-count-6,
  &--block-count-7 {
    .hpc-linear__block,
    .swiper-slide {
      width: 134px;
      min-width: 134px;
      max-width: 134px;
    }

    .hpc-linear__block--rectangle,
    .swiper-slide--rectangle {
      width: 100%;
    }

    .hpc-linear__block--square {
      margin-bottom: 0;
    }

    .hpc-linear__block--rectangle {
      max-width: 400px;
    }

    .swiper-slide--rectangle {
      max-width: none;
    }
  }

  &__pagination {
    display: block;

    .swiper-pagination-bullet {
      margin-top: 16px !important;
    }
  }

  &__blocks--static &__block {
    width: calc(50% - 24px);
  }

  figure {
    display: inline-block;
    width: 100%;
  }

  figure img {
    margin-bottom: 18px;
    max-width: 100%;
  }

  figcaption {
    transition: transform .1s ease-in-out;
    white-space: pre-line;
  }

  .swiper-pagination-bullet {
    width: $collection-linear-pagination-size;
    height: $collection-linear-pagination-size;
    background: $collection-linear-pagination-color;
  }

  .swiper-pagination-bullet-active {
    background: $color-primary-500;
  }

  @include tablet-up {
    &__blocks {
      .swiper-slide--rectangle:nth-child(1) {
        margin-left: 12px;
      }

      .swiper-slide--rectangle:last-child {
        margin-right: 12px !important;
      }
    }

    &__block,
    .swiper-slide {
      width: 160px;
      min-width: 160px;
      max-width: 160px;
    }

    &__block--rectangle,
    .swiper-slide--rectangle {
      padding: 0;
      width: 220px;
      min-width: 220px;
      max-width: 220px;
    }

    &__block--square {
      margin-bottom: 0;
    }

    &__block--rectangle {
      padding-top: 4px;
    }

    &__block-image-wrapper {
      padding-bottom: 58%;
    }

    &--block-count-5 &__block,
    &--block-count-6 &__block,
    &--block-count-7 &__block {
      width: 160px;
      min-width: 160px;
      max-width: 160px;
    }

    &--block-count-5 &__block--rectangle,
    &--block-count-6 &__block--rectangle,
    &--block-count-7 &__block--rectangle {
      width: 220px;
      min-width: 220px;
      max-width: 220px;
    }

    figure img {
      margin-bottom: 24px;
    }
  }
}
</style>
