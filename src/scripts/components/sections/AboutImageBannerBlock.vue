<template lang="pug">
  .hero-banner__container(v-if="$mq !== 'mobile'", :class="block.mobileBgColor")
    a.hero-banner(v-if='block.enableCta' :class="[layoutHorizontal, layoutVertical, textAlign]" :style='backgroundStyles' :href='block.ctaUrl')
      .hero-banner__overlay(v-if="block.overlayEnable", :class="block.overlayColor" :style="overlayStyles")
      .hero-banner__content-container
        .hero-banner__content
          h2.h2.about-banner__heading(v-if="block.heading", :class="block.headingColor") {{block.heading}}
          h3.subheader.hero-banner__subheading(v-if="block.subHeading", :class="block.subHeadingColor") {{block.subHeading}}
          p.body-md.hero-banner__body-copy(v-if="block.copy", :class="block.copyColor") {{block.copy}}
          .hero-banner__cta-wrapper
            v-button.hero-banner__cta(v-if="block.ctaLayout.includes('button')" :href='block.ctaUrl' :class="block.ctaLayout" tag="a") {{block.ctaText}}
            v-link.hero-banner__cta(v-if="block.ctaLayout.includes('link')" :href='block.ctaUrl' :class="block.ctaLayout") {{block.ctaText}}
    .hero-banner(v-else :class="[layoutHorizontal, layoutVertical, textAlign]" :style='backgroundStyles')
      .hero-banner__overlay(v-if="block.overlayEnable", :class="block.overlayColor" :style="overlayStyles")
      .hero-banner__content-container
        .hero-banner__content
          h2.h2.about-banner__heading(v-if="block.heading", :class="block.headingColor") {{block.heading}}
          h3.subheader.hero-banner__subheading(v-if="block.subHeading", :class="block.subHeadingColor") {{block.subHeading}}
          p.body-md.hero-banner__body-copy(v-if="block.copy", :class="block.copyColor") {{block.copy}}
  .hero-banner__container(v-else)
    .hero-banner(:class="[layoutHorizontal, textAlign]")
      .hero-banner__image-mobile(:style="backgroundStylesMobile")
      .hero-banner__content(:class="block.mobileBgColor")
        h2.h2.about-banner__heading(v-if="block.heading", :class="block.headingColor") {{block.heading}}
        h3.subheader.hero-banner__subheading(v-if="block.subHeading", :class="block.subHeadingColor") {{block.subHeading}}
        p.body-md.hero-banner__body-copy(v-if="block.copy", :class="block.copyColor") {{block.copy}}
        .hero-banner__cta-wrapper(v-if='block.enableCta')
          v-button.hero-banner__cta(v-if="block.ctaLayout.includes('button')" :href='block.ctaUrl' :class="block.ctaLayout" tag="a") {{block.ctaText}}
          v-link.hero-banner__cta(v-if="block.ctaLayout.includes('link')" :href='block.ctaUrl' :class="block.ctaLayout") {{block.ctaText}}
</template>

<script>
  import VButton from 'scripts/components/buttons/VButton.vue'
  import VLink from 'scripts/components/buttons/VLink.vue'
  import { flexSwitch } from 'scripts/helpers/flex.js'
  import { textAlignSwitch } from 'scripts/helpers/textAlign.js'

  export default {
    name: 'AboutImageBannerBLock',
    components: {
      VButton,
      VLink
    },
    props: {
      block: Object
    },
    data() {
      return {
        backgroundStyles: {
          backgroundImage: `url(${this.block.image})`
        },
        overlayStyles: {
          opacity: `${this.block.overlayOpacity / 100}`
        }
      }
    },
    computed: {
      layoutHorizontal() {
        return flexSwitch('justify', this.block.layoutHorizontal)
      },
      layoutVertical() {
        return flexSwitch('align', this.block.layoutVertical)
      },
      textAlign() {
        return textAlignSwitch(this.block.layoutHorizontal)
      },
      backgroundStylesMobile() {
        if (this.block.imageMobileEnable) {
          return {
            backgroundImage: `url(${this.block.imageMobile})`
          }
        } else {
          return {
            backgroundImage: `url(${this.block.image})`
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .about-banner__heading {
    @include desktop-up {
      margin-bottom: 16px;
      max-width: 869px;
      width: 100%;
    }
  }

  .hero-banner {
    position: relative;
    display: flex;
    width: 100%;
    height: 448px;
    padding: 64px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    @include mobile-only {
      position: auto;
      height: auto;
      flex-direction: column;
      padding: 0;
    }
    &__container {
      position: relative;
    }
    &__content-container {
      z-index: 21;
      @include desktop-up {
        max-width: $container-max-width;
        width: 100%;
        margin: 0 auto;
      }
    }
    &__content {
      display: inline-flex;
      flex-direction: column;
      max-width: 672px;
      z-index: 21;
      @include mobile-only {
        padding: 48px 14px;
      }
    }
    &__subheading {
      margin-top: 8px;
      @include desktop-up {
        margin-top: 0;
      }
    }
    &__body-copy {
      margin: 16px 0 24px;
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
    }
    &__image-mobile {
      position: relative;
      height: 400px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
</style>