<template lang="pug">
  .predictive-search-modal(ref="predictiveSearchModal")
    fade-transition
      .predictive-search-modal__content(v-if="showModal")
        a.predictive-search__header.body-md-mobile.color-black.body-md(:href="moreResultsHref") Search for&#32;
          span.predictive-search__header-text "{{searchTerm}}"
        .predictive-search__content
          .predictive-search__suggestions-container(v-if="searchSuggestions.length > 0 || searchProducts.length > 0")
            h6.predictive-search__title Suggestions
            .predictive-search__suggestions-list(v-if="searchSuggestions.length > 0")
              .predictive-search__suggestions-list-item(v-for="(suggestion, index) in searchSuggestions" :key="suggestion.id" :class="{'predictive-search__suggestions-list-item--link': index === maxResults - 1}")
                a.predictive-search__suggestions-list-item--textlink(v-if="index < maxResults - 1" :href="suggestion.url") {{suggestion.title}}
                v-link.link.predictive-search__products-list-item-more-result.suggestion-more-result.more-result(v-else :primary="true" :href="moreResultsHref") More results
            .predictive-search__text(v-else) There are no suggestions for "{{searchTerm}}"
          .predictive-search__products-container(v-if="searchSuggestions.length > 0 || searchProducts.length > 0")
            h6.predictive-search__title Products
            .predictive-search__products-list(v-if="searchProducts.length > 0")
              .predictive-search__products-list-item(v-for="(product, index) in searchProducts" :key="product.id" :class="{'predictive-search__products-list-item--link' : index === maxResults - 1}")
                a.predictive-search__product-link(:href="product.url" v-if="index < maxResults - 1")
                  product-tile(:widget="true" :truncateTitle="false" :product="product" hide-badges)
                v-link.link.predictive-search__products-list-item-more-result.more-result(v-else :primary="true" :href="moreResultsHref") More results
            .predictive-search__text(v-else) There are no products for "{{searchTerm}}"
          h6.predictive-search__text(v-if="searchSuggestions.length <= 0 && searchProducts.length <= 0") There are no results for "{{searchTerm}}"
</template>

