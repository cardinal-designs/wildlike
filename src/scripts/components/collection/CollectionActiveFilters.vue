<template lang="pug">
  .collection-filters(v-if="currentFilters && currentFilters.length && $mq !== 'mobile'")
    span.collection-filters__title
    .collection-filters__active-filters
      .collection-filters__active-filter(v-for="filter in currentFilters" @click="removeFilter(filter)")
        span {{splitAndDecodeFilter(filter)}}
        icon(name="close" size="10px")
      .collection-filters__filters-clear
          v-link.text-sm(v-if="currentFilters.length" :secondary="true" @click="removeAllFilters") Clear All
</template>

<script>
  import { mapState } from 'vuex'

  import { unhandleize } from 'scripts/filters/string.js'

  import Icon from '../basic/Icon.vue'
  import VLink from '../buttons/VLink.vue'

  export default {
    name: 'CollectionActiveFiltersB',
    components: { Icon, VLink },
    computed: {
      ...mapState({
        currentFilters: state => state.collections.currentFilters
      })
    },
    methods: {
      unhandleizeFilter(handleizedFilter) {
        return unhandleize(handleizedFilter)
      },
      splitAndDecodeFilter(filter) {
        return decodeURIComponent(filter.split('=')[1].replaceAll('+', ' '))
      },
      removeFilter(filter) {
        let newCurrentFilters = this.currentFilters.splice(this.currentFilters.indexOf(filter), 1)
        this.$store.dispatch('collections/updateFilters', this.newCurrentFilters)
      },
      removeAllFilters() {
        let newCurrentFilters = []
        this.$store.dispatch('collections/updateFilters', newCurrentFilters)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .collection-filters {
    display: flex;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 24px;
    margin-top: 17px;

    @include mobile-only {
      padding: 16px;
      margin-bottom: 0;
    }
    &__title {
      font-weight: bold;
      font-family: $font-family-secondary;
      margin-right: 8px;
      font-size: 14px;
      line-height: 24px;
    }
    &__active-filters {
      display: flex;
      flex-wrap: wrap;
    }
    &__active-filter {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 6px 8px;
      color: $color-black-900;
      border: 1px solid $color-black-300;
      transition: border-color 200ms ease;
      margin-right: 16px;
      margin-bottom: 8px;
      &:hover {
        border-color: $color-black-500;
      }
      &:active {
        background-color: $color-primary-200;
      }
      span {
        margin-right: 8px;
      }
    }
    &__filters-clear {
      margin-top: 4px;
    }
  }
</style>