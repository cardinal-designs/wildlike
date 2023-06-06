<template lang="pug">
  div(:class="{ 'flex-row': collection === 'a'}")
    vue-content-loading.collection-filters-skeleton(:width="188" :height="20" :class="{'collection-filters-skeleton--full': collection === 'a'}")
      rect(x="0" y="0" width="100%" height="100%")
    vue-content-loading.collection-filters-skeleton(:width="188" :height="20" :class="{'collection-filters-skeleton--full': collection === 'a'}")
      rect(x="0" y="0" width="100%" height="100%")
    vue-content-loading.collection-filters-skeleton(:width="188" :height="20" :class="{'collection-filters-skeleton--full': collection === 'a'}")
      rect(x="0" y="0" width="100%" height="100%")
    vue-content-loading.collection-filters-skeleton(:width="188" :height="20" :class="{'collection-filters-skeleton--full': collection === 'a'}")
      rect(x="0" y="0" width="100%" height="100%")
</template>

<script>
  import VueContentLoading from 'vue-content-loading';

  export default {
    name: 'CollectionFiltersSkeleton',
    components: { VueContentLoading },
    props: {
      collection: {
        type: String,
        defualt: 'a'
      }
    }
  }
</script>

<style scoped lang="scss">
  .collection-filters-skeleton {
    height: auto;
    padding: 16px 16px 16px 0;
    border-bottom: 1px solid $color-black-100;
  }

  .collection-filters-skeleton--full {
    width: 100%;
  }
</style>