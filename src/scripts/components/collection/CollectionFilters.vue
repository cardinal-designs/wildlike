<template lang="pug">
  //- Desktop -//
  .collection-filters(v-if="$mq !== 'mobile' && filterGroups.length")
    .collection-filters__filter-menu
      .collection-filters__filter-panels
        //- Showing the Filters
        transition-group(name="fade" :duration="{enter: 600, leave: 200}")
          .collection-filters__filter-panel(v-for="filterGroup in filterGroups" :key="filterGroup.name" v-if="!fetchingStatus.status")
            collection-accordion(:ref="`accordion${filterGroup.name}`" iconSize="16px")
              template(v-slot:heading) {{unhandleizeFilter(filterGroup.name)}}
                span.accordion__menu-title(v-if="containsCurrentFilters(filterGroup.name)")
                  |&nbsp;({{currentFilterCount(filterGroup.name)}})
              template(v-slot)
                span.collection-filters__filter-panel-clear-filters(v-if="containsCurrentFilters(filterGroup.name)" @click="clearFilterFilters(filterGroup.name)") Clear
                .collection-filters__filter-panel-filters
                  .collection-filters__filter-panel-filter(
                      v-for="filter in returnExpandedUnexpanded(filterGroup.name)"
                      :key="`${filterGroup.name}-${filter}`")
                    input.input--checkbox(
                      :id="`${filterGroup.name}-${handleizedFilter(filter)}`"
                      :value="`${filterGroup.name}-${handleizedFilter(filter)}`"
                      type="checkbox" :checked="isCurrentFilter(`${filterGroup.name}-${handleizedFilter(filter)}`)"
                      @change="updateFilterArray")
                    label(:for="`${filterGroup.name}-${handleizedFilter(filter)}`") {{filter}}
        //- Showing a loading Skeleton while loading
        fade-transition(:duration="{enter: 600, leave: 200}")
          collection-filters-skeleton(v-if="fetchingStatus.status" collection="b")
  //- Mobile -//
  .collection-filters(v-else)
    collection-active-filters
    .collection-filters__mobile-header(v-if="filters && filters.length")
    //- Showing the Filters
    fade-transition(:duration="{enter: 600, leave: 200}")
      div
        .collection-filters__filter-accordion(v-for="filterGroup in filterGroups" :key="filterGroup.name" v-if="!fetchingStatus.status")
          .collection-filters__filter-accordion-header(@click="setCurrentMobileFilter(filterGroup.name)")
            .collection-filters__filter-accordion-title.body-md
              h5.collection-filters__filter-accordion-title-span {{unhandleizeFilter(filterGroup.name)}} {{currentFilterCount(filterGroup.name) > 0 ? `(${currentFilterCount(filterGroup.name)})` : ''}}
            icon.vertical-aligned-icon(v-if="currentFilterPanel !== filterGroup.name" name="chevron-down" size="12px")
            icon.vertical-aligned-icon(v-if="currentFilterPanel === filterGroup.name" name="chevron-up" size="12px")
          collapse-transition
            .collection-filters__filter-panel-filters.column(v-if="currentFilterPanel == filterGroup.name")
              .collection-filters__filter-panel-filter(v-for="filter in filterGroup.allTags" :key="`${filterGroup.name}-${filter}`")
                input.collection-filters__filter-panel-filter-checkbox.input--checkbox(
                  :id="`${filterGroup.name}-${handleizedFilter(filter)}`"
                  :value="`${filterGroup.name}-${handleizedFilter(filter)}`"
                  type="checkbox" :checked="isCurrentFilter(`${filterGroup.name}-${handleizedFilter(filter)}`)"
                  @change="updateFilterArray")
                label.body-sm(:for="`${filterGroup.name}-${handleizedFilter(filter)}`") {{filter}}
    //- Showing a loading Skeleton while loading
    fade-transition(:duration="{enter: 600, leave: 200}")
      collection-filters-skeleton(v-if="fetchingStatus.status" collection="b")
</template>

