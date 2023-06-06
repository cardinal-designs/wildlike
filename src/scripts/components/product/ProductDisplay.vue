<template lang="pug">
  BourdainProductDisplay(v-bind="$props")
</template>

<script>
import BourdainProductDisplay from './bourdain/ProductDisplay.vue';

export default {
  name: 'RootProductDisplay',
  components: {
    BourdainProductDisplay,
  },
  props: {
    productPageTemplate: {
      type: String,
      default: 'BourdainProductDisplay',
    },
    ...BourdainProductDisplay.props
  },
}
</script>

<style lang="scss">

</style>