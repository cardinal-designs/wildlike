<template lang="pug">
.featured-in-article
  .featured-in-article__header
    h2.featured-in-article__heading.text-center {{ productsInfo.heading }}
  .featured-in-article__container
    .featured-in-article__product-card(
      v-for="(product, index) in filterProducts(productsInfo.products)",
      :key="`product-${index}`"
    )
      div(@mouseover="hovered = true", @mouseleave="hovered = false")
        product-tile(
          :simple="isSimpleProductTile",
          :product="product",
          :enable-simple-tile-cta="enableSimpleTileCta"
          :enable-simple-tile="enableSimpleTile"
        )
</template>
  
<script>
import ProductTile from "scripts/components/product/ProductTile.vue";
import { isHiddenProduct, checkUndefined } from "scripts/helpers/util";
import { px } from "scripts/filters/string.js";
  
export default {
  name: "FeaturedInArticle",
  components: {
    ProductTile,
  },
  props: {
    productsInfo: {
      type: Object,
      default: () => ({
        heading: {
          type: String,
          required: true,
        },
        products: {
          type: Array,
          required: true,
        },
      }),
    },
    enableSimpleTile: {
      type: Boolean,
      required: true,
    },
    enableSimpleTileCta: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isSimpleProductTile() {
      return this.collectionTemplate === "b" || this.enableSimpleTile;
    },
    paddingStyles() {
      return {
        "padding-top": px(
          checkUndefined(this.productsInfo.marginTop, 56)
        ),
        "padding-bottom": px(
          checkUndefined(this.productsInfo.marginBottom, 56)
        ),
      };
    },
  },
  methods: {
    filterProducts(products) {
      return products.filter(
        (prod) => prod.available && !isHiddenProduct(prod)
      );
    },
  },
};
</script>

<style scoped lang="scss">
.featured-in-article {
  &__header {
    margin-bottom: 32px;

    @include desktop-up {
      margin-bottom: 40px;
    }
  }

  &__container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    column-gap: 26px;
    row-gap: 24px;
    margin-bottom: 56px;

    @include desktop-up {
      flex-wrap: nowrap;
      column-gap: 44px;
      margin-bottom: 104px;
    }
  }

  &__product-card {
    max-width: 159px;
    
    @include desktop-up {
      max-width: 248px;
    }
  }
}
</style>