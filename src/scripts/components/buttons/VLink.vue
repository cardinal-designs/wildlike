<template lang="pug">
  component(
    :is="tag"
    v-on="$listeners"
    :class="[linkClass, customClasses]"
  )
    span.link__content
      slot
      slot(name="icon")
        icon(
          viewBox="0 0 24 24"
          size="20px"
          name="arrow_long_right"
        )
</template>

<script>
import Icon from '../basic/Icon.vue';

  export default {
    components: {
      Icon
    },
    name: 'VLink',
    props: {
      primary: Boolean,
      secondary: Boolean,
      tertiary: Boolean,
      disabled: Boolean,
      customClasses: String,
      tag: {
        type: String,
        default: 'a'
      }
    },
    computed: {
      linkClass () {
        return {
          'link link--primary': this.primary === true,
          'link link--secondary': this.secondary === true,
          'link link--tertiary': this.tertiary === true,
          'link--disabled': this.disabled,
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .link .icon {
    display: none;
  }
  .link.link--primary .icon {
    display: inline-block;
  }
</style>
