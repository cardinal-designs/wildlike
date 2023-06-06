
<template lang="pug">
  .video-thumbnail
    .video-thumbnail__button-wrapper
      button.u-clear-button.video-thumbnail__button(
        :tabindex="tabIndex",
        @focus="focused",
        @click="openVideo"
      )
        .video-thumbnail__overlay(:style="overlayStyle")
        img(v-if="$mq === 'mobile'", :src="mobileImage", :alt="alt")
        img(v-else, :src="image", :alt="alt")
        icon(name="play", size="72px", label="Play")
    transition(name="fade-slow")
      .video-thumbnail__description(v-if="showDescription") {{ description }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'VideoThumbnail',
    components: { Icon },
    props: {
      title: String,
      videoId: String,
      image: String,
      mobileImage: String,
      alt: String,
      description: String,
      overlayColor: String,
      overlayOpacity: {
        type: Number,
        default: 0
      },
      showDescription: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      tabIndex () {
        return (!this.$parent.isClone) ? 0 : -1
      },
      overlayStyle () {
        return (this.overlayOpacity === 0) ? {} : {
          'opacity': this.overlayOpacity,
          'background-color': this.overlayColor
        }
      }
    },
    methods: {
      openVideo () {
        this.$store.dispatch('video/play', this.videoId)
      },
      focused () {
        this.$emit('focused')
      }
    }
  }
</script>

<style scoped lang="scss">
  .video-thumbnail {
    @include tablet-up {
      margin: 0 auto;
    }

    &__button {
      max-width: 100%;

      &, img {
        display: block;
      }
    }

    &__button-wrapper {
      cursor: pointer;
      position: relative;
      display: inline-block;
      width: 100%;

      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        fill: $color-white;
        transform: translate(-50%, -50%);
      }
    }

    &__overlay {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }

    &__description {
      margin: 18px auto 0;
      font-size: rem(15);
      line-height: 2;
      text-align: center;
      max-width: 430px;

      @include tablet-up {
        font-size: rem(18);
      }
    }
  }
</style>
