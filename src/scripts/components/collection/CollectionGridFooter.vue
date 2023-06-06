
<template lang="pug">
  .collection-grid-footer
    div.collection-grid-footer__border-wrap
      slot
</template>

<script>
  export default {
    name: 'CollectionGridFooter',
    components: {},
    props: {},
    data () {
      return {}
    }
  }
</script>

<style scoped lang="scss">
  .collection-grid-footer {
    &__border-wrap {
      margin: 0 0 68px;
      display: flex;
      justify-content: center;
      padding: 16px 0;
    }

    @include mobile-only {
      padding: 0 $grid-gutter;
    }

    @include tablet-up {
      &__border-wrap {
        margin: 0 0 68px;
      }
    }
  }
  /deep/ .collection-total-results {
    @include mobile-only {
      width: auto;
    }
  }
</style>