<script>
  import { mapState } from 'vuex';
  import {FadeTransition, CollapseTransition} from 'vue2-transitions'
  import isEqual from 'lodash/isEqual';

  import { handleize, unhandleize } from 'scripts/filters/string.js'
  import { fileUrl } from 'scripts/helpers/util';
  import { scrollToId } from 'scripts/helpers/scroll.js';
  import { getCollectionCacheState } from 'scripts/helpers/collections';

  import Icon from 'scripts/components/basic/Icon.vue'
  import VLink from 'scripts/components/buttons/VLink.vue'
  import CollectionAccordion from './CollectionAccordion.vue'
  import CollectionActiveFilters from './CollectionActiveFilters.vue'
  import CollectionFiltersSkeleton from './CollectionFiltersSkeleton.vue'

  export default {
    name: 'CollectionFilters',
    components: { VLink, Icon, FadeTransition, CollapseTransition, CollectionAccordion, CollectionActiveFilters, CollectionFiltersSkeleton },
    props: {
      filters: {
        type: Array,
        required: true
      },
      tags: {
        type: Array,
        required: true
      },
      heroSettings: Object
    },
    data() {
      return {
        currentFilterArray: [],
        currentFilterPanel: "",
        filterPanelOpen: false,
        expandedFilters: [],
        currentFilterArrayModCount: 0,
      }
    },
    computed: {
      ...mapState({
        currentFilters: state => state.collections.currentFilters,
        currentHandle: (state) => state.collections.currentHandle,
        currentTags: state => state.collections.currentTags,
        fetchingStatus: state => state.collections.fetchingStatus,
      }),
      splitTags() {
        return this.currentTags.map((tag) => {
          const valueArray = tag.split('::')
          return {tag: handleize(valueArray[0]), value: valueArray[1]}
        })
      },
      filterGroups() {
        let filterGroups = []
        this.filtersWithoutDuplicates.forEach(filter => {
          let filterGroup = {
            name: filter,
            allTags: []
          }

          this.splitTags.forEach(tag => {
            if (tag.tag === filter && tag.value) {
              filterGroup.allTags.push(tag.value)
            }
          })

          if (filter === 'price') {
            filterGroup.allTags.sort((a,b) => {
              let valA = parseInt(a.slice(1));
              let valB = parseInt(b.slice(1));

              return (isNaN(valA) ? 0 : valA) - (isNaN(valB) ? 0 : valB);
            });
          }

          if (filterGroup.allTags.length > 0) {
            filterGroups.push(filterGroup)
          }
        })
        return filterGroups
      },
      currentFilterArrayUnhandelized() {
        return this.currentFilterArray.map(filter => {
          return unhandleize(filter)
        })
      },
      filtersWithoutDuplicates() {
        let filters = [...new Set(this.filters)]
        return filters
      }
    },
    methods: {
      updateFilterArray(e) {
        const { value } = e.target
        // if the user click on a already selected filter
        if (this.currentFilterArray.indexOf(value) >= 0) {
          // Capturing the current selected filters
          let newFilters = this.currentFilters
          // Creating the new filter array
          newFilters = newFilters.filter(filter => !filter.startsWith(value))
          // removing the checkbox
          this.removeFilter(value)
          // updating the filters in the $store
          this.$store.dispatch('collections/updateFilters', newFilters)
        } else {
          scrollToId(null, '#shopify-section-collection-grid');
          this.currentFilterArray = [...this.currentFilterArray, value]
        }
      },
      unhandleizeFilter(handleizedFilter) {
        return unhandleize(handleizedFilter)
      },
      handleizedFilter(unhandelizedFilter) {
        return handleize(unhandelizedFilter, false)
      },
      removeFilter(filter) {
        this.currentFilterArray.splice(this.currentFilterArray.indexOf(filter), 1)
      },
      removeAllFilters() {
        this.currentFilterArray = []
      },
      setCurrentFilterPanel(filter) {
        if (this.currentFilterPanel === filter) {
          this.currentFilterPanel = ""
          this.$forceUpdate()
          this.filterPanelOpen = !this.filterPanelOpen
        } else if (!this.filterPanelOpen) {
          this.currentFilterPanel = filter
          this.$forceUpdate()
          this.filterPanelOpen = !this.filterPanelOpen
        } else {
          this.currentFilterPanel = filter
          this.$forceUpdate()
        }
      },
      setCurrentMobileFilter(filter) {
        if(filter === this.currentFilterPanel) {
          this.currentFilterPanel = ""
          this.$forceUpdate()
        } else {
          this.currentFilterPanel = filter
          this.$forceUpdate()
        }
      },
      isUseableFilter(currentFilter) {
        return this.splitTags.some(filter => {return filter.tag === currentFilter})
      },
      getMobilePanelFilters(filterName) {
        if (this.currentFilters.length) {
          let filters = this.currentFilters.map(filter => {
            if (filter.includes(filterName) && !filter.includes(`-${filterName}`)) {
              return filter
            } return ''
          })

          let activeFilters = filters.filter(filter => filter !== "")

          if (activeFilters.length) {
            let unhandelizedFilters = activeFilters.map(filter => {
              let replacedFilter = filter.replace(`${filterName}`, '')
              return unhandleize(replacedFilter)
            })
            let joinedFilters = unhandelizedFilters.join(', ').slice(0,30)
            return `${joinedFilters}${joinedFilters.length >= 30 ? '...' : ''}`
          } return ''
        } return ''
      },
      containsCurrentFilters(filterName) {
        if (this.currentFilters && this.currentFilters.length)
          return this.currentFilters.some(filter => filter.startsWith(filterName) && this.currentTags.some((tag) => {
          const valueArray = tag.split('::')
          return handleize(tag) == filter && handleize(valueArray[0]) == filterName
        }))
      },
      // currentFilterCount(filterName) {
      //   return this.currentFilters.filter(filter => filter.startsWith(filterName)).length
      // },
      currentFilterCount(filterName) {
        return this.currentFilters.filter(filter => filter.startsWith(filterName) && this.currentTags.some((tag) => {
          const valueArray = tag.split('::')
          return handleize(tag) == filter && handleize(valueArray[0]) == filterName
        })).length
      },
      clearFilterFilters(filterName) {
        let newCurrentFilters = this.currentFilters
        newCurrentFilters = newCurrentFilters.filter(filter => !filter.startsWith(filterName))
        this.$store.dispatch('collections/updateFilters', newCurrentFilters)
      },
      toggleExpand(filterName, ref) {
        let currentFilterIndex = this.expandedFilters.findIndex(filter => filter.name === filterName)
        this.expandedFilters[currentFilterIndex].expanded = !this.expandedFilters[currentFilterIndex].expanded
        this.$refs[ref][0].addMaxHeight()
      },
      isExpanded(filterName) {
        let currentFilterIndex = this.expandedFilters.findIndex(filter => filter.name === filterName)
        return this.expandedFilters[currentFilterIndex].expanded
      },
      returnExpandedUnexpanded(filterName) {
        let filterIndex = this.filterGroups.findIndex(filter => filter.name === filterName)
        return this.filterGroups[filterIndex].allTags
      },
      isCurrentFilter(filterName) {
        return this.currentFilterArray.includes(filterName);
      },
    },
    watch: {
      currentFilterArray() {
        this.currentFilterArrayModCount++;
        // Avoid running on init if loaded from cache
        let cacheState = getCollectionCacheState(this.currentHandle);

        if(cacheState.currentScrollPos == -1) {
          this.$store.dispatch('collections/updateFilters', this.currentFilterArray);
        }
      },
      currentFilters() {
        if (isEqual(this.currentFilters, this.currentFilterArray)) return;
        this.currentFilterArray = [...this.currentFilters]
      }
    },
    mounted() {
      this.unsubscribe = this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateFilters') {
          this.currentFilterArray = [...this.currentFilters]
        }
      })
      this.currentFilterArray = [...this.currentFilters];
    },
    created() {
      let expandedFilters = this.filterGroups.map((filterGroup => {
        return {
          "name": filterGroup.name,
          "expanded": false
        }
      }))
      this.expandedFilters = expandedFilters
    },
    beforeDestroy() {
      this.unsubscribe()
    }
  }
