
<template lang="pug">
  .collection-total-results
    .collection-total-result.body-sm.font-italic {{currentTotal}} {{results}}
    .collection-total-result.collection-total-result-filters(v-if="currentFilters && currentFilters.length > 0")
      span.body-sm.font-italic {{currentFilters.length}} {{filters}}
      v-link.clear-all.body-sm(v-if="currentFilters.length && $mq == 'mobile'" :secondary="true" @click="removeAllFilters") Clear All
</template>

<script>
  import { mapState } from 'vuex';
  import VLink from 'scripts/components/buttons/VLink.vue'

  export default {
    name: 'CollectionTotalResults',
    components: {
      VLink
    },
    computed: {
      ...mapState({
        currentTotal: state => state.collections.currentTotal,
        currentFilters: state => state.collections.currentFilters
      }),
      results() {
        if (this.currentTotal === 1) {
          return 'Result'
        } else {
          return 'Results'
        }
      },
      filters() {
        if (this.currentFilters.length === 1) {
          return 'Filter'
        } else {
          return 'Filters'
        }
      }
    },
    methods: {
      removeAllFilters() {
        let newCurrentFilters = []
        this.$store.dispatch('collections/updateFilters', newCurrentFilters)
      }
    }
  }
</script>

<style scoped lang="scss">

  .collection-total-results {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .collection-total-result {
    margin-right: 16px;
    vertical-align: middle;
    @include mobile-only {
      display: block;
      width: 100%;
      margin: 0;
    }
    &.italicized {
      @include mobile-only {
        font-style: italic;
      }
    }
  }

  .collection-total-result-filters{
    text-align: right;
  }

  .font-italic {
    font-style: italic;
  }

  .clear-all {
    margin-left: 16px;
    text-decoration: underline;
  }

</style>