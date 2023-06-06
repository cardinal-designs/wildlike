<template lang="pug">
  //- SHOULD MAKE SWIPER COMPONENT WITH SLOTS
  .swiper-container
    swiper(:options="desktopOptions" ref="heroCarouselDesktop")
      swiper-slide(v-for="(slide, index) in slides", :key="index")
        a.hero-banner(v-if='slide.enableCta' :class="[layoutHorizontal, layoutVertical, textAlign, rootTextBox]" :style="slideContainerStyle(slide)" :href='slide.ctaUrl')
          .hero-banner__bg(:style="backgroundImageStyles(slide)")
          .hero-banner__text-box-bg(v-if="heroSchema.enableTextBox" :style="textBoxBgStyle(slide)")
          .hero-banner__content-container
            .hero-banner__content(:class="[contentClass, heroSchema.layout]" :style="contentStyle")
              .hero-banner__overlay(:class="slide.overlayColor" :style="{opacity: 0. + slide.overlayOpacity, backgroundColor: slide.overlayBgColor}")
              h4.preheader(v-if="slide.preHeading", :class="slide.preHeadingColor") {{slide.preHeading}}
              h2.h1(v-if="slide.heading", :class="slide.headingColor") {{slide.heading}}
              h3.subheader(v-if="slide.subHeading", :class="slide.subHeadingColor") {{slide.subHeading}}
              p.body-md.hero-banner__body-copy(v-if="slide.copy", :class="slide.copyColor") {{slide.copy}}
              .hero-banner__cta-wrapper(v-if="slide.ctaText")
                v-button.hero-banner__cta(v-if="slide.ctaLayout.includes('button')" :href='slide.ctaUrl' :class="slide.ctaLayout" :style="ctaStyles(slide)") {{slide.ctaText}}
                v-link.hero-banner__cta(v-if="slide.ctaLayout.includes('link')" :href='slide.ctaUrl' :class="slide.ctaLayout" tag="a") {{slide.ctaText}}
              .hero-carousel__controls-container.hero-carousel__controls-container--text-box(v-if="heroSchema.enableTextBox")
                .controls-container(:style="sliderControlsLayout" :class="[layoutHorizontal, layoutVertical, textAlign]")
                  .pagination-dots(:style="sliderControlsLayoutArrows")
                    .dot(v-for="(slide, index) in slides" :key="`dot-${index}`" @click.prevent="slidePagination(index)" :class="dotActive(index)")
        .hero-banner(v-else :class="[layoutHorizontal, layoutVertical, textAlign, rootTextBox]" :style="slideContainerStyle(slide)")
          .hero-banner__text-box-bg(v-if="heroSchema.enableTextBox" :style="textBoxBgStyle(slide)")
          .hero-banner__content-container
            .hero-banner__content(:class="[contentClass, heroSchema.layout]" :style="contentStyle")
              .hero-banner__overlay(:class="slide.overlayColor" :style="{opacity: 0. + slide.overlayOpacity, backgroundColor: slide.overlayBgColor}")
              h4.preheader(v-if="slide.preHeading", :class="slide.preHeadingColor") {{slide.preHeading}}
              h2.h1(v-if="slide.heading", :class="slide.headingColor") {{slide.heading}}
              h3.subheader(v-if="slide.subHeading", :class="slide.subHeadingColor") {{slide.subHeading}}
              p.body-md.hero-banner__body-copy(v-if="slide.copy", :class="slide.copyColor") {{slide.copy}}
              .hero-carousel__controls-container.hero-carousel__controls-container--text-box(v-if="heroSchema.enableTextBox")
                .controls-container(:style="sliderControlsLayout" :class="[layoutHorizontal, layoutVertical, textAlign]")
                  .pagination-dots(:style="sliderControlsLayoutArrows")
                    .dot(v-for="(slide, index) in slides" :key="`dot-${index}`" @click.prevent="slidePagination(index)" :class="dotActive(index)")
          .hero-banner__overlay(:class="slide.overlayColor" :style="{opacity: 0. + slide.overlayOpacity}")
        .hero-banner__scroll-trigger(v-if="slide.enableScrollTrigger" @click.stop="scrollTrigger")
          icon(:fill-class="heroSchema.arrowColor" name="arrow_down" size="16px")
    //- THESE SHOULD BE MADE COMPONENTS
    .hero-carousel__controls-container(v-if="!heroSchema.enableTextBox")
      .controls-container(:style="sliderControlsLayout" :class="[layoutHorizontal, layoutVertical, textAlign]")
        .arrows(:style="sliderControlsLayoutArrows")
          icon.arrow-prev(:fill-class="heroSchema.arrowColor" name="chevron-left" size="12px" @click.prevent="slidePrev")
          icon.arrow-next(:fill-class="heroSchema.arrowColor" name="chevron-right" size="12px" @click.prevent="slideNext")
        .pagination-dots(:style="sliderControlsLayoutArrows")
          .dot(v-for="(slide, index) in slides" :key="`dot-${index}`" @click.prevent="slidePagination(index)" :class="dotActive(index)")
