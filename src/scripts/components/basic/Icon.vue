
<template lang="pug">
  svg(:class="[iconClass, fillClass]", :style="iconStyle" v-on="$listeners" aria-hidden="true")
    use(xmlns:xlink="http://www.w3.org/1999/xlink", :xlink:href="iconName")
</template>

<script>
  export default {
    name: 'Icon',
    props: {
      name: String,
      size: {
        type: String,
        default: '24px'
      },
      color: String,
      fillClass: String
    },
    computed: {
      iconClass () {
        let iconClass = { 'icon': true };

        iconClass[`icon--${this.name}`] = true;

        return iconClass
      },
      iconStyle () {
        return {
          'height': this.size,
          'width': this.size,
          'fill': this.color
        }
      },
      iconName () {
        return `#${this.name}`
      }
    }
  }
</script>

<style></style>