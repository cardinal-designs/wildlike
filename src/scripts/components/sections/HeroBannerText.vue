<template lang="pug">
  div(:class="heroSchema.bgColor")
    .hero-banner-text__container(:style="{'max-width': heroSchema.maxWidth}")
      .hero-banner-text(:class="[layoutHorizontal, layoutVertical, textAlign]" :style="backgroundStyles")
        .hero-banner-text__content-container(v-if="heroSchema.textLayout !== 'two_column' || $mq === 'mobile'")
          .hero-banner-text__image-mobile(v-if="$mq === 'mobile' && heroSchema.mobileLayout === 'below' && (heroSchema.image.length > 0 || heroSchema.imageMobile > 0)" :style="backgroundStylesMobile")
          .hero-banner-text__content
            h4.preheader.hero-banner-text__preheading(:class="heroSchema.preHeadingColor" v-if="heroSchema.preHeading") {{heroSchema.preHeading}}
            h2.h1.hero-banner-text__heading(:class="heroSchema.headingColor" v-if="heroSchema.heading") {{heroSchema.heading}}
            h3.subheader.hero-banner-text__subheading(:class="heroSchema.subHeadingColor" v-if="heroSchema.subHeading") {{heroSchema.subHeading}}
            .body-md.hero-banner-text__body-copy.client-generated(:class="{[heroSchema.copyColor]: true, 'hero-banner-text__body-copy-margin-bottom--none': !heroSchema.enableCta}" v-if="heroSchema.copy" v-html="heroSchema.copy")
            .hero-banner-text__cta-wrapper(v-if='heroSchema.enableCta && heroSchema.ctaText')
              v-button.hero-banner__cta(v-if="heroSchema.ctaLayout.includes('button')" :href='heroSchema.ctaUrl' :class="heroSchema.ctaLayout" tag="a") {{heroSchema.ctaText}}
              v-link.hero-banner__cta(v-if="heroSchema.ctaLayout.includes('link')" :href='heroSchema.ctaUrl' :class="heroSchema.ctaLayout") {{heroSchema.ctaText}}
        .hero-banner-text__content-container(v-else :class="heroSchema.textLayout")
          .hero-banner-text__content
            .hero-banner-text__two-columns-left
              h4.preheader.hero-banner-text__preheading(:class="heroSchema.preHeadingColor" v-if="heroSchema.preHeading") {{heroSchema.preHeading}}
              h2.h1.hero-banner-text__heading(:class="heroSchema.headingColor" v-if="heroSchema.heading") {{heroSchema.heading}}
              h3.subheader.hero-banner-text__subheading(:class="heroSchema.subHeadingColor" v-if="heroSchema.subHeading") {{heroSchema.subHeading}}
            .hero-banner-text__two-columns-right
              .body-md.hero-banner-text__body-copy.client-generated(:class="{[heroSchema.copyColor]: true, 'hero-banner-text__body-copy-margin-bottom--none': !heroSchema.enableCta}" v-if="heroSchema.copy" v-html="heroSchema.copy")
              .hero-banner-text__cta-wrapper(v-if='heroSchema.enableCta && heroSchema.ctaText')
                v-button.hero-banner__cta(v-if="heroSchema.ctaLayout.includes('button')" :href='heroSchema.ctaUrl' :class="heroSchema.ctaLayout" tag="a") {{heroSchema.ctaText}}
                v-link.hero-banner__cta(v-if="heroSchema.ctaLayout.includes('link')" :href='heroSchema.ctaUrl' :class="heroSchema.ctaLayout") {{heroSchema.ctaText}}
        .hero-banner-text__overlay(v-if="heroSchema.overlayEnable", :class="heroSchema.overlayColor" :style="overlayStyles")
</template>

