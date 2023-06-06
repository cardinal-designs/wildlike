<template lang="pug">
  iframe(:width="width", :height="height", :src="videoUrl", frameborder="0", allowfullscreen)
</template>

<script>
  export default {
    name: 'Video',
    props: {
      video: String
    },
    computed: {
      videoUrl () {
        return (this.video) ? `https://www.youtube.com/embed/${this.video}?autoplay=1` : ''
      },
      width () {
        if (this.$mq === 'mobile') {
          return "344"
        }
        return "892"
      },
      height () {
        if (this.$mq === 'mobile') {
          return "193.6"
        }
        return "502"
      }
    },
  }
</script>