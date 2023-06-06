<template lang="pug">
  .super-collection
    super-collection-linear(v-for="(linearSettings, idx) in linearSettingsArray" :settings="linearSettings" :key="idx")
    image-grid(align="left" :header="grid1Settings.header" :header_link_text="grid1Settings.link_text" :header_link_url="grid1Settings.link_url" :cta_style="grid1Settings.cta_style" :images="grid1Settings.images")
    image-grid(align="right" :header="grid2Settings.header" :header_link_text="grid2Settings.link_text" :header_link_url="grid2Settings.link_url" :cta_style="grid2Settings.cta_style" :images="grid2Settings.images")
    super-collection-product-tiles(:settings="collectionSettings")
</template>

<script>
  import SuperCollectionLinear from './SuperCollectionLinear.vue';
  import SuperCollectionProductTiles from './SuperCollectionProductTiles.vue';
  import ImageGrid from 'scripts/components/basic/ImageGrid.vue';

  export default {
    name: 'SuperCollection',
    components: { 
      SuperCollectionLinear, 
      SuperCollectionProductTiles,
      ImageGrid,
    },
    props: {
      linearSettingsArray: {
        type: Array,
        default: () => ([]),
      },
      collectionSettings: {
        type: Object,
        default: () => ({}),
      },
      grid1Settings: {
        type: Object,
        default: () => ({}),
      },
      grid2Settings: {
        type: Object,
        default: () => ({}),
      },
    }
  }
</script>

<style scoped lang="scss">
  .super-collection {
    @include mobile-only {
      padding: 20px 0;
    }
  }
</style>