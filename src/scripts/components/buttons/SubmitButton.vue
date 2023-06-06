
<template lang="pug">
  button(
    type="submit", 
    :class="buttonClass", 
    :disabled="isDisabled", 
    @click="$emit('click')"
  )
    icon(v-if="icon", :name="icon", :size="iconSize")
    span {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    components: { Icon },
    name: 'SubmitButton',
  }
</script>

<style scoped lang="scss">
</style>