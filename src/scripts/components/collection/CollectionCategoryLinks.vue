<template lang="pug">
  .collection-category-links
    h5(:class="$mq === 'mobile' ? 'h4' : ''") {{ categoryLinks.heading }}
    .collection-category-links__link-container(v-if="categoryLinks.links && categoryLinks.links.length" :class="categoryLinks.links.length <= 2 ? 'center' : ''")
      a.collection-category-links__link(v-for="(link, index) in categoryLinks.links" :href="link.url" :key="index")
        span {{link.text}}
        Icon.icon(name="arrow-right" size="24px")
</template>

<script>
  import Icon from '../basic/Icon.vue'

  export default {
    name: "CollectionCategoryLinks",
    components: { Icon },
    props: {
      "categoryLinks": {
        type: Object,
        required: true,
        default: () => ({
          "heading": String,
          "links": {
            type: Array,
            default: () => ({
              "url": String,
              "text": String
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .collection-category-links {
    margin-top: 32px;
    text-align: center;
    &__link-container {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 16px;
      text-align: left;
      @include mobile-only {
        padding: 0 16px;
      }
      &.center {
        justify-content: center;
      }
    }
    &__link {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: $color-white;
      padding: 12px 20px;
      margin-bottom: 32px;
      box-shadow: 1px 2px 2px -1px rgba(0,0,0,0.08);
      border-radius: 4px;
      transition: box-shadow 300ms ease, transform 300ms ease;

      span {
        font-family: $font-family-secondary;
        font-size: 14px;
        letter-spacing: 1px;
        line-height: 22px;
        font-weight: bold;
        color: $color-black-900;
        @include mobile-only {
          font-family: $font-family-primary;
          font-size: 12px;
          letter-spacing: 0;
          line-height: 16px;
        }
      }

      .icon {
        transition: transform 300ms ease;
      }

      &:hover {
        box-shadow: 1px 2px 2px 1px rgba(0,0,0,0.08);
        transform: translate3d(0, -2px, 0);
        .icon {
          transform: translate3d(4px, 0, 0);
        }
      }

      @include mobile-only {
        width: calc(50% - 12px);
        margin: 0 12px 12px 0;
        &:nth-of-type(2) {
          margin-right: 0;
        }
      }
      @include tablet-only {
        width: calc(33% - 14px);
        margin: 0 16px 14px 0;
        &:nth-of-type(3) {
          margin-right: 0;
        }
      }
      @include desktop-up {
        width: calc(25% - 16px);
        margin: 0 16px 16px 0;
        &:nth-of-type(4) {
          margin-right: 0;
        }
      }
    }
  }
</style>