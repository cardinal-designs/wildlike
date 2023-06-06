<template lang="pug">
  .page-404-container
    fifty-fifty(:schema="schema")
</template>

<script>
  import FiftyFifty from 'scripts/components/sections/FiftyFifty.vue';

  export default {
    name: 'Page404',
    components: { FiftyFifty },
    props: {
      schema: Object,
    }
  }
</script>

<style scoped lang="scss">
  /deep/ .ff__body,
  /deep/ .ff__body p {
    line-height: 1.375rem;
    margin-bottom: 16px;
  }

  /deep/ .sw {
    max-width: 100%;

    &__main-image-content-container {
      
      @include tablet-up {
        padding-top: 0;
        padding-bottom: 0;
      }
    }
  }

</style>