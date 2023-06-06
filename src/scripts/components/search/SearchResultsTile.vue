<template lang="pug">
  .search-results-tile(:class="{'product': tileType === 'products'}")
    product-tile(v-if="tileType === 'products'" :simple="true" :product="data" :selected-variant="data.variants[0]")
    a.search-results-tile__article(v-if="tileType === 'articles'" :href="data.url")
      img.search-results-tile__article-image(:src="data.image.src" :alt="data.image.alt")
      .search-results-tile__article-text
        h6 {{category}}
        p {{data.title}}
        v-link.link(primary :href="data.url") View
    a.search-results-tile__page(v-if="tileType === 'pages'" :href="data.url")
      .search-results-tile__page-text
        h6 Page
        p {{data.title}}
        v-link.link.viewlink(primary :href="data.url") View
</template>

<script>
  import Icon from '../basic/Icon.vue'
  import VLink from '../buttons/VLink.vue'

  import ProductTile from '../product/ProductTile.vue'

  export default {
    name: "SearchResultsTile",
    components: { Icon, VLink, ProductTile },
    props: {
      tileType: {
        type: String,
        required: true
      },
      data: {
        type: Object,
        required: true
      }
    },
    computed: {
      designerName() {
        return this.data.designer;
      },
      category() {
        const splitURL = this.data.url.split('/');
        const categoryWithoutDash = splitURL[2].replace("-", " ");
        return categoryWithoutDash
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-results-tile {
    &:hover {
      cursor: pointer;
    }
    &__article, &__page {
      min-height: 142px;
      background-color: $color-white;
      a, h5, p, span {
        color: $color-black-900;
      }
      .link {
        margin-top: 8px;
      }
      @include mobile-only {
        min-height: 112px;
      }
    }
    &__article, &__page {
      display: block;
      &:hover {
        cursor: pointer;
      }
    }
    &__article {
      &-image {
        height: 142px;
        width: 100%;
        object-fit: cover;
        object-position: center;
        font-family: "object-fit: cover; object-position: center;"
      }
      &-text {
        padding: 0px 12px 16px;
        h5 {
          color: $color-black-900;
          @include mobile-only {
            font-size: rem(14);
            margin-bottom: 8px;
            line-height: 14px;
          }
        }
        @include mobile-only {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
      @include mobile-only {
        display: flex;
        &-image {
          height: 112px;
          width: 40%;
        }
      }
    }
    &__page {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 8px;
      background-color: $color-black-100;
      @include desktop-only {
        min-height: 263px;
      }
    }
  }
  .viewlink {
    @include mobile-only {
      display: none;
    }
  }
  h6 {
    margin-bottom: 8px;
    color: $color-black-900;
  }
</style>