</script>

<style scoped lang="scss">
  .collection-filters {
    margin-left: auto;
    @include mobile-only {
      margin-left: 0;
    }
    &__filter-menu {
      &-item {
        width: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: transform 300ms ease-in-out, color 200ms ease;
        span {
          margin-right: 4px;
          -webkit-font-smoothing: antialiased;
        }
        /deep/ .icon {
          transition: transform 300ms ease-in-out, color 200ms ease;
        }
        &:hover {
          /deep/ .icon {
            transform: translate3d(0,-1px,0);
          }
        }
      }
      &-item.panel-active {
        position: relative;
        color: $color-brand-primary;
        /deep/ .icon {
          fill: $color-brand-primary;
          transform: rotate(-180deg);
        }
        &::after {
          position: absolute;
          left: 45%;
          bottom: -18px;
          content: '';
          width: 24px;
          height: 16px;
          background: $color-white;
          -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      }
      @media(max-width: 1260px) {
        margin-top: 0;
        margin-bottom: 16px;
        justify-content: center;
        &-item {
          margin-left: 0;
          margin-right: 40px;
        }
        &-item:last-child {
          margin-right: 0;
        }
      }
    }
    &__current-filter-count {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      font-size: 10px;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background-color: $color-accent-5;
      color: $color-black-900;
      padding: 4px;
      border-radius: 100%;
    }
    &__filter-panel-clear-filters {
      display: block;
      margin-bottom: 16px;
      cursor: pointer;
      color: $color-accent-2-700;
      &:hover {
        text-decoration: underline;
      }
    }
    &__filter-panel {
      border-bottom: 1px solid $color-black-300;
      &-filters {
        display: flex;
        flex-direction: column;
      }
      &-filter-color-swatch {
        display: flex;
        width: 100%;
        &-checkbox {
          margin: 0;
          border-radius: 100%;
          width: 24px;
          height: 24px;
          background-size: 150%;
          background-position: center;
          border-color: rgba(0,0,0,0.1);
          flex-shrink: 0;
          @include ie {
            &::-ms-check {
              display: none;
            }
          }
          // sorry for the important here, but the default input in the UI kit sets backgoround position to '0 0' and makes it look like the background of the swatch is moving. I didn't want to change that and break something else somewhere. This was a necessary important.
          &:hover {
            background-position: center !important;
          }
          &:checked {
            background: none;
            background-size: 150%;
            background-position: center;
            border: 1px solid $color-brand-primary;
            &::after {
              display: block;
              background-image: none;
              width: 100%;
              height: 100%;
              border-radius: 100%;
              border: 3px solid white;
              top: 0%;
              left: 0%;
            }
          }
        }
        label {
          font-size: 1rem;
          margin-top: 2px;
          padding-bottom: 16px;
          padding-left: 8px;
        }
      }
      &-filter {
        display: flex;
        align-items: center;
        max-width: 220px;
        width: 100%;
        margin-bottom: 16px;
        &-checkbox {
          flex-shrink: 0;
        }
        label {
          font-size: rem(16);
        }
      }
    }
    &__filter-accordion {
      padding: 16px;
      border-bottom: 1px solid $color-black-100;
      &-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      &-title {
        &-span {
          font-family: $font-family-primary;
          font-size: rem(18);
          font-style: italic;
          font-weight: 900;
          letter-spacing: 2.3px;
          line-height: 24px;

        }
        &-active-filters {
          color: $color-util-ui-grey;
          margin-left: 8px;
        }
      }
      .collection-filters__filter-panel-filters {
        padding: 0;
        justify-content: space-between;
        font-size: 12px;
        line-height: 20px;
        @include mobile-tablet {
          padding: 24px 0 0;
          display: flex;
          &.row {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
          }
        }
      }
      .collection-filters__filter-panel-filter-color-swatch {
        width: 100%;
        max-width: 140px;
        margin: 0 10px;
        text-align: left;
        flex-direction: row;
        &-checkbox {
          margin-right: 8px;
        }
        @include mobile-tablet {
          width: calc(50% - 20px);
          max-width: none;
        }
      }
    }
    .collection-filters__filter-panel-filter {
      input {
        flex: 0 0 auto;
      }

      label {
        font-size: rem(16);
      }
    }
    &__active-filters {
      padding-top: 16px;
      display: flex;
      flex-wrap: wrap;
      @include mobile-only {
        padding: 12px;
      }
    }
    &__active-filter {
      display: flex;
      align-items: center;
      margin-right: 20px;
      padding-bottom: 12px;
      cursor: pointer;
      user-select: none;
      /deep/ .icon {
        transition: transform 200ms ease;
      }
      &:hover {
        /deep/ .icon {
          transform: scale3d(0.8,0.8,0.8);
        }
      }
    }
    &__filters-clear {
      cursor: pointer;
    }
    &__mobile-header {
      padding: 8px 16px;
      width: 100%;
    }
    &__filter-panel-filters-show-more-less {
      display: inline-block;
      font-size: 16px;
      letter-spacing: 0;
      line-height: 19px;
      color: $color-brand-primary;
      margin-bottom: 8px;
      cursor: pointer;
      &-chevron {
        margin-left: 8px;
      }
      /deep/ .icon {
        fill: $color-brand-primary;
      }
    }
  }
  .vertical-aligned-icon {
    margin-top: 7px;
  }
</style>
