<template lang="pug">
  .v-spacer(:style="`height: ${this.height}px; width: ${this.width}px`")
</template>

<script>
  export default {
    name: 'VSpacer',
    props: {
      height: Number,
      width: Number
    }
  }
</script>