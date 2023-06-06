<template lang="pug">
  div
    .collection-sidebar
      collection-filters(:tags="tags" :filters="filters")
    .related-collections(v-if="relatedCollections.length > 0")
      h4 Related Collections
      a.related-collection(v-for="(relatedCollection, index) in relatedCollections" :key="index" :href="relatedCollection.url")
        span.tag-text {{relatedCollection.text}}
</template>

<script>
  import VLink from 'scripts/components/buttons/VLink.vue'

  import CollectionFilters from './CollectionFilters.vue'


  export default {
    name: 'CollectionSidebar',
    components: { CollectionFilters, VLink },
    props: {
      relatedCollections: Array,
      defaultSort: String,
      globalMenu: {
        type: Array,
        default: () => ([
          {
            url: String,
            title: String
          }
        ])
      },
      collectionMenu: {
        type: Array,
        default: () => ([
          {
						handle: String,
						title: String,
						links: {
              type: Array,
              default: () => ([
                {
                  title: String,
                  url: String,
                  link: {
                    type: Array,
                    default: () => ({
                      title: String,
                      url: String
                    })
                  }
                }
              ])
            }
          }
        ])
      },
      filtersDisabled: {
        type: Boolean,
        default: false
      },
      tags: {
        type: Array,
        required: true
      },
      filters: {
        type: Array,
        required: true
      }
    },
    computed: {},
    methods: {},
    mounted(){}
  }
</script>

<style scoped lang="scss">
  .collection-sidebar {
    min-width: 245px;
    margin-top: 23px;
    margin-right: 20px;
    border-top: 1px solid $color-black-300;
    position: sticky;
    top: 139px;

    &__global-menu {
      display: flex;
      flex-direction: column;
      padding: 24px 0 16px;
      .top-level {
        border-bottom: 1px solid $color-grey;
        padding: 12px 0 6px;
        font-weight: 600;
        color: $color-black-900;
      }
      .collection-sidebar__custom-menu-item {
        color: $color-black-900;
        font-size: 12px;
        font-family: $font-family-primary;
      }

      > a:visited {
        color: $color-black-900;
      }
    }
    &__custom-menu {
      display: flex;
      flex-direction: column;
      .top-level {
        border-bottom: 1px solid $color-grey;
        padding: 12px 0 6px;
        font-weight: 600;
        color: $color-black-900;
      }
      .collection-sidebar__custom-menu-item {
        padding: 12px 0 6px;
        font-weight: 600;
        color: $color-black-900;
        font-size: 12px;
        font-family: $font-family-primary;
      }
    }
  }
  .remove-bottom-spacing {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }

  h4 {
    margin-top: 32px;
    margin-bottom: 16px;
  }

  .related-collection {
    display: inline-block;
    padding: 4px 8px 8px;
    background-color: $color-black-100;
    margin: 8px;
    line-height: 15px;
    cursor: pointer;

    &:hover {
      background-color: $color-black-200;
      text-decoration: underline $color-black-900;
    }
  }
  .tag-text {
    color: $color-black-900;
    &:hover {
      color: $color-black-900;
    }
    &:visited {
      color: $color-black-900;
    }
  }
</style>