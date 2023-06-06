
<template lang="pug">
  component(
    :is="tag"
    :class="buttonClass"
    v-on="$listeners"
    :aria-label="label"
  )
    span.button__content
      slot {{ label }}
</template>

<script>
  export default {
    name: 'VButton',
    props: {
      label: String,
      tag: {
        type: String,
        default: 'button',
      },
      primary: {
        type: Boolean,
        default: false
      },
      secondary: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      buttonClass () {
        return {
          'button button--primary': this.primary === true,
          'button button--secondary': this.secondary === true
        }
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
