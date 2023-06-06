<template lang="pug">
  .top-header__container(:style="{ background: promos.background}")
    a.top-header__inner-container.container(
      :style="{ color: promos.color }"
      :href="promoLink"
    )
      .top-bar__promobar-carousel
        .carousel--promobar(v-if="promos.slides.length < 2")
          .promobar-block-container(v-for="(promo, index) in promos.slides", :key="index")
            .promobar-block-content(v-html='promo.promocontent')
        .carousel--promobar(v-else :class="loading ? 'loading' : ''")
          v-button.carousel__nav__prev(
            v-if="promos.arrows",
            label="Previous Slide",
            @click.prevent="$refs.promobarCarousel.slidePrev()"
          )
            icon(:name="iconLeft",
            :color="promos.color")
          carousel(
            ref="promobarCarousel",
            :infinite="infiniteScroll",
            :auto-play="true",
            :speed="promos.speed",
            :slides-to-show="slidesToShow",
            @before-slide="beforeSlide",
            @after-slide="afterSlide"
          )
            slide(v-for="(promo, index) in promos.slides", :key="index")
              .promobar-block-content(v-html='promo.promocontent') 
          v-button.carousel__nav__next(
            v-if="promos.arrows",
            label="Next Slide",
            @click.prevent="$refs.promobarCarousel.slideNext()"
          )
            icon(:name="iconRight",
            :color="promos.color")
</template>

<script>
  import { clone } from 'scripts/helpers/util.js'

  import Carousel from 'scripts/components/basic/Carousel.vue'
  import Icon from 'scripts/components/basic/Icon.vue'
  import Slide from 'scripts/components/basic/Slide.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'

  export default {
    name: 'PromobarCarousel',
    components: { Carousel, Slide, VButton, Icon },
    props: {
      promos: {
        type: Object,
        default: () => []
      },
      textColor: {
        type: String
      },
      iconRight: {
        type: String,
        default: 'chevron-right'
      },
      iconLeft: {
        type: String,
        default: 'chevron-left'
      }
    },
    data () {
      return {
        activeIndex: 0,
        loading: true,
        promoLink: this.promos.slides[0].promolink
      }
    },
    computed: {
      slidesToShow () {
        return 1
      },
      infiniteScroll () {
        return true
      }
    },
    watch: {
      activeIndex(val) {
        if (this.promos.slides.length >= 2) {
          this.promoLink = this.promos.slides[val].promolink;
        }
      }
    },
    mounted () {
      this.activeIndex = 0
      let self = this
      setTimeout(() => {
        self.loading = false
      }, 1000)
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
  .carousel--promobar {
    position: relative;
    opacity: 1;
    transition: opacity 200ms ease;
  }

  .carousel {
    overflow: visible;
  }

  .promobar-block-content {
    display: flex;
    align-items: center;
    justify-content: center;

    a {
      color: inherit;
    }
  }

  .promobar-block-link {
    color: inherit;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .carousel__nav__next,
  .carousel__nav__prev {
    position: absolute;
    top: 50%;
    transform: translateY(-60%);
    z-index: 99;
    display: flex;
    align-items: center;
  }

  .carousel__nav__next {
    right: 0;
  }

  .carousel__nav__prev {
    left: 0;
  }

  .carousel__nav__next svg,
  .carousel__nav__prev svg {
    width: 10px !important;
    height: 10px !important;

    @include desktop-up {
      width: 14px !important;
      height: 14px !important;
    }
  }

  .carousel__nav__prev.button--primary {

    &:focus {
      background-color: transparent;
    }
  }

  .carousel__nav__next.button--primary {

    &:focus {
      background-color: transparent;
    }
  }

  .promo-color-dark .carousel__nav__next svg,
  .promo-color-dark .carousel__nav__prev svg {
    fill: $color-black-900;
  }
  .loading {
    opacity: 0;
  }

</style>