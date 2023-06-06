<template lang="pug">
  aside.product-rec-sidebar
    h1.h6.text-center {{ settings.productRecSidebarHeading || 'Other Product You May Like' }}
    product-tile-widget(v-for="product in filteredProducts", :key="`rec_sidebar_${product.id}`", :product="product")
</template>

<script>
import ProductTileWidget from '../ProductTileWidget.vue';

export default {
  name: 'ProductRecommendationsSidebar',
  components: {
    ProductTileWidget
  },
  props: {
    products: Array,
    product: Object,
    settings: Object,
  },
  computed: {
    filteredProducts() {
      return this.products
        .filter(prod => prod.id !== this.product.id)
        .filter(prod => prod.available)
        .slice(0, 3);
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-rec-sidebar {
    display: none;
    position: absolute;
    float: right;
    right: 0;
    top: 0;
    border-radius: 4px;
    border: 1px solid $color-grey;
    width: 200px;
    padding: 16px;
    background: $color-white;

    > * + * {
      margin-top: 8px;
    }

    /deep/ .product-tile__static-text-content {
      height: auto;
      text-align: center;
    }
  }
</style>