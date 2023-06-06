<template lang="pug">
  component.bv-reviews-container(
    :is="tag" 
    :data-bv-show="format" 
    :data-bv-product-Id="productID" 
    :data-bv-redirect-url="format === 'inline_rating' ? productURL : ''" 
    :data-bv-seo="format === 'inline_rating' ? 'false' : false"
  )
</template>

<script>

export default {
  name: 'BazaarVoiceReviews',
  props: {
    productID: Number,
    productURL: String,
    format: {
      type: String,
      default: 'inline_rating',
      validator (value) {
        return [
          'inline_rating',
          'reviews'
        ].includes(value)
      }
    }
  },
  computed: {
    tag() {
      return this.format === 'reviews' ? 'div' : 'span';
    }
  }
}
</script>

<style lang="scss">
  .bv-reviews-container {
    .bv_main_container {
      &[aria-label^="0"] {
        display: none !important;
      }
    }
  }
</style>