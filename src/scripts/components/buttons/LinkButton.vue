
<template lang="pug">
  a(:href="href", :class="buttonClass", :disabled="isDisabled")
    icon(v-if="icon", :name="icon", :size="iconSize")
    span {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    components: { Icon },
    name: 'LinkButton',
    props: {
      href: {
        type: String,
        default: '#'
      }
    }
  }
</script>

<style scoped lang="scss">
</style>