<template lang="pug">
  //- SHOULD MAKE SWIPER COMPONENT WITH SLOTS
  .swiper-container
    swiper(:options="heroBannerMobileOptions" ref="heroCarouselDesktop")
      swiper-slide(v-for="(slide, index) in slides", :key="index")
        .hero-banner(:class="[layoutHorizontal, textAlign, heroSchema.mobileLayout]")
          a.hero-banner__container(:href='slide.ctaUrl' :class="[layoutVertical, {[slide.mobileBgColor]: heroSchema.mobileLayout === 'below'}]")
            .hero-banner__image-mobile(:style="`backgroundImage: url(${slide.imageMobile})`")
            .hero-banner__overlay(v-if="slide.overlayEnable" :class="slide.overlayColor" :style="{ opacity: slide.overlayOpacity }")
            .hero-banner__content(:class="[contentProperties.classes]" :style="{...contentProperties.style,  ...slideContainerStyle}")
              h4.preheader(:class="slide.preHeadingColorMobile") {{slide.preHeading}}
              h2.h1(:class="slide.headingColorMobile") {{slide.heading}}
              h3.subheader(v-if="slide.subHeading" :class="slide.subHeadingColorMobile") {{slide.subHeading}}
              p.body-md.hero-banner__body-copy(v-if="slide.copy" :class="slide.bodyCopyColorMobile") {{slide.copy}}
              .hero-banner__cta-wrapper(v-if="slide.ctaText")
                v-button.hero-banner__cta(v-if="slide.ctaLayout.includes('button')" :href='slide.ctaUrl' :class="slide.ctaLayout" tag="a") {{slide.ctaText}}
                v-link.hero-banner__cta(v-if="slide.ctaLayout.includes('link')" :href='slide.ctaUrl' :class="slide.ctaLayout") {{slide.ctaText}}
    //- THESE SHOULD BE MADE COMPONENTS
    .controls-container(:class="[heroSchema.mobileLayout, { 'controls-container--text-box': heroSchema.enableTextBox }]")
      .pagination-dots
        .dot(v-for="(slide, index) in slides" :key="`dot-${index}`" @click="slidePagination(index)" :class="[dotActive(index), `dot-${index}`]")
</template>

<script>
import { flexSwitch } from 'scripts/helpers/flex.js';
import { textAlignSwitch } from 'scripts/helpers/textAlign.js';
import { scrollBelowElement } from 'scripts/helpers/scroll.js';
import Icon from 'scripts/components/basic/Icon.vue';
import VButton from 'scripts/components/buttons/VButton.vue';
import VLink from 'scripts/components/buttons/VLink.vue';
import css from 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { px } from 'scripts/filters/string';

