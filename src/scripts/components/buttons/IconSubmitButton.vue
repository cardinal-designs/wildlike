
<template lang="pug">
  button.button--icon(
    type="submit", 
    :class="buttonClass", 
    :disabled="isDisabled", 
    @click="$emit('click')"
  )
    icon(v-if="icon", :name="icon", :size="size")
    span.u-sr-only {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    extends: Icon,
    components: { Icon },
    name: 'IconSubmitButton'
  }
</script>

<style scoped lang="scss">
</style>