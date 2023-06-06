<template lang="pug">
  .shoppable-instagram-container
    h2(v-if="heroSchema.title") {{heroSchema.title}}
    .yotpo.yotpo-pictures-widget(data-gallery-id="60fefe82042fa517d1c583d3")
</template>

<script>
  export default {
    name: 'ShoppableInstagram',
    props: {
      heroSchema: {
        type: Object,
        default: () => ({
          title: String
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  .shoppable-instagram-container {
    padding: 32px 0px;
  }
  h2 {
    text-align: center;
    margin-bottom: 32px;
  }
</style>