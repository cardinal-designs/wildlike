
<template lang="pug">
  .full-overlay(ref="overlay" :class="{'hidden': !showOverlay}" :style="{'z-index': zIndex}")
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'FullOverlay',
    data() {
      return {};
    },
    computed: {
      ...mapState({
        showOverlay: state => state.fullOverlay.showOverlay,
        zIndex: state => state.fullOverlay.zIndex,
      })
    },
    methods: {
    },
    watch: {
    },
    mounted () {
    }
  }
</script>

<style lang="scss">
  .full-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba($color-black-900, 0.4);
    transition: opacity 300ms ease-in-out, visibility 300ms ease-in-out;

    &.hidden {
      opacity: 0;
      visibility: hidden;
    }
  }
</style>