<script>
  import axios from 'axios'
  import VLink from 'scripts/components/buttons/VLink.vue'
  import Icon from 'scripts/components/basic/Icon.vue'
  import ProductTile from 'scripts/components/product/ProductTile.vue'
  import {FadeTransition} from 'vue2-transitions'
  import {elementOrAncestorHasClass} from 'scripts/helpers/util.js'

  export default {
    name: 'PredictiveSearchModal',
    components: {
      VLink,
      Icon,
      FadeTransition,
      ProductTile
    },
    data() {
      return {
        searchResults: {},
        showModal: false,
        alignment: 'left',
      }
    },
    props: {
      searchTerm: String,
    },
    computed: {
      maxResults() {
        return this.$mq === 'mobile' ? 4 : 8;
      },
      searchProducts() {
        if (!this.searchResults.products) {
          return [];
        }

        return this.searchResults.products.slice(0, this.maxResults).map(product => this.mapProductJSON(product));
      },
      searchSuggestions() {
        let suggestions = [];

        if (this.searchResults.articles) {
          suggestions = [...suggestions, ...this.searchResults.articles];
        }
        if (this.searchResults.collections) {
          suggestions = [...suggestions, ...this.searchResults.collections];
        }
        if (this.searchResults.pages) {
          suggestions = [...suggestions, ...this.searchResults.pages];
        }

        return suggestions.slice(0, this.maxResults);
      },
      searchTermEncoded() {
        return encodeURIComponent(this.searchTerm);
      },
      moreResultsHref() {
        /**
         * Storefront search defaults to all valid type values (product, page, article).
         * Only need to specify types if excluding one or more of them.
         * e.g -
         * const types = encodeURIComponent('product,article');
         */
        const prefix = encodeURIComponent('options[prefix]');
        return `/search?${prefix}=last&q=${this.searchTermEncoded}`;
      }
    },
    methods: {
      stringPriceToInt(price) {
        return Math.round(parseFloat(price) * 100);
      },
      mapProductJSON(product) {
        const productJSON = {
          ...product,
          compare_at_price: product.compare_at_price_min ?  this.stringPriceToInt(product.compare_at_price_min): product.compare_at_price_min,
          compare_at_price_max: product.compare_at_price_max ? this.stringPriceToInt(product.compare_at_price_max) : product.compare_at_price_max,
          compare_at_price_min: product.compare_at_price_min ? this.stringPriceToInt(product.compare_at_price_min) : product.compare_at_price_min,
          price: product.price ? this.stringPriceToInt(product.price) : product.price,
          price_max: product.price_max ? this.stringPriceToInt(product.price_max) : product.price_max,
          price_min: product.price_min ? this.stringPriceToInt(product.price_min) : product.price_min,
          variants: product.variants.length > 0 ? product.variants.map(variant => {
            return {
              ...variant,
              image: { ...variant.featured_image, src: variant.featured_image.url },
              compare_at_price: variant.compare_at_price ? this.stringPriceToInt(variant.compare_at_price) : variant.compare_at_price,
              price: variant.price ? this.stringPriceToInt(variant.price) : variant.price
            }
          }) : [],
        };

        productJSON.featured_image = productJSON.featured_image || {};
        productJSON.featured_image.src = productJSON.featured_image.url;
        productJSON.images = [productJSON.featured_image];

        if (product.variants.length <= 0) {
          const variant = {
            ...productJSON,
            image: { ...productJSON.featured_image }
          };
          productJSON.variants = [variant];
        }

        productJSON.selected_or_first_available_variant = productJSON.variants[0];

        return productJSON;
      },
      show() {
        if (this.searchTerm.length <= 0) return;

        this.setModalWidth();
        this.showModal = true;

        if (this.$mq === 'mobile') {
          document.querySelector('body').classList.add('no-overflow');
          return;
        }

        this.$store.dispatch('fullOverlay/setVisibility', true);
        this.$store.dispatch('fullOverlay/setIndex', 31);
      },
      close() {
        this.showModal = false;
        document.querySelector('body').classList.remove('no-overflow');
        this.$store.dispatch('fullOverlay/setVisibility', false);
      },
      getSearchResults() {
        this.show();

        if (this.searchTerm) {
          axios.get(`/search/suggest.json?q=${this.searchTermEncoded}&resources[type]=product,page,article,collection&resources[fields]=title,product_type,variants.title,variants.sku,vendor`)
            .then((res) => {
              if(res && res.data && res.data.resources && res.data.resources.results) {
                // Set results if searchTerm still exists
                // in the case which you type a letter and click backspace quickly this will make sure the result is still empty
                this.searchResults = this.searchTerm ? res.data.resources.results : {};
              }
            })
            .catch((e) => console.error('error fetching search results', e.message));
        } else {
          this.searchResults = {};
        }
      },
      setModalWidth() {
        if (!this.$refs.predictiveSearchModal) {
          return;
        }

        const $modal = this.$refs.predictiveSearchModal;
        const modalRect = $modal.getBoundingClientRect();
        const $modalParent = $modal.parentElement;

        if (this.$mq === 'mobile') {
          $modal.style.width = null;
          return;
        }

        // Set modal alignment based on if the parent is closer to the left or right side of the window
        this.alignment  = $modalParent.getBoundingClientRect().left + ($modalParent.getBoundingClientRect().width / 2) <= window.innerWidth / 2 ? 'left' : 'right';
        const updatedWidth = this.alignment === 'left' ? window.innerWidth - modalRect.left : modalRect.left + modalRect.width;

        $modal.style.width = `${updatedWidth}px`;
      },
      isOnSale(product) {
        if (!product.compare_at_price_max) {
          return false;
        }

        return parseFloat(product.compare_at_price_max) > parseFloat(product.price);
      }
    },
    watch: {
      $mq() {
        if (this.$mq !== 'mobile') {
          document.querySelector('body').classList.remove('no-overflow');
        }
      },
      searchTerm() {
        if (this.searchTerm.length <= 0) {
          this.close();
        }
      }
    },
    mounted() {
      window.addEventListener('resize', this.setModalWidth);

      // Close search results if user clicks outside of modal or search bar
      document.addEventListener('click', (event) => {
        const $target = event.target;

        if (!this.showModal || elementOrAncestorHasClass($target, ['predictive-search-modal', 'search-form'])) {
          return;
        }

        this.close();
      });
    },
    destroyed() {
      this.$store.dispatch('fullOverlay/setVisibility', false);
    }
  }
