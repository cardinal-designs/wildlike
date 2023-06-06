<template lang="pug">
.full-width-background
  .container
    p.collection-breadcrumbs
      a(href="/") Home
      span.collection-breadcrumbs__divider /
      span {{collectionTitle}}
</template>

<script>
  export default {
    name: "CollectionBreadcrumbs",
    props: {
      collectionHandle: {
        type: String,
        required: true
      },
      collectionTitle: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .full-width-background {
    background-color: $color-black-100;
  }
  .collection-breadcrumbs {
    align-items: center;
    display: flex;
    padding: 11px 0px 9px;

    @include mobile-only {
      text-align: center;
      border-top: 1px solid $color-black-100;
      justify-content: center;
    }
    &__divider {
      margin: 0 4px;
    }
    span {
      user-select: none;
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
