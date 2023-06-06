
<template lang="pug">
  .video-modal
    modal(ref="videoModal", :video="videoId", @close="clearVideo")
</template>

<script>
  import { mapState } from 'vuex'

  import Modal from 'scripts/components/basic/Modal.vue'

  export default {
    name: 'VideoModal',
    components: { Modal },
    computed: {
      ...mapState({
        videoId: state => state.video.current
      })
    },
    watch: {
      videoId (newVal, oldVal) {
        if (newVal.length > 0 && newVal !== oldVal && !this.$refs.videoModal.isVisible) {
          this.$refs.videoModal.open()
        }
      }
    },
    methods: {
      clearVideo () {
        this.$store.dispatch('video/clear')
      },

      t(uniqueId) {
        this.$slots.default.filter(vnode => vnode.componentInstance && vnode.componentInstance !== uniqueId)
          .forEach(vnode => vnode.setComponentNotActive())
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
