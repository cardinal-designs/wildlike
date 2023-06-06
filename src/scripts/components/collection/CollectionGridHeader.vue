
<template lang="pug">
  //- Desktop
  .collection-grid-header(v-if="$mq !== 'mobile' && $mq !== 'tablet'")
    .collection-grid-header__sort-pagination-total-wrapper
      collection-total-results
      collection-sorting.sorting(v-if="$mq === 'tablet' || !filtersDisabled" :default-sort="defaultSort" :value="currentSort")
  //- Mobile
  div(ref="filterAndSortButtons" v-else)
    .collection-grid-header__mobile( :class="{ 'collection-grid-header__mobile--fixed': fixedMobileHeader , 'zindex30': mobileFiltersMenuActive || mobileSortingMenuActive }" )
      .container
        .collection-grid-header__mobile-menu
          .collection-grid-header__mobile-menu-button.button--primary(v-if="!filtersDisabled && filters && filters.length > 0" @click="toggleMobileFiltersMenu")
              .h6(v-if="currentFilters.length > 0")
                |FILTERS
                |&nbsp;({{currentFilters.length}})
              .h6(v-else) FILTERS
          .collection-grid-header__mobile-menu-button.button--secondary(@click="toggleMobileSortingMenu" :style="(filters && filters.length > 0) ? '' : 'width: 100%'")
              .h6 SORT
        .collection-grid-header__mobile-menu-results-wrapper
          collection-total-results
        collection-mobile-menu(:menu-active="mobileFiltersMenuActive" :close-binding="toggleMobileFiltersMenu" :enable-apply-button="true" :enable-clear-all="true" menu-title="Filters" :hero-settings="heroSettings")
          collection-filters.collection-grid__filters(:tags="tags" :filters="filters" :hero-settings="heroSettings")
        collection-mobile-menu(:menu-active="mobileSortingMenuActive" :close-binding="toggleMobileSortingMenu" menu-title="Sort By")
          collection-sorting(:default-sort="defaultSort" :mobile-click-binding="toggleMobileSortingMenu" :value="currentSort")

</template>

<script>
  import { mapState } from 'vuex'

  import Icon from 'scripts/components/basic/Icon.vue'
  import Accordion from '../basic/Accordion.vue'
  import VLink from '../buttons/VLink.vue'
  import CollectionTotalResults from 'scripts/components/collection/CollectionTotalResults.vue'
  import CollectionPaginationControls from 'scripts/components/collection/CollectionPaginationControls.vue'
  import CollectionFilters from 'scripts/components/collection/CollectionFilters.vue'
  import CollectionSorting from 'scripts/components/collection/CollectionSorting.vue'
  import CollectionMobileMenu from 'scripts/components/collection/CollectionMobileMenu.vue'
  import { unhandleize } from '../../filters/string.js'

  export default {
    name: 'CollectionGridHeader',
    components: {
      Icon,
      Accordion,
      VLink,
      CollectionTotalResults,
      CollectionPaginationControls,
      CollectionFilters,
      CollectionSorting,
      CollectionMobileMenu },
    props: {
      paginationAmount: {
        type: Number,
        required: true
      },
      totalPages: {
        type: Number,
        required: true
      },
      tags: {
        type: Array,
        required: true
      },
      filters: {
        type: Array,
        required: true
      },
      defaultSort: {
        type: String,
        required: true
      },
      filtersDisabled: {
        type: Boolean,
        default: false
      },
      collectionMenuTitle: String,
      globalMenu: Array,
      collectionMenu: Array,
      heroSettings: Object
    },
    data() {
      return {
        mobileFiltersMenuActive: false,
        mobileSortingMenuActive: false,
        scrolled: false,
        fixedMobileHeader: false
      }
    },
    computed: {
      ...mapState({
        currentSort: state => state.collections.currentSort,
        currentFilters: state => state.collections.currentFilters
      })
    },
    methods: {
      toggleMobileFiltersMenu() {
        this.mobileFiltersMenuActive = !this.mobileFiltersMenuActive
      },
      toggleMobileSortingMenu() {
        this.mobileSortingMenuActive = !this.mobileSortingMenuActive
      },
      unhandleizeTitle(handleizedFilter) {
        return unhandleize(handleizedFilter)
      },
      onSortandFilterHidden () {
        const filterAndSortButtons = this.$refs.filterAndSortButtons;
        if (filterAndSortButtons) {
          let distanceToTop = this.$refs.filterAndSortButtons.getBoundingClientRect().y;
          this.fixedMobileHeader = distanceToTop < 128;
        }
      }
    },
    created () {
      window.addEventListener('scroll', this.onSortandFilterHidden);
    },
    destroyed () {
      window.removeEventListener('scroll', this.onSortandFilterHidden);
    }
  }
