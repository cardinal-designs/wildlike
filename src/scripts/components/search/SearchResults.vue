<template lang="pug">
  .search-results
    search-results-tabs(v-on:change-tab="changeTab")
    search-results-grid(
      :search-results="searchResults"
      :current-tab="currentTab"
      :search-term="term"
      :search-cta-settings="searchCtaSettings"
    )
</template>

<script>
  import { mapState } from 'vuex'
  import SearchResultsTabs from './SearchResultsTabs.vue'
  import SearchResultsGrid from './SearchResultsGrid.vue'

  export default {
    name: 'SearchResults',
    components: { SearchResultsTabs, SearchResultsGrid },
    props: {
      searchResults: {
        type: Object,
        default: () => ({
          products: Array,
          articles: Array,
          pages: Array
        })
      },
      term: String,
      searchPerformed: Boolean,
      searchCtaSettings: Object
    },
    data() {
      return {
        currentTab: 'products'
      }
    },
    methods: {
      changeTab(tab) {
        this.currentTab = tab
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-results {
    
  }
</style>