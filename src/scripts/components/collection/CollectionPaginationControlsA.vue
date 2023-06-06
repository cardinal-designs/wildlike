
<template lang="pug">
  .collection-pagination-controls.body-md
    .collection-pagination-controls-icons(v-if="pages !== 1")
      icon.collection-pagination-controls__disabled-prev(v-if="currentPage === 1" name="minus" size="12px")
      icon.collection-pagination-controls__arrow-prev(v-if="currentPage !== 1" @click="prevPage" name="chevron-left" size="12px")
    span.collection-pagination-controls__pages {{currentPage}} / {{pages}}
    .collection-pagination-controls-icons(v-if="pages !== 1")
      icon.collection-pagination-controls__arrow-next(v-if="currentPage !== pages" @click="nextPage" name="chevron-right" size="12px")
      icon.collection-pagination-controls__disabled-next(v-if="currentPage === pages" name="minus" size="12px")
</template>

<script>
  import { mapState } from 'vuex';

  import { scrollToTopBottom } from 'scripts/helpers/scroll.js'

  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'CollectionPaginationControlsA',
    components: { Icon },
    props: {
      initPages: {
        type: Number,
        required: true
      },
      bottomPagination: {
        type: Boolean,
        default: false
      },
      paginationAmount: {
        type: Number,
        required: true
      }
    },
    computed: {
      ...mapState({
        currentPage: state => state.collections.currentPage,
        currentTotal: state => state.collections.currentTotal
      }),
      pages() {
        if (this.currentTotal < this.paginationAmount) {
          return 1
        } else {
          return this.initPages
        }
      }
    },
    methods: {
      prevPage() {
        if(this.currentPage !== 1) {
          this.$store.dispatch('collections/updatePage', (this.currentPage - 1))
          if(this.bottomPagination) {
            scrollToTopBottom('top')
          }
        }
      },
      nextPage() {
        if(this.currentPage !== this.pages) {
          this.$store.dispatch('collections/updatePage', (this.currentPage + 1))
          if(this.bottomPagination) {
            scrollToTopBottom('top')
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .collection-pagination-controls {
    display: flex;
    align-items: center;
    user-select: none;
    &__arrow-prev , &__arrow-next {
      cursor: pointer;
    }
    &__arrow-prev, &__disabled-prev {
      margin-right: 20px;
    }
    &__arrow-next, &__disabled-next {
      margin-left: 20px;
    }
    &__disabled-prev, &__disabled-next {
      fill: $color-grey;
    }
  }
</style>