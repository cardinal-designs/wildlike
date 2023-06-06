<template scoped lang="pug">
  .swatches(v-on="$listeners")
    .swatches__slider
      button.swatches__next(
        v-if="variants.length > 5"
        :class="showSliderNext() ? '' : 'swatches__next--unavailable'"
        :disabled="!showSliderNext()"
        slot="button-next"
        :aria-label="`go to next color`"
        tabindex="0"
        @click="nextSlide"
      )
        icon(
          name="chevron-right"
          size="8px"
        )
      swiper(
        :options="swiperOptions"
        ref="swiper"
      )
        swiperSlide(
          v-for="(variant, index) in variants"
          :key="`swatch_${variant.id}`"
        )
          button.swatches__swatch(
            :class="{'swatches__swatch--active': variant.id === value.id }"
            @keyup.enter.space.stop="$emit('input', variant)"
            @click.stop="$emit('input', variant)"
            :aria-controls="ariaControls"
            :aria-label="variant[optionKey]"
            :title="variant[optionKey]"
            tabindex="0"
          )
            img(
              :src="variant.swatch_image", 
              :alt="variant[optionKey]"
              @error="$set(showDefault, index, true)"
              v-if="!showDefault[index] && variant.swatch_image"
            )
            img(
              :src="fileUrl(`swatch_${normalize(variant[optionKey])}.png`)", 
              :alt="variant[optionKey]"
              @error="$set(showDefault, index, true)"
              v-else-if="!showDefault[index]"
            )
            img(
              :src="fileUrl(`swatch_default_color.png`)", 
              :alt="variant[optionKey]"
              v-else
            )
    .swatches__static
        button.swatches__swatch(
          v-for="(variant, index) in variants"
          :key="`swatch_${variant.id}`"
          :class="{'swatches__swatch--active': variant.id === value.id }"
          @keyup.enter.space.stop="$emit('input', variant);"
          @click.stop="$emit('input', variant);"
          :aria-controls="ariaControls"
          :aria-label="variant[optionKey]"
          :title="variant[optionKey]"
          tabindex="0"
        )
          img(
            :src="variant.swatch_image", 
            :alt="variant[optionKey]"
            @error="$set(showDefault, index, true)"
            v-if="!showDefault[index] && variant.swatch_image"
          )
          img(
            :src="fileUrl(`swatch_${normalize(variant[optionKey])}.png`)", 
            :alt="variant[optionKey]"
            @error="$set(showDefault, index, true)"
            v-else-if="!showDefault[index]"
          )
          img(
            :src="fileUrl(`swatch_default_color.png`)", 
            :alt="variant[optionKey]"
            v-else
          )
</template>

<script>
import { normalize } from 'scripts/filters/string.js'

import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { fileUrl } from '../../../helpers/util';
import Icon from '../../basic/Icon.vue';

export default {
  name: 'ProductSwatches',
  components: {
    swiper,
    swiperSlide,
    Icon
  },
  data () {
    return {
      swiperOptions: {
        initialSlide: this.variants.indexOf(this.value),
        centeredSlides: true,
        width: 16,
        spaceBetween: 12,
      },
      showDefault: new Array(this.variants.length).fill(false)
    }
  },
  methods: {
    fileUrl,
    normalize,

    nextSlide () { 
      this.$refs.swiper.swiper.slideNext();
    },

    /** @returns {Boolean} */ 
    showSliderNext () {
      const { variants } = this;
      const sliderPosition = this.$refs.swiper ? this.$refs.swiper.swiper.activeIndex : 0;

      return variants.length - sliderPosition > 5;
    },
  },
  computed: {
    /** @returns {String} */ 
    optionKey() {
      return `option${this.colorOptionNumber}`;
    },
    /** @returns {Boolean} */ 
    shouldSlide () {
      const { variants, swatchPosition } = this;

      return variants.length - swatchPosition > 2;
    },
    /** @returns {Number} */ 
    swatchPosition () {
      const index = this.variants.indexOf(this.value);
      return index;
    },
  },
  watch: {
    value(n, o) {
      if(n !== o) {
        if(this.shouldSlide) {
          this.$refs.swiper.swiper.slideTo(this.swatchPosition - 2);
        }
      }
    },
  },
  props: {
    variants: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
    colorOptionNumber: {
      type: Number,
      default: 1
    },
    ariaControls: String
  }
}
</script>

<style scoped lang="scss">
  .swatches {
    position: relative;
    width: 100%;
    max-width: ((16px + 12px) * 5); // ((swatch width + swatch right margin) * number of swatches)

    &__slider {
      overflow: hidden;
      margin-bottom: 8px;
    }

    &__static {
      display: none;
    }


    .swiper-container {
      white-space: nowrap;
      overflow: hidden;
    }

    .swiper-slide {
      display: inline-block;
    }

    &__swatch {
      display: inline-flex;
      border-radius: 100%;
      width: 16px;
      height: 16px;
      font-size: 0;
      position: relative;
      top: 0;
      padding: 0;
      border: none;
      // box-sizing: content-box;
      outline: none;
      cursor: pointer;
    }


    &__swatch img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      font-family: 'object-fit: cover;';
      border-radius: 100%;
    }

    &__swatch--active
    &__swatch:not(:disabled):hover,
    &__swatch:not(:disabled):focus {
      border: 1px solid $color-grey;
      padding: 1px;
    }

    &__next {
      cursor: pointer;
      position: absolute;
      left: 100%;
      top: 0;
      background: none;
      outline: none;
      border: none;
      padding: 4px;
      transition: opacity .2s ease-in;
    }

    &__next--unavailable {
      display: none;
    }

    &__next svg {
      display: inline-block;
      vertical-align: middle;
    }

    &__swatch--active {
      border: 1px solid $color-grey;
      padding: 1px;
      top: 0;
    }


    @media (min-width: $breakpoint-desktop) and (any-hover: hover) {
      max-width: 100%;

      &__slider {
        display: none;
      }

      &__static {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }

      &__swatch {
        width: 24px;
        height: 24px;
        margin-right: 16px;
        margin-bottom: 16px;
      }

      &__swatch--active {
        border: 1px solid $color-brand-primary;
        padding: 2px;
        top: 0;
      }

      &__swatch:not(:disabled):hover,
      &__swatch:not(:disabled):focus {
        border: 1px solid $color-brand-primary;
        padding: 2px;
        top: 0;
      }
    }
  }
</style>