<script>
  import { flexSwitch } from 'scripts/helpers/flex.js'
  import { textAlignSwitch } from 'scripts/helpers/textAlign.js'
  import { scrollBelowElement } from 'scripts/helpers/scroll.js'
  import Icon from 'scripts/components/basic/Icon.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'
  import VLink from 'scripts/components/buttons/VLink.vue'

  export default {
    name: 'HeroBannerText',
    components: {
      Icon,
      VButton,
      VLink
    },
    props: {
      heroSchema: {
        type: Object,
        default: () => ({
          layoutHorizontal: String,
          layoutVertical: String,
          bgColor: String,
          enableScrollTrigger: Boolean,
          arrowColor: String,
          image: String,
          imageMobile: String,
          imageMobileEnable: Boolean,
          mobileLayout: String,
          overlayEnable: Boolean,
          overlayColor: String,
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
          ctaUrl: String
        })
      }
    },
    data() {
      return {
        overlayStyles: {
          opacity: `${this.heroSchema.overlayOpacity / 100}`
        }
      }
    },
    computed: {
      layoutHorizontal() {
        return flexSwitch('justify', this.heroSchema.layoutHorizontal)
      },
      layoutVertical() {
        return flexSwitch('align', this.heroSchema.layoutVertical)
      },
      textAlign() {
        return textAlignSwitch(this.heroSchema.layoutHorizontal)
      },
      backgroundStylesMobile() {
        if (this.heroSchema.imageMobileEnable) {
          return {
            backgroundImage: `url(${this.heroSchema.imageMobile})`
          }
        } else {
          return {
            backgroundImage: `url(${this.heroSchema.image})`
          }
        }
      },
      backgroundStyles() {
        if (this.$mq === 'mobile') {
          if (this.heroSchema.mobileLayout === 'overlay') {
            return this.backgroundStylesMobile;
          } else {
            return {};
          }
        }
        return {
          backgroundImage: `url('${this.heroSchema.image}')`
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .hero-banner-text {
    position: relative;
    display: flex;
    width: 100%;
    min-height: 448px;
    padding: 64px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    @include mobile-only {
      position: auto;
      min-height: 0;
      flex-direction: column;
      padding: 0;
    }
    &__container {
      position: relative;
      margin: 0 auto;
    }
    &__content-container {
      z-index: 21;
      @include desktop-up {
        max-width: $container-max-width;
        width: 100%;
        margin: 0 auto;
        @include ie {
          max-width: none;
        }
      }
    }
    &__content {
      display: inline-flex;
      flex-direction: column;
      max-width: 100%;
      width: 100%;
      z-index: 21;
      @include mobile-only {
        padding: 48px 14px;
      }
      @include desktop-up {
        max-width: 869px;
        .two_column {
          display: flex;
          flex-direction: row;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          max-width: $container-max-width;
          text-align: justify;
          .hero-banner-text__two-columns-left {
            padding-right: 16px;
            text-align: left;
          }
          .hero-banner-text__two-columns-right {
            padding-left: 16px;
          }
        }
      }
      .two_column & {
        @include desktop-up {
          display: flex;
          flex-direction: row;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          max-width: $container-max-width;
          text-align: justify;
          .hero-banner-text__two-columns-left {
            padding-right: 16px;
            text-align: left;
          }
          .hero-banner-text__two-columns-right {
            padding-left: 16px;
          }
        }
      }
    }
    &__heading {
      margin-bottom: 8px;
      @include desktop-up {
        margin-bottom: 16px;
      }
    }
    &__subheading {
      .two_column & {
        @include desktop-up {
          margin-bottom: 0;
        }
      }
    }
    &__body-copy {
      margin: 8px 0 24px;
      @include desktop-up {
        margin: 24px 0;
      }

      * {
        font-size: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
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
      z-index: 20;
    }
    &__image-mobile {
      position: relative;
      height: 400px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
  }

  .two_column .hero-banner-text__body-copy {

    @include desktop-up {
      margin-top: 0;
      margin-bottom: 32px;
    }
  }

  .hero-banner-text__two-columns-left,
  .hero-banner-text__two-columns-right {
    width: 50%;
  }

  .hero-banner-text__body-copy-margin-bottom--none {
    margin-bottom: 0;
  }
</style>