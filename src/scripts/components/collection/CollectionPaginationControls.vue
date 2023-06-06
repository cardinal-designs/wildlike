
<template lang="pug">
  .collection-pagination-controls.body-md
    .collection-pagination-controls-icons(v-if="pages !== 1")
      icon.collection-pagination-controls__disabled-prev(v-if="currentPage === 1" name="arrow-right" size="24px")
      icon.collection-pagination-controls__arrow-prev(v-if="currentPage !== 1" @click="prevPage" name="arrow-right" size="24px")
    .collection-pagination-controls__pages(@click="toggleNav") Page {{currentPage}} of {{pages}}
      icon.collection-pagination-controls__page-nav-caret(
        v-if="pages > 1"
        :class="{'flipped': pageNavActive}"
        name="caret-down"
        size="8px")
      fade-transition(:duration="{enter: 200, leave: 200}")
        .collection-pagination-controls__page-nav(v-if="pageNavActive")
          .collection-pagination-controls__page-nav-inner
            .collection-pagination-controls__page-nav-button(
              v-for="(page, index) in pages"
              @click="goToPage(page)")
              span.current-page(v-if="page === currentPage") page {{ page }}
                icon(name="checkmark_small" size="10px")
              span(v-else) page {{ page }}
    .collection-pagination-controls-icons(v-if="pages !== 1")
      icon.collection-pagination-controls__arrow-next(v-if="currentPage !== pages" @click="nextPage" name="arrow-right" size="24px")
      icon.collection-pagination-controls__disabled-next(v-if="currentPage === pages" name="arrow-right" size="24px")
</template>

<script>
  import { mapState } from 'vuex';

  import { scrollToId } from 'scripts/helpers/scroll.js'

  import {FadeTransition} from 'vue2-transitions'

  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'CollectionPaginationControls',
    components: { Icon, FadeTransition },
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
    data() {
      return {
        pageNavActive: false
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
          scrollToId(null, '#shopify-section-collection-grid');
        }
      },
      nextPage() {
        if(this.currentPage !== this.pages) {
          this.$store.dispatch('collections/updatePage', (this.currentPage + 1))
          scrollToId(null, '#shopify-section-collection-grid');
        }
      },
      toggleNav() {
        this.pageNavActive = !this.pageNavActive
      },
      goToPage(pageNumber) {
        this.$store.dispatch('collections/updatePage', (pageNumber))
        scrollToId(null, '#shopify-section-collection-grid');
      }
    }
  }
</script>

<style scoped lang="scss">
  .collection-pagination-controls {
    display: flex;
    align-items: center;
    user-select: none;
    &__pages {
      text-decoration: underline;
      position: relative;
    }
    &__page-nav-caret {
      margin-left: 4px;
      transition: transform 200ms ease;
      &.flipped {
        transform: rotate(180deg);
      }
    }
    &__page-nav {
      position: absolute;
      top: 40px;
      left: 50%;
      width: 200px;
      max-height: 300px;
      display: flex;
      flex-direction: column;
      background-color: $color-white;
      border-radius: 4px;
      border: 1px solid $color-black-900;
      box-shadow: 1px 2px 4px -1px rgba(0,0,0,0.2);
      transform: translateX(-50%);
      padding: 0 8px;
      z-index: 30;
      &::before {
        display: block;
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        content: ' ';
        width: 25px;
        height: 25px;
        clip-path: polygon(50% 32%, 0% 100%, 100% 100%);
        background-color: $color-black-900;
      }
      &::after {
        display: block;
        position: absolute;
        top: -23px;
        left: 50%;
        transform: translateX(-50%);
        content: ' ';
        width: 24px;
        height: 24px;
        clip-path: polygon(50% 32%, 0% 100%, 100% 100%);
        background-color: $color-white;
      }
      &-inner {
        overflow-y: auto;
      }
      &-button {
        width: 100%;
        text-align: left;
        padding: 8px 0;
        border-bottom: 1px solid $color-black-900;
        &:hover {
          text-decoration: underline;
        }
        &:last-of-type {
          border-bottom: none;
        }
        span {
          display: flex;
          justify-content: space-between;
          align-items: center;
          /deep/ .icon {
            fill: $color-black-900;
          }
        }
      }
    }
    &__arrow-prev , &__arrow-next {
      cursor: pointer;
      transition: background-color 300ms ease;
      &:hover {
        background-color: lighten($color: $color-brand-primary, $amount: 20);
        fill: $color-white;
      }
      &:active {
        background-color: $color-white;
        fill: $color-black-900;
        border: 1px solid $color-brand-primary;
      }
    }
    &__arrow-prev, &__disabled-prev {
      margin-right: 20px;
      transform: rotate(180deg);
    }
    &__arrow-next, &__disabled-next {
      margin-left: 20px;
    }
    &__disabled-prev, &__disabled-next {
      fill: $color-grey;
    }
    &__arrow-prev , &__arrow-next , &__disabled-prev, &__disabled-next {
      width: 30px;
      height: 30px;
      padding: 4px;
      border-radius: 100%;
      background-color: $color-white;
    }
  }
</style>