</script>

<style scoped lang="scss">
  .predictive-search-modal {
    position: fixed;
    top: 105px;
    left: 0px;
    right: auto;
    z-index: 22;
    width: 100vw;
    box-shadow: $drop-shadow--light;
    overflow: hidden;

    @include desktop-up {
      position: absolute;
      width: 100%;
      max-width: 1040px;
      top: calc(100% + 19px);
      border-radius: $border-radius;
    }

    &__content {
      background-color: $color-white;

      @include mobile-only {
        overflow: scroll;
      }

      height: calc(100vh - 170px);

      @include desktop-up {
        height: 100%;
      }

      #app.header-fixed & {
        @include mobile-only {
          height: calc(100vh - 122px);
        }
      }
    }

    /deep/ .product-tile {
      flex-direction: row;
      margin-bottom: 16px;
      align-items: center;

      @include desktop-up {
        flex-direction: column;
        text-align: center;
      }

      &__images {
        width: 57px;
        height: 57px;
        margin-right: 16px;
        flex: 0 0 auto;

        @include desktop-up {
          width: 100%;
          height: auto;
          margin-right: 0;
          margin-bottom: 8px;
        }

        a {
          display: flex;
          width: 100%;
        }
      }

      &__static-text-content {
        height: auto;
        width: 100%;
        text-align: left;
      }
    }
  }

  .predictive-search {
    &__header {
      display: block;
      width: 100%;
      padding: 12px;
      text-align: center;
      border-bottom: 1px solid $color-black-300;
      background-color: $color-black-100;
      transition: background-color 300ms ease-in-out;

      &:hover {
        background-color: $color-white;
      }
    }

    &__header-text {
      font-size: inherit;
      line-height: inherit;
      color: $color-black-600;
      font-family: $font-family-secondary;
      font-weight: 600;
    }

    &__content {
      display: flex;
      padding: 12px 18px 115px;
      flex-direction: column;

      @include desktop-up {
        padding: 28px 32px 32px;
        flex-direction: row;
      }
    }

    &__suggestions-container {
      flex-basis: 100%;
      margin-right: 32px;
      order: 2;

      @include desktop-up {
        order: 1;
      }
    }

    &__products-container {
      flex-basis: 320%;
      order: 1;

      @include desktop-up {
        order: 2;
      }
    }

    &__title {
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid $color-black-300;

      @include desktop-up {
        padding-bottom: 16px;
      }
    }

    &__suggestions-list-item {
      margin-bottom: 16px;

      .link {
        @include mobile-only {
          font-size: rem(14);
        }
      }

      /deep/ .link__content {
        line-height: inherit;
        @include mobile-only {
          font-size: rem(14);
        }
      }
    }

    &__suggestions-list-item--link {
      margin-top: 4px;
      margin-bottom: 0;
    }

    &__suggestions-list-item--textlink {
      color: $color-black-900;
      cursor: pointer;
      font-family: $font-family-secondary;
      font-weight: 600;

      &:visited {
        color: $color-black-900;
      }
      &:hover {
        color: $color-black-900;
      }
    }

    &__products-list {
      margin-bottom: 24px;

      @include desktop-up {
        display: flex;
        margin: 0 -8px;
        flex-wrap: wrap;
        align-items: stretch;
      }
    }

    &__products-list-item {
      @include desktop-up {
        width: calc(25% - 16px);
        flex-basis: calc(25% - 16px);
        margin: 0 8px;
      }
      &-more-result {
        @include desktop-up {
          background-color: $color-black-100;
          border: 1px solid $color-black-100;
          &:hover {
            background-color: $color-white;
            border: 1px solid $color-black-100;
            text-decoration: underline;
          }
        }
        &link__content {
          @include mobile-only {
            font-size: rem(16);
          }
        }
      }
    }

    &__products-list-item--link {
      @include desktop-up {
        display: flex;
        background-color: $color-white;
        text-align: center;
        justify-content: center;
        align-items: stretch;
      }

      .link {
        @include desktop-up {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  .suggestion-more-result {
    background-color: $color-white;
    border: 0px;
  }
  .more-result span{
    @include mobile-only {
      font-size: rem(14) !important;
    }
  }
</style>
