<template lang="pug">
  .collection-sections
    collection-banner(v-if="collectionSections.settings.enableBanner === 1" :banner="collectionSections.banner")
    collection-category-images(v-if="collectionSections.settings.enableCategoryImages === 1" :category-images="collectionSections.categoryImages")
    collection-category-links(v-if="collectionSections.settings.enableCategoryLinks === 1" :category-links="collectionSections.categoryLinks")
</template>

<script>
  import CollectionBanner from './CollectionBanner.vue'
  import CollectionCategoryImages from './CollectionCategoryImages.vue'
  import CollectionCategoryLinks from './CollectionCategoryLinks.vue'

  export default {
    name: 'CollectionSections',
    components: { CollectionBanner, CollectionCategoryImages, CollectionCategoryLinks },
    props: {
      collectionSections: {
        type: Object,
        default: () => ({
          "settings": Object,
          "banner": Object,
          "categoryImages": Object,
          "categoryLinks": Object,
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .collection-sections {
    margin-top: 28px;
    @include mobile-only {
      margin-top: 0;
    }
  }
</style>