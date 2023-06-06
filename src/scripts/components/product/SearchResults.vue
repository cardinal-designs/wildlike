
<template lang="pug">
    .container
      h1.search-results__header Search for products on our site
      text-input(v-model="searchTerm", label="Search all products", :hide-label="true", placeholder="")
      transition(name="fade")
        div(v-if="hasSearch")
          h1.search-results__header {{ searchResults.length }} results for "{{ searchTerm }}"
          transition(name="fade")
            .search-results.collection-grid(v-if="searchResults.length > 0")
              .row.small-up-1.medium-up-4
                .column(v-for="item in searchResults")
                  product-tile(
                    :title="item.title"
                    :tagline="item.tagline"
                    :url="item.url"
                    :image="item.image"
                    :hover-image="item.hoverImage"
                    :image-alt="item.imageAlt"
                    :price="item.price"
                    :remaining-quantity="item.remainingQuantity"
                  )
</template>

<script>
  import Fuse from 'fuse.js'
  import { mapState } from 'vuex'
  import { allProductsHandle } from 'scripts/config/collections.js'

  import ProductTile from 'scripts/components/product/ramsay/ProductTile.vue'
  import TextInput from 'scripts/components/forms/TextInput.vue'

  export default {
    name: 'SearchResults',
    components: { ProductTile, TextInput },
    props: {
      search: String
    },
    data () {
      return {
        searchTerm: this.search
      }
    },
    computed: {
      ...mapState({
        allCollections: state => state.collections.all
      }),
      collection () {
        return this.allCollections.find(collection => collection.handle === allProductsHandle)
      },
      searchResults () {
        let query = this.searchTerm.toLowerCase()

        let fuse = new Fuse(this.collection.products, {
          tokenize: true,
          keys: ['title', 'keywords']
        })

        return fuse.search(query)
      },
      hasSearch () {
        return this.searchTerm !== '' && Boolean(this.collection)
      }
    },
    mounted () {
      if (!this.collection) this.$store.dispatch('collections/addCollection', allProductsHandle)
    }
  }
</script>

<style scoped lang="scss">
  .search-results {
    &__header {
      font-size: rem(24);
      margin-bottom: 1em;
      text-align: center;
      color: $color-black-900;

      @include tablet-up {
        font-size: rem(36);
        text-align: left;
      }
    }
  }
</style>
