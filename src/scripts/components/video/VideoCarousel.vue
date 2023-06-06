
<template lang="pug">
  .carousel--video
    h2.carousel__title(v-if="title && videos.length > 0") {{ title }}
    .carousel__nav(v-if="!disableScroll")
      v-button.carousel__nav__prev(
        label="Previous Slide",
        icon="arrow-left",
        @click="$refs.videoCarousel.slidePrev()"
      )
      v-button.carousel__nav__next(
        label="Next Slide",
        icon="arrow-right",
        @click="$refs.videoCarousel.slideNext()"
      )
    carousel(
      ref="videoCarousel",
      :center-mode="centerMode",
      :infinite="infiniteScroll",
      :slides-to-show="slidesToShow",
      @before-slide="beforeSlide",
      @after-slide="afterSlide"
    )
      slide(v-for="(video, index) in videos", :key="index + '_' + video.id")
        video-thumbnail(
          :title="video.title",
          :description="video.description",
          :image="video.image",
          :mobile-image="video.mobileImage",
          :alt="video.title",
          :video-id="video.id",
          :showDescription="disableScroll || index === activeIndex",
          :overlay-color="video.overlayColor",
          :overlay-opacity="video.overlayOpacity",
          @focused="$root.$emit('videoSlideTo', index)"
        )
</template>

<script>
  import { clone } from 'scripts/helpers/util.js'

  import Carousel from 'scripts/components/basic/Carousel.vue'
  import Slide from 'scripts/components/basic/Slide.vue'
  import VideoThumbnail from 'scripts/components/video/VideoThumbnail.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'

  export default {
    name: 'VideoCarousel',
    components: { Carousel, Slide, VideoThumbnail, VButton },
    props: {
      title: String,
      videos: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        activeIndex: null
      }
    },
    computed: {
      slidesToShow () {
        if (this.disableScroll) {
          return Math.min(this.videos.length, 3)
        }

        return (this.$mq === 'mobile') ? 1.05 : 2
      },
      disableScroll () {
        return Boolean(this.videos.length < 4 && this.$mq !== 'mobile') || Boolean(this.videos.length === 1 && this.$mq === 'mobile')
      },
      centerMode () {
        // not mobile and only 1 slide
        if (this.$mq !== 'mobile' && this.videos.length === 1) return true

        // otherwise, set center mode when scroll is not disabled
        return this.disableScroll ? false : true
      },
      infiniteScroll () {
        return this.disableScroll ? false : true
      }
    },
    mounted () {
      this.activeIndex = 0
    },
    methods: {
      beforeSlide ({ from, to }) {
        if (from !== to) this.activeIndex = null
      },
      afterSlide (index) {
        this.activeIndex = index
      }
    }
  }
</script>

<style scoped lang="scss">
  .carousel--video {
    padding: 24px 0;

    @include tablet-up {
      padding: 50px 0;
    }

    .carousel {
      overflow: visible;
    }
  }
</style>
