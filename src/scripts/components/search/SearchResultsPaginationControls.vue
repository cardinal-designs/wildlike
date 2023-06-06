
<template lang="pug">
  .search-pagination-controls.body-md
    .search-pagination-controls-icons(v-if="pages !== 1")
      icon.search-pagination-controls__disabled-prev(v-if="currentPage === 1" name="arrow-right" size="24px")
      icon.search-pagination-controls__arrow-prev(v-if="currentPage !== 1" @click="prevPage" name="arrow-right" size="24px")
    .search-pagination-controls__pages(@click="toggleNav") Page {{currentPage}} of {{pages}}
      icon.search-pagination-controls__page-nav-caret(
        v-if="pages > 1"
        :class="{'flipped': pageNavActive}"
        name="caret-down"
        size="8px")
      fade-transition(:duration="{enter: 200, leave: 200}")
        .search-pagination-controls__page-nav(v-if="pageNavActive")
          .search-pagination-controls__page-nav-inner
            .search-pagination-controls__page-nav-button(
              v-for="(page, index) in pages"
              @click="goToPage(page)")
              span.current-page(v-if="page === currentPage") page {{ page }}
                icon(name="checkmark_small" size="10px")
              span(v-else) page {{ page }}
    .search-pagination-controls-icons(v-if="pages !== 1")
      icon.search-pagination-controls__arrow-next(v-if="currentPage !== pages" @click="nextPage" name="arrow-right" size="24px")
      icon.search-pagination-controls__disabled-next(v-if="currentPage === pages" name="arrow-right" size="24px")
</template>

<script>
  import { mapState } from 'vuex';

  import { scrollToTopBottom } from 'scripts/helpers/scroll.js'

  import {FadeTransition} from 'vue2-transitions'

  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'SearchResultsPaginationControls',
    components: { Icon, FadeTransition },
    props: {
      pages: {
        type: Number,
        required: true
      },
      paginationAmount: {
        type: Number,
        required: true
      },
      currentPage: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        pageNavActive: false
      }
    },
    methods: {
      prevPage() {
        if(this.currentPage !== 1) {
          this.$emit('go-to-page', this.currentPage - 1)
          scrollToTopBottom('top')
        }
      },
      nextPage() {
        if(this.currentPage !== this.pages) {
          this.$emit('go-to-page', this.currentPage + 1)
          scrollToTopBottom('top')
        }
      },
      toggleNav() {
        this.pageNavActive = !this.pageNavActive
      },
      goToPage(pageNumber) {
        this.$emit('go-to-page', pageNumber)
        scrollToTopBottom('top')
      }
    }
  }
</script>

<style scoped lang="scss">
  .search-pagination-controls {
    padding: 16px 0 80px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    &__pages {
      text-decoration: underline;
      position: relative;
      font-family: $font-family-secondary;
      font-weight: 600;
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
