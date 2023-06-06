<template lang="pug">
  .swatches(v-on="$listeners")
    .swatches__simple(v-if="$mq !== 'mobile' && $mq !== 'tablet'")
        button.swatches__swatch(
          v-for="(variant, index) in variants.slice(0,6)"
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
    .swatches__simple(v-else)
      button.swatches__swatch(
        v-for="(variant, index) in variants.slice(0,4)"
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
    span.swatches__more-count(
      v-if="variants.length > 6 && $mq !== 'mobile' && $mq !== 'tablet'") +{{ variants.length - 6 }}
    span.swatches__more-count(v-if="variants.length > 4 && ($mq === 'mobile' || $mq === 'tablet')") +{{ variants.length - 4 }}
</template>

<script>
import { normalize } from 'scripts/filters/string.js'

import { fileUrl } from '../../helpers/util';
import Icon from '../basic/Icon.vue';

export default {
  name: 'ProductSwatchesSimple',
  components: { Icon },
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
  },
  data () {
    return {
      showDefault: new Array(this.variants.length).fill(false)
    }
  },
  computed: {
    /** @returns {String} */ 
    optionKey() {
      return `option${this.colorOptionNumber}`;
    }
  },
  methods: {
    fileUrl,
    normalize
  }
}
</script>

<style scoped lang="scss">
  .swatches {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-white;
    padding: 8px;
    max-width: none;
    @include mobile-tablet {
      height: 44px;
    }

    &__swatch {
      display: inline-block;
      border-radius: 100%;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      font-size: 0;
      position: relative;
      top: 0;
      padding: 0;
      border: none;
      // box-sizing: content-box;
      outline: none;
      cursor: pointer;
      margin-bottom: 0;
      border: 1px solid $color-black-100;
      @include mobile-tablet {
        width: 28px;
        height: 28px;
      }
    }

    &__simple {
      display: flex;
      align-items: center;
    }


    &__swatch img {
      width: 100%;
      border-radius: 100%;
    }

    &__swatch--active
    &__swatch:not(:disabled):hover,
    &__swatch:not(:disabled):focus {
      border: 1px solid $color-grey;
      padding: 1px;

    }

    &__swatch--active {
      border: 1px solid $color-grey;
      padding: 1px;
      top: 0;
      img {
        @include mobile-tablet {
          border: 1px solid $color-white;
        }
      }
    }


    @media (min-width: $breakpoint-desktop) and (any-hover: hover) {
      max-width: 100%;

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
    &__more-count {
      font-size: 18px;
      letter-spacing: 0;
      line-height: 24px;
      @include mobile-tablet {
        font-size: 12px;
        letter-spacing: 0;
        line-height: 16px;
      }
    }
  }
</style>