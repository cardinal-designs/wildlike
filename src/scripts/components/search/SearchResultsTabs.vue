<template lang="pug">
  tabs.search-results-tabs(@changed="tabChanged")
    tab.search-results-tabs__tab.strong-medium(title="PRODUCTS")
    tab.search-results-tabs__tab.strong-medium(title="ARTICLES")
    tab.search-results-tabs__tab.strong-medium(title="PAGES")
</template>

<script>
  import { Tabs, Tab } from 'vue-simple-tabs'

  export default {
    name: 'SearchResultsTabs',
    components: { Tabs, Tab },
    methods: {
      tabChanged(tab) {
        this.$emit('change-tab', tab.title.toLowerCase())
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-results-tabs {
    height: 80px;
    width: 100%;
    min-width: 180px;

    /deep/ ul {
      display: flex;
      justify-content: center;
      padding: 0;
      margin: 0;
    }
    @include mobile-only {
      height: 60px;
    }
    /deep/ li {
      cursor: pointer;
      position: relative;
      font-family: $font-family-primary;
      font-size: 16px;
      font-style: italic;
      font-weight: 900;
      letter-spacing: 1px;
      line-height: 16px;
      text-align: center;
      display: flex;
      align-items: flex-end;
      height: 80px;
      padding: 16px 40px;
      @include mobile-only {
        height: 60px;
        padding: 16px 30px;
      }
      &::after {
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: transparent;
        transform: scaleY(0);
        transition: transform 300ms ease, background-color 300ms ease;
      }
      &.active {
        &::after {
          transform: scaleY(1);
          background-color: $color-util-focus;
        }
      }
    }
  }
</style>
