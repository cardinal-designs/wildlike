<template lang="pug">
  .swatches-static(v-on="$listeners")
      button.swatches-static__swatch(
        v-for="(variant, index) in variants"
        :key="`swatch_${variant.id}`"
        :class="{'swatches-static__swatch--active': getActiveValue(variant) }"
        @keyup.enter.space.stop="$emit('input', variant);"
        @click.stop="$emit('input', variant);"
        :aria-controls="ariaControls"
        :aria-label="variant[optionKey]"
        :title="variant[optionKey]"
        tabindex="0"
        :disabled="getDisabledValue(variant)"
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
import { fileUrl } from '../../../helpers/util';
import { normalize } from '../../../filters/string';

export default {
  name: 'ProductswatchesStatic',
  data () {
    return {
      showDefault: new Array(this.variants.length).fill(false)
    }
  },
  methods: {
    fileUrl,
    normalize
  },
  computed: {
    /** @returns {String} */ 
    optionKey() {
      return `option${this.colorOptionNumber}`;
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
    ariaControls: String,
    getDisabledValue: {
      type: Function,
      default: () => false
    },
    getActiveValue: {
      type: Function,
      required: true,
    }
  }
}
</script>

<style lang="scss" scoped>
  .swatches-static {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;

    &__swatch {
      display: inline-flex;
      border-radius: 100%;
      width: 32px;
      height: 32px;
      font-size: 0;
      position: relative;
      outline: none;
      user-select: none;
      cursor: pointer;
      border: 1px solid $color-black-100;
      padding: 1px;
      transition: all 50ms linear;
      margin: 4px 4px 4px 0;
    }

    &__swatch + &__swatch {
      margin-left: 4px;
    }

    &__swatch img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      font-family: 'object-fit: cover;';
      border-radius: 100%;
    }

    &__swatch:not(:disabled):hover,
    &__swatch:not(:disabled):focus {
      border-color: $color-brand-primary;
    }

    &__swatch--active {
      border-color: $color-brand-primary;
    }
  }
</style>