
<template lang="pug">
  .navbar__search-results
    transition(name="fade", mode="out-in")
      ul.navbar__search-results__suggestions(v-if="search.length === 0", key="suggestions")
        li.navbar__search-results__suggestions__title Suggested
        li.navbar__search-results__suggestions__item(v-for="suggestion in suggestions", :key="suggestion") 
          a(href="#", @keydown.tab="tabOut(suggestion)", @click.prevent="$emit('selected', suggestion)") {{ suggestion }}
      .navbar__search-results__results(v-else, key="results")
        .navbar__search-results__results__info
          p.navbar__search-results__results__info__title {{ searchResults.length }} Results for #[strong {{ search }}]
          p.navbar__search-results__results__info__subtitle(v-if="searchResults.length > 0") Press enter to see all results
        .navbar__search-results__results__products
          .row.small-up-1.medium-up-3
            .column(v-for="product in searchResults", :key="product.id")
              product-tile(
                :title="product.title",
                :image="product.image",
                :image-alt="product.imageAlt",
                :price="product.price",
                :tagline="product.tagline",
                :url="product.url",
                :disable-hover="true"
              )
</template>

<script>
  import Fuse from 'fuse.js'
  import { mapState } from 'vuex'
  import { allProductsHandle } from 'scripts/config/collections.js'

  import storeCollection from 'scripts/mixins/storeCollection.js'

  import ProductTile from 'scripts/components/product/ProductTile.vue'

  export default {
    name: 'NavbarSearchResults',
    mixins: [ storeCollection ],
    components: { ProductTile },
    props: {
      search: String,
      suggestions: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      searchResults () {
        let query = this.search.toLowerCase()

        let fuse = new Fuse(this.collection.products, {
          tokenize: true,
          keys: ['title', 'keywords']
        })

        return fuse.search(query).slice(0, 3)
      }
    },
    methods: {
      tabOut (suggestion) {
        let lastSuggestion = this.suggestions[this.suggestions.length - 1]
        if (suggestion === lastSuggestion) {
          this.$emit('close-results')
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .navbar__search-results {
    display: flex;
    flex-grow: 1;

    &__suggestions {
      list-style: none;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      padding: 0;

      &__title,
      &__item {
        font-weight: bold;
      }

      &__title {
        font-size: rem(18);
        line-height: 1;
      }

      &__item {
        font-size: rem(24);
        line-height: 1.375;

        @include tablet-up {
          margin-left: 40px;
        }

        @include desktop-up {
          margin-left: 72px;
        }

        > a:hover {
          color: $color-brand-primary;
        }
      }
    }

    &__results {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      @include desktop-up {
        flex-wrap: nowrap;
      }

      &__info {
        width: 100%;
        text-align: center;
        margin-bottom: 10px;

        @include desktop-up {
          width: auto;
          margin-right: auto;
          text-align: left;
          margin-bottom: 0;
        }

        &__title {
          font-size: rem(24);
          line-height: 1.375;
        }

        &__subtitle {
          font-size: rem(18);
        }
      }

      &__products {
        width: 750px;

        @include desktop-up {
          width: 850px;
        }

        > .row {
          justify-content: center;

          @include desktop-up {
            justify-content: flex-start;
          }
        }

        .column {
          padding-bottom: 0;
        }
      }
    }
  }
</style>