</script>

<style scoped lang="scss">
  .collection-grid-header {
    position: relative;
    margin-top: 24px;
    border-bottom: 1px solid $color-black-300;
    border-top: 1px solid $color-black-300;
    padding: 14px 0;

    &__sort-pagination-total-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__pagination-with-total {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 16px;
      .sorting {
        margin-right: 20px;
      }
    }
    &__mobile {
      width: 100%;
      &-menu {
        display: flex;
        flex-direction: row;
        &-button {
          font-weight: 500;
          padding: 9px 9px 11px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 2;
          margin: 0 4px;

          &:first-child {
            margin-left: 0px;
          }
          &:last-child {
            margin-right: 0px;
          }

          cursor: pointer;
          &:nth-of-type(1) {
            border-top: 1px solid $color-black-100;
          }
          &:nth-of-type(2) {
            border: 1px solid $color-black-100;
            border-left: none;
            border-right: none;
          }
        }
        /deep/ .icon {
          margin-right: 8px;
        }
        &-results-wrapper {
          border-bottom: 1px solid $color-black-100;
          width: 100%;
          padding: 16px 0;
        }
      }
    }
  }
  .collection-mobile-accordion {
    min-width: 204px;
    &__global-menu {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
      padding: 0 16px;

      &:last-child {
        padding-bottom: 16px;
      }

      .top-level {
        border-bottom: 1px solid $color-grey;
        padding: 12px 0 6px;
        font-weight: 600;
        color: $color-black-900;
      }
      .collection-mobile-accordion__custom-menu-item {
        color: $color-black-900;
        font-size: 12px;
        font-family: $font-family-primary;
      }

      > a:visited {
        color: $color-black-900;
      }
    }
    &__custom-menu {
      display: flex;
      flex-direction: column;
      padding: 0 16px;

      &:last-child {
        padding-bottom: 16px;
      }

      .top-level {
        border-bottom: 1px solid $color-grey;
        margin-bottom: 8px;
        padding: 12px 0 6px;
        font-weight: 600;
        color: $color-black-900;
      }
      .collection-mobile-accordion__custom-menu-item {
        color: $color-black-900;
        font-size: 12px;
        font-family: $font-family-primary;
        margin-bottom: 8px;
      }
    }
  }
  .remove-bottom-spacing {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }
  /deep/ .accordion__menu-title {
    font-family: $font-family-primary;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.5px;
    line-height: 20px;
  }

  .button--secondary {
    background-color: $color-black-200;
  }

  .collection-grid-header__mobile--fixed {
    position: fixed;
    top: 104px;
    background-color: $color-white;
    padding-top: 24px;
    @include desktop-up {
      z-index: 31;
    }
  }
  .collection-filters.collection-grid__filters {
    @include mobile-only {
      margin-bottom: 84px;
    }
  }

  .collection-grid-header__mobile {
    @include mobile-only {
      z-index: 29;
    }
  }

  // This class is triggered when the filter or sort panel is open to prevent the menu to show on scroll
  .zindex30 {
    @include mobile-only {
      z-index: 30;
    }

  }
</style>
