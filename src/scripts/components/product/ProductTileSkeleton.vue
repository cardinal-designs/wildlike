<template lang="pug">
  vue-content-loading.product-skeleton-tile(:width="200" :height="400")
    rect(x="0" y="0" width="100%" height="70%")
    rect(x="0" y="75%" width="80%" height="5%")
    rect(x="90%" y="75%" width="10%" height="5%")
    rect(x="0" y="85%" width="80%" height="5%")
</template>

<script>
  import VueContentLoading from 'vue-content-loading';

  export default {
    name: 'ProductTileSkeleton',
    components: { VueContentLoading }
  }
</script>

<style lang="scss">
  .product-skeleton-tile {
    height: auto;
  }
</style>
