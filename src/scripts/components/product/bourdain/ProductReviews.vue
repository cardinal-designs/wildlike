<template lang="pug">
  div#shopify-product-reviews(:data-id='product.id')
</template>

<script>
export default {
  name: "ProductReviews",
  props: {
    product: Object,
    customFields: Object
  }
}
</script>

<style lang="scss">
// see styles/product-reviews.scss
</style>