</template>

<script>
import { flexSwitch } from 'scripts/helpers/flex.js';
import { textAlignSwitch } from 'scripts/helpers/textAlign.js';
import { scrollBelowElement } from 'scripts/helpers/scroll.js';
import Icon from 'scripts/components/basic/Icon.vue';
import VButton from 'scripts/components/buttons/VButton.vue';
import VLink from 'scripts/components/buttons/VLink.vue';
import VArrowButton from 'scripts/components/buttons/VArrowButton.vue';
import css from 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

import { px } from 'scripts/filters/string';

export default {
  name: 'HeroBannerCarouselDesktop',
  components: {
    swiper,
    swiperSlide,
    Icon,
    VButton,
    VLink,
    VArrowButton
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
          overlayBgColor: String,
          overlayEnable: true,
          overlayOpacity: 80,
          preHeading: String,
          preHeadingColor: String,
          preHeadingColorMobile: String,
          subHeading: String,
          subHeadingColor: String,
          subHeadingColorMobile: String,
          ctaBgColor: String,
          ctaTextColor: String
        }
      ]
    }
  },
  data() {
    return {
      desktopOptions: {
        slidesPerView: 1,
        loop: true,
        threshold: 5,
      },
      currentIndex: 0,
    };
  },
  computed: {
    layoutHorizontal() {
      if (this.heroSchema.enableTextBox) {
        return flexSwitch('justify', this.heroSchema.layoutHorizontalTextBox);
      }
      return flexSwitch('justify', this.heroSchema.layoutHorizontal);
    },
    layoutVertical() {
      if (this.heroSchema.enableTextBox) {
        // always vertically centered when textbox enabled.
        return flexSwitch('align', 'middle');
      }
      return flexSwitch('align', this.heroSchema.layoutVertical);
    },
    textAlign() {
      if (this.heroSchema.enableTextBox) {
        // always vertically centered when textbox enabled.
        return textAlignSwitch(this.heroSchema.layoutHorizontalTextBox);
      }
      return textAlignSwitch(this.heroSchema.layoutHorizontal);
    },
    slides() {
      return this.heroArray.map((slide, index) => {
        return {
          image: slide.image,
          overlayEnable: slide.overlayEnable,
          overlayColor: slide.overlayColor,
          overlayBgColor: slide.overlayBgColor,
          overlayOpacity: `${slide.overlayOpacity / 100}`,
          preHeading: slide.preHeading,
          preHeadingColor: slide.preHeadingColor,
          heading: slide.heading,
          headingColor: slide.headingColor,
          subHeading: slide.subHeading,
          subHeadingColor: slide.subHeadingColor,
          copy: slide.copy,
          copyColor: slide.copyColor,
          enableCta: slide.enableCta,
          ctaLayout: slide.ctaLayout,
          ctaText: slide.ctaText,
          ctaUrl: slide.ctaUrl, 
          ctaBgColor: slide.ctaBgColor,
          ctaTextColor: slide.ctaTextColor,
        };
      });
    },
    swiper() {
      return this.$refs.heroCarouselDesktop.swiper;
    },
    sliderControlsLayout() {
      switch (this.heroSchema.layoutHorizontal) {
        case 'left':
          if (this.heroSchema.enableTextBox) {
            return {
              flexDirection: 'row'
            };
          }
          return {
            flexDirection: 'row-reverse'
          };
        case 'right':
          return '';
        case 'center':
          return {
            flexDirection: 'column'
          };
      }
      return '';
    },
    sliderControlsLayoutArrows() {
      switch (this.heroSchema.layoutHorizontal) {
        case 'left':
          return {
            justifyContent: 'flex-end'
          };
        case 'right':
          return '';
        case 'center':
          return {
            justifyContent: 'center',
            paddingTop: '10px'
          };
      }
      return '';
    },
    contentClass() {
      if (this.heroSchema.enableTextBox) {
        return {
          'hero-banner__content--text-box': true,
          [this.heroSchema.textBoxBgColor]: true
        };
      }
    },
    contentStyle() {
      if (this.heroSchema.enableTextBox && this.heroSchema.textBoxBgImage) {
        return {
          backgroundImage: `url(${this.heroSchema.textBoxBgImage})`
        };
      }
    },
    rootTextBox() {
      if (this.heroSchema.enableTextBox) {
        return {
          'hero-banner--text-box': true
        };
      }
    }
  },
  methods: {
    px,
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
    },
    textBoxBgStyle(slide) {
      return {
        backgroundImage: `url(${slide.image})`
      };
    },
    ctaStyles(slide) {
      return {
        backgroundColor: slide.ctaBgColor,
        color: slide.ctaTextColor,
      }
    },
    backgroundImageStyles(slide) {
      let styles = {
        backgroundImage: !this.heroSchema.enableTextBox && `url(${slide.image})`,
      }

      switch (this.heroSchema.layoutHorizontal) {
        case 'left':
          styles.right = 0;
          break;
        case 'right':
          styles.left = 0;
          break;
      }
      return styles;
    },
    slideContainerStyle(slide) {
      const {
        heroSchema: { topPadding, bottomPadding }
      } = this;

      // paddingBottom takes into account swiper controls height 
      let adjustedBottomPadding = bottomPadding;
      if (!this.heroSchema.enableTextBox && this.heroSchema.layoutVertical === 'bottom') {
        adjustedBottomPadding = adjustedBottomPadding + (this.heroSchema.layoutHorizontal === 'center' ? 80 : 56);
      }

      return {
        paddingTop: px(topPadding),
        paddingBottom: px(adjustedBottomPadding),
        minHeight: this.heroSchema.layout === 'short' ? '540px' : '720px'
      };
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
  min-height: 672px;
  height: 1px;
  padding: 0 64px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  @include mobile-only {
    position: auto;
    height: auto;
    flex-direction: column;
    padding: 0;
  }
  &--text-box {
    @include desktop-up {
      .hero-banner__text-box-bg {
        width: 83.3333%;
        height: 100%;
        background-size: cover;
        position: absolute;
      }
      &.flex-justify-end,
      &.flex-justify-start {
        padding: 0 20px;
      }
      &.flex-justify-end {
        .hero-banner__text-box-bg {
          top: 0;
          left: 0;
          right: auto;
        }
      }
      &.flex-justify-start {
        .hero-banner__text-box-bg {
          top: 0;
          right: 0;
          left: auto;
        }
      }
      .hero-banner__content-container {
        max-width: none;
        width: 100%;
      }
    }
  }
  &__bg {
    background-size: cover;
    background-position: center;
    position: absolute;
    height: 100%;
    top: 0;
    width: calc((100vw / 2) + 590px);

    @media (max-width: 1440px) {
      width: calc(100vw - 155px);
    }
  }
  &__container {
    position: relative;
  }
  &__content-container {
    position: relative;
    z-index: 21;
    @include desktop-up {
      max-width: $container-max-width;
      width: 100%;
      margin: 0 40px;
      @include ie {
        max-width: none;
      }
    }
  }
  &__content {
    display: inline-flex;
    flex-direction: column;
    max-width: 100%;
    padding: 40px 24px 40px 36px;
    position: relative;
    text-align: left;
    width: 100%;
    z-index: 21;
    @include desktop-up {
      max-width: 417px;
    }
    @include mobile-only {
      padding: 48px 14px;
    }
    @include desktop-up {
      &--text-box {
        padding: 40px;
        max-width: 672px;
        border-radius: $hero-content-border-radius;
        background-size: cover;
        &.short {
          padding: 24px;
        }
      }
    }
  }
  &__body-copy {
    margin: 16px 0;
    margin-top: 0;
    @include desktop-up {
      margin: 24px 0;
      margin-top: 0;
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
    z-index: -1;
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
.controls-container {
  display: flex;
  width: 100%;
  @include desktop-up {
    padding: 0  24px 0 36px;
  }
  .arrows {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;

    .icon {
      margin: 0 8px;
    }
  }
  .arrow-prev {
    &:active {
      transform: translateY(2px);
    }
  }
  .arrow-next {
    &:active {
      transform: translateY(2px);
    }
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

.controls-container.flex-justify-center.text-center {
  display: block;
}

.hero-carousel__controls-container {
  position: absolute;
  left: 50%;
  z-index: 5;
  transform: translateX(-50%);

  @include desktop-up {
    max-width: #{$container-max-width + 128};
    width: 100%;
    margin: 0 auto;
    padding: 0 64px;
    bottom: 83px;
  }
  &--text-box {
    @include desktop-up {
      position: absolute;
      z-index: 21;
      max-width: none;
      left: 20px;
      bottom: -24px;
      width: calc(16.6666% - 32px);
      transform: none;

      .controls-container {
        justify-content: center;
        width: auto;
      }
    }
  }

  /deep/ .button--arrow-primary {
    &:not(:hover) {
      background-color: transparent;
    }
  }
}
</style>