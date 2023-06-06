
<template lang="pug">
  transition(name="fade")
    .modal(v-if="isVisible" v-scroll-lock="isVisible")
      .modal__overlay(@click="close")
      .modal__content.modal__content--video(v-if="video")
        v-button.modal__close.bubble-hover(label="Close Modal", @click.prevent="close")
          icon(name="close", size="30px")
        .modal__content--video__container
          iframe(width="853", height="480", :src="videoUrl", frameborder="0", allowfullscreen)
      .modal__content(v-else)
        v-button.modal__close.bubble-hover(label="Close Modal", @click.prevent="close")
          icon(name="close", size="30px")
        slot(name="content")
</template>

<script>
  import VButton from 'scripts/components/buttons/VButton.vue'
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'Modal',
    components: { VButton, Icon },
    props: {
      video: String,
      autoOpen: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isVisible: false
      }
    },
    computed: {
      videoUrl () {
        return (this.video && this.isVisible) ? `https://www.youtube.com/embed/${this.video}?autoplay=1` : ''
      }
    },
    methods: {
      open () {
        this.isVisible = true
        this.$emit('open')
      },
      close () {
        this.isVisible = false
        this.$emit('close')
      }
    },
    mounted () {
      if (this.autoOpen) {
        this.open()
      }
    }
  }
</script>

<style lang="scss">
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    min-height: 100vh;
    width: 100%;
    overflow-y: auto;
    background-color: rgba(0,0,0,0.1);

    .video-modal & {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    &__content {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      max-width: 100%;
      background-color: $color-white;
      padding: 30px;

      @include mobile-only {
        min-height: 100vh;
        width: 100%;
      }

      @include tablet-up {
        top: 50px;
        max-width: 647px;
        padding: 44px 80px 56px 80px;
      }
    }

    &__content--video {
      width: $container-max-width;
      max-width: 100%;

      @include mobile-only {
        padding: 70px 30px;
        top: 200px;
        min-height: auto;
      }

      &__container {
        padding-top: 56.25%;
        position: relative;
      }

      iframe {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    &__title {
      margin-bottom: $content-gutter;
    }

    &__close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: rem(36);
      padding: 8px;
      text-align: center;
      z-index: 2;
      font-size: 0;
    }
  }
</style>
