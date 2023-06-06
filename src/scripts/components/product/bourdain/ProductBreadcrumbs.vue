<template lang="pug">
  .full-width-background
    .container
      .inner-breadcrumb
        p.breadcrumb-text(v-if="collection")
          a(href="/") Home
          span.breadcrumb-text__divider /
          a(:href="`/collections/${collection.handle}`") {{collection.title}}
          span.breadcrumb-text__divider /
          a {{product.title}}
        p.breadcrumb-text(v-else)
          a(href="/") Home
          span.breadcrumb-text__divider /
          a {{product.title}}
</template>

<script>
export default {
  props: {
    collection: Object,
    product: Object
  },
}
</script>

<style lang="scss" scoped>
  .full-width-background {
    background-color: $color-black-100;
  }

  .inner-breadcrumb {
    padding: 11px 0px 9px;

    .breadcrumb-text {

      * {
        font-family: $font-family-secondary;
      }

      &__divider {
        margin: 0 4px;
      }
      @include mobile-only {
        text-align: center;
      }
    }
  }

  p, a , span {
    font-size: rem(12);
    line-height: 14px;
    color: $color-black-900;
    &:visited {
      color: $color-black-900;
    }
    &:hover {
      color: $color-black-900;
    }
  }

</style>
