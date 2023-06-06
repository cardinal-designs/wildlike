<template lang="pug">
  .collection-banner
    .collection-banner__main-container(:style="backgroundImage")
      .collection-banner__content(
        :class="contentClasses")
        h3.collection-banner__heading {{ banner.heading }}
        p.collection-banner__copy(v-if="banner.copy") {{ banner.copy }}
        v-button(
          v-if="$mq !== 'mobile' && banner.ctaText && banner.ctaUrl"
          :class="banner.ctaStyle | ctaClass"
          :href="banner.ctaUrl"
          tag="a"
        ) {{ banner.ctaText }}
        v-link(
          v-if="$mq === 'mobile' && banner.ctaText && banner.ctaUrl"
          primary
          :light="this.banner.overlayColor === 'Dark'"
          :custom-classes="banner.overlayColor | linkColorClass"
          :href="banner.ctaUrl"
        ) {{ banner.ctaText }}
      .collection-banner__overlay-container(
        v-if="banner.overlayColor && banner.overlayOpacity"
        :class="banner.overlayColor | overlayColorClass"
        :style="overlayOpacity")
</template>

<script>
  import VButton from '../buttons/VButton.vue'
  import VLink from '../buttons/VLink.vue'

  export default {
    name: 'CollectionBanner',
    components: { VButton, VLink },
    props: {
      banner: {
        type: Object,
        required: true,
        default: () => ({
          "desktopImage": String,
          "mobileImage": String,
          "heading": String,
          "copy": String,
          "ctaText": String,
          "ctaUrl": String,
          "ctaStyle": String,
          "textColor": String,
          "overlayColor": String,
          "overlayOpacity": String,
          "textAlignment": String
        })
      }
    },
    data() {
      return {
        filters: this.$options.filters
      }
    },
    computed: {
      backgroundImage() {
        return {
          'background-image': `url(${this.$mq === 'mobile' && this.banner.mobileImage ? this.banner.mobileImage : this.banner.desktopImage})`
        }
      },
      overlayOpacity() {
        const opacityFloat = this.banner.overlayOpacity / 100
        return `opacity: ${opacityFloat};`
      },
      contentClasses() {
        let classes = []
        classes.push(this.filters.textColorClass(this.banner.textColor))
        classes.push(this.filters.textAlignClass(this.banner.textAlignment))
        return classes
      }
    }
  }
</script>

<style scoped lang="scss">
  .collection-banner {
    height: 384px;
    width: 100%;
    @include mobile-only {
      height: 224px;
      padding:0 18px;
    }
    &__overlay-container {
      height: inherit;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 4;
      border-radius: 4px;
    }
    &__main-container {
      position: relative;
      display: flex;
      align-items: center;
      padding: 20px;
      height: inherit;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border-radius: 4px;
    }
    &__content {
      display: flex;
      flex-direction: column;
      z-index: 5;

      & > * + * {
        margin-top: 16px;
      }

      &.text-left {
        align-items: flex-start;
      }
      &.text-center {
        align-items: center;
        margin: 0 auto;
      }
      &.text-right {
        align-items: flex-end;
        margin-left: auto;
      }
    }
  }
</style>