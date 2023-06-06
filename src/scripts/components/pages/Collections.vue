<template lang="pug">
  .collections.container
    h3 Collections
    .collections__grid
      a.collections__tile(v-for="collection in collections" :href="collection.url")
        img.collections__tile-image(:src="collection.image" :alt="collection.alt")
        .collections__tile-text
          h5 {{collection.title}}
</template>

<script>
  export default {
    component: 'Collections',
    props: {
      collections: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .collections {
    h3 {
      text-align: center;
      margin: 48px 0;
    }
    &__grid {
      display: flex;
      flex-wrap: wrap;
    }
    &__tile {
      width: 100%;
      display: inline-block;
      vertical-align: top;
      @include mobile-only {
        width: 100%;
        margin-right: 0;
        margin-bottom: 24px;
        display: flex;
        align-items: stretch;
      }

      @include tablet-up {
        width: calc(25% - #{(40px * 3) / 4});
        margin-right: 40px;
        margin-bottom: 40px;
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
      &-image {
        display: block;
        width: 100%;
        height: 216px;
        object-fit: cover;
        object-position: center;
        @include mobile-only {
          width: 156px;
          height: 112px;
        }
      }
      &-text {
        width: 100%;
        height: 126px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $color-white;
        padding: 12px;
        @include mobile-only {
          width: 100%;
          height: auto;
          text-align: left;
          justify-content: flex-start;
        }
        h5 {
          color: $color-black-900;
        }
      }
    }
  }
</style>