export default {
  name: 'HeroBannerCarouselMobile',
  components: {
    swiper,
    swiperSlide,
    Icon,
    VButton,
    VLink
  },
  props: {
    heroSchema: {
      type: Object,
      default: () => ({
        topPadding: Number,
        bottomPadding: Number,
        layoutHorizontal: String,
        layoutHorizontalTextBox: String,
        layoutVertical: String,
        mobileLayout: String,
        mobileTextAlignment: String,
        arrowColor: String,
        enableTextBox: Boolean,
        textBoxBgColor: String,
        textBoxBgImage: String
      })
    },
    heroArray: {
      type: Array,
      default: () => [
        {
          bodyCopyColorMobile: String,
          copy: String,
          copyColor: String,
          ctaLayout: String,
          ctaText: String,
          ctaUrl: String,
          enableCta: Boolean,
          headingColorMobile: String,
          image: String,
          imageMobile: String,
          imageMobileEnable: false,
          mobileBgColor: String,
          overlayColor: String,
          overlayEnable: true,
          overlayOpacity: 80,
          preHeading: String,
          preHeadingColor: String,
          preHeadingColorMobile: String,
          subHeading: String,
          subHeadingColor: String,
          subHeadingColorMobile: String
        }
      ]
    }
  },
  data() {
    return {
      heroBannerMobileOptions: {
        slidesPerView: 1,
        loop: true,
        threshold: 5,
      },
      currentIndex: 0
    };
  },
  computed: {
    layoutHorizontal() {
      return flexSwitch('justify', this.heroSchema.layoutHorizontal);
    },
    layoutVertical() {
      if (this.heroSchema.enableTextBox) {
        return flexSwitch('justify', 'center');
      }
      return flexSwitch('justify', this.heroSchema.layoutVertical);
    },
    textAlign() {
      return textAlignSwitch(this.heroSchema.mobileTextAlignment);
    },
    slides() {
      return this.heroArray.map((slide, index) => {
        return {
          ...slide,
          imageMobile: slide.imageMobileEnable
            ? slide.imageMobile
            : slide.image,
          overlayOpacity: `${slide.overlayOpacity / 100}`
        };
      });
    },
    swiper() {
      return this.$refs.heroCarouselDesktop.swiper;
    },
    contentProperties() {
      return {
        classes: this.heroSchema.enableTextBox
          ? [
              {
                'hero-banner__content--text-box': true,
                'hero-banner__content--text-box-img': this.heroSchema
                  .textBoxBgImage
              },
              this.heroSchema.textBoxBgColor
            ]
          : undefined,
        style:
          this.heroSchema.enableTextBox && this.heroSchema.textBoxBgImage
            ? { backgroundImage: `url(${this.heroSchema.textBoxBgImage})` }
            : undefined
      };
    },
    slideContainerStyle() {
      const {
        heroSchema: { topPadding, bottomPadding }
      } = this;

      return {
        paddingTop: px(topPadding),
        paddingBottom: px(bottomPadding)
      };
    }
  },
  methods: {
    slidePrev() {
      this.swiper.slidePrev();
    },
    slideNext() {
      this.swiper.slideNext();
    },
    slidePagination(index) {
      this.swiper.slideToLoop(index);
    },
    dotActive(index) {
      if (this.currentIndex === index) {
        return 'active';
      }
    }
  },
  mounted() {
    this.$watch(
      () => {
        return this.$refs.heroCarouselDesktop.swiper.realIndex;
      },
      val => {
        this.currentIndex = val;
      }
    );
  }
};
</script>

<style scoped lang="scss">
.hero-banner {
  position: relative;
  display: flex;
  width: 100%;
  height: 672px;
  padding: 64px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  &__overlay {
    display: none;
  }
  &.overlay {
    min-height: 630px;
    .hero-banner {
      &__image-mobile {
        position: absolute;
        height: 100%;
        width: 100%;
      }
      &__container {
        flex: 1;
        display: inline-flex;
        flex-direction: column;
      }
      &__overlay {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }
  }
  &.below {
    justify-content: flex-start;
    .hero-banner__content--text-box {
      position: relative;
      top: -30px;
    }
  }
  @include mobile-only {
    position: auto;
    height: 100%;
    flex-direction: column;
    padding: 0;
  }
  &__container {
    flex: 1;
  }
  &__content {
    display: inline-flex;
    flex-direction: column;
    max-width: 100%;
    width: 100%;
    z-index: 21;

    &--text-box {
      margin: 0 16px;
      width: calc(100% - 32px);
      border-radius: $hero-content-border-radius;
    }
    @include desktop-up {
      max-width: 672px;
    }
    @include mobile-only {
      padding: 0 14px;
    }
  }
  &__body-copy {
    margin: 16px 0;
    @include desktop-up {
      margin: 24px 0;
    }
  }
  &__cta-wrapper {
    display: inline-block;
  }
  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &__scroll-trigger {
    width: 58px;
    height: 58px;
    padding: 20px;
    position: absolute;
    left: 50%;
    right: 50%;
    bottom: 8px;
    transform: translate(-50%, 0);
    cursor: pointer;
  }
  &__image-mobile {
    position: relative;
    height: 400px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
.swiper-wrapper {
  align-items: stretch;
}

.swiper-slide {
  height: auto;
}
//part of controls component
.controls-container {
  display: flex;
  position: absolute;
  bottom: 24px;
  width: 100%;
  z-index: 5;
  @include mobile-only {
    justify-content: center;
  }
  .pagination-dots {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background-color: $color-black-300;
    margin: 8px;
  }
  .dot.active {
    background-color: $color-primary-700;
  }
}
</style>