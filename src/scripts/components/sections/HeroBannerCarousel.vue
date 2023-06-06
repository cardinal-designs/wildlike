<template lang="pug">
  div(:class="heroSchema.mobileBgColor")
    .hero-banner-carousel__container(:style="{'max-width': heroSchema.maxWidth}")
      .hero-banner-carousel
        //- SHOULD MAKE MASTER SWIPER COMPONENT THAT AUTOMATICALLY CHANGES BETWEEN MOBILE/DESKTOP INSTANCES
        hero-banner-carousel-desktop(v-if="$mq !== 'mobile'" :hero-schema="heroSchema" :heroArray="heroArray")
        hero-banner-carousel-mobile(v-if="$mq === 'mobile'" :hero-schema="heroSchema" :heroArray="heroArray")
</template>

<script>
  import HeroBannerCarouselDesktop from 'scripts/components/sections/HeroBannerCarouselDesktop.vue'
  import HeroBannerCarouselMobile from 'scripts/components/sections/HeroBannerCarouselMobile.vue'

  export default {
    name: 'HeroBannerCarousel',
    components: {
      HeroBannerCarouselDesktop,
      HeroBannerCarouselMobile
    },
    props: {
      heroSchema: {
        type: Object,
        default: () => ({
          layoutHorizontal: String,
          layoutVertical: String,
          mobileBgColor: String,
        })
      },
      heroArray: {
        type: Array,
        default: () => [
          {
            image: String,
            imageMobile: String,
            imageMobileEnable: Boolean,
            overlayEnable: Boolean,
            overlayColor: String,
            overlayBgColor: String,
            overlayOpacity: Number,
            preHeading: String,
            preHeadingColor: String,
            heading: String,
            headingColor: String,
            subHeading: String,
            subHeadingColor: String,
            copy: String,
            copyColor: String,
            enableCta: Boolean,
            ctaLayout: String,
            ctaText: String,
            ctaUrl: String,
            ctaBgColor: String,
            ctaTextColor: String,
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss">
  .hero-banner-carousel {
    &__container {
      margin: 0 auto;
    }
  }
</style>