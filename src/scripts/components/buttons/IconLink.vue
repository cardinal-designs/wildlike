
<template lang="pug">
  a.button--icon(
    :class="buttonClass", 
    :disabled="isDisabled",
    :href="href",
    :title="label",
    :target="target"
  )
    icon(v-if="icon", :name="icon", :size="size")
    span.u-sr-only {{ label }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    extends: Icon,
    name: 'IconLink',
    components: { Icon },
    props: {
      href: {
        type: String,
        default: '#'
      },
      external: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      target () {
        return (this.external) ? '_blank' : '_self'
      }
    }
  }
</script>

<style scoped lang="scss">
  .button--icon {
    &[disabled] {
      pointer-events: none;
      opacity: 0.4;
    }
  }
</style>