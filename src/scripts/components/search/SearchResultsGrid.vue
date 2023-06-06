<template lang="pug">
  .search-results-grid-wrapper
    .search-results-grid.container
      .search-results-grid__total(v-if="currentResults.length > 0")
        span {{resultsText}}
      fade-transition(:duration="{enter: 1000, leave: 300}" group)
        .search-results-grid__no-results(v-if="currentResults && currentResults.length < 1" key="noresults")
          h3 There are no {{currentTab.slice(0, -1)}} results for "{{searchTerm}}"
          .search-results-grid__no-results-other-results(v-if="totalResults")
            p.search-results-grid__no-results-other-results Other Results:
              span(v-if="totalProducts") {{`${totalProducts} ${totalProducts > 1 ? 'products' : 'product'}`}}{{`${totalArticles || totalPages ? ',' : ''}`}}
              span(v-if="totalArticles") {{`${totalArticles} ${totalArticles > 1 ? 'articles' : 'article'}`}}{{`${totalPages ? ',' : ''}`}}
              span(v-if="totalPages") {{`${totalPages} ${totalPages > 1 ? 'pages' : 'page'}`}}
          v-button.search-results-grid__no-results-button.button.button--primary(:class="searchCtaSettings.cta" :href="searchCtaSettings.url" tag="a") {{searchCtaSettings.text}}
        .search-results-grid__products.grid(v-if="currentTab === 'products' && currentResults.length >=1" key="products")
          search-results-tile(v-for="product in paginatedResults" :data="product" :tileType="currentTab" :key="product.id")
        .search-results-grid__articles.grid(v-if="currentTab === 'articles' && currentResults.length >=1" key="articles")
          search-results-tile(v-for="article in paginatedResults" :data="article" :tileType="currentTab" :key="article.url")
        .search-results-grid__pages.grid.body-md(v-if="currentTab === 'pages' && currentResults.length >=1" key="pages")
          search-results-tile(v-for="page in paginatedResults" :data="page" :tileType="currentTab" :key="page.url")
      search-results-pagination-controls(v-on:go-to-page="goToPage" :pages="currentTotalPages" :pagination-amount="paginationAmount" :current-page="currentPage")
</template>

<script>
  import {FadeTransition} from 'vue2-transitions'

  import VButton from '../buttons/VButton.vue'

  import SearchResultsTile from './SearchResultsTile.vue'
  import SearchResultsPaginationControls from './SearchResultsPaginationControls.vue'

  export default {
    name: "SearchResultsGrid",
    components: { FadeTransition, VButton, SearchResultsTile, SearchResultsPaginationControls },
    props: {
      currentTab: {
        type: String,
        default: "products"
      },
      searchResults: {
        type: Object,
        required: true
      },
      searchTerm: {
        type: String,
        required: true
      },
      searchCtaSettings: Object
    },
    data() {
      return {
        currentResults: [],
        currentPage: 1,
        resultsText: '',
        paginatedResults: [],
        paginationAmount: 25,
      }
    },
    computed: {
      currentTotalPages() {
        let total = Math.ceil(this.currentResults.length / this.paginationAmount)
        return total >= 1 ? total : 1
      },
      totalProducts() {
        return this.searchResults.products.length
      },
      totalArticles() {
        return this.searchResults.articles.length
      },
      totalPages() {
        return this.searchResults.pages.length
      },
      totalResults() {
        return this.totalProducts + this.totalArticles + this.totalPages
      }
    },
    watch: {
      currentTab() {
        this.currentResults = this.searchResults[this.currentTab]
        this.getResultsText()
        this.goToPage(1)
      }
    },
    methods: {
      getResultsText() {
        let results = this.currentResults.length
        if (results > 1) {
          this.resultsText = `Showing ${results} ${this.currentTab.slice(0, -1)} results for "${this.searchTerm}"`
        }
        if (results === 1) {
          this.resultsText = `Showing ${results} ${this.currentTab.slice(0, -1)} result for "${this.searchTerm}"`
        }
        if (!results) {
          this.resultsText = `Showing 0 ${this.currentTab.slice(0, -1)} results for "${this.searchTerm}"`
        }
      },
      goToPage(page) {
        let start = (page - 1) * this.paginationAmount;
        let end = start + this.paginationAmount
        let paginatedResults = this.currentResults.slice(start, end)
        this.paginatedResults = paginatedResults
        this.currentPage = page
      }
    },
    mounted() {
      this.currentResults = this.searchResults[this.currentTab]
      this.getResultsText()
      this.goToPage(1)
    }
  }
</script>

<style lang="scss" scoped>
  .search-results-grid-wrapper {
    background-color: $color-white;
  }
  .search-results-grid {
    &__total{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 30px;
      margin-bottom: 16px;
      span {
        font-size: 16px;
        line-height: 24px;
        font-family: $font-family-secondary;
        font-weight: 600;
      }
    }
    &__no-results {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      min-height: 30vh;
      h4 {
        margin-bottom: 16px;
      }
      span {
        margin-left: 4px;
      }
      &-button {
        margin-top: 31px;
      }
    }
    &__no-results-other-results{
      margin-top: 16px;
      margin-bottom: 16px;
      font-family: $font-family-secondary;
      font-weight: 600;

      span {
        font-family: $font-family-secondary;
        font-weight: 600;
      }
    }
    .grid {
      display: flex;
      flex-wrap: wrap;
      /deep/ .search-results-tile {
        width: 100%;
        display: inline-block;
        vertical-align: top;

        @include mobile-only {
          margin-bottom: 16px;
        }

        @include desktop-up {
          width: 261px;
          margin-right: 16px;
          margin-bottom: 16px;
        }
      }
      /deep/ .search-results-tile.product {
        width: 100%;
        display: inline-block;
        vertical-align: top;

        @include mobile-only {
          width: calc(50% - (28px / 2));
          margin-right: 28px;
          margin-bottom: 10px;
          &:nth-child(2n) {
            margin-right: 0;
          }
        }

        @include desktop-up {
          width: 261px;
          margin-right: 16px;
          margin-bottom: 20px;
          &:nth-child(5n) {
            margin-right: 0;
          }
        }
      }
    }

  }
</style>
