<template lang="pug">
  .image-grid-container(v-if="images.length >= 2")
    .container
      .image-grid__header-content(v-if="header")
        .image-grid__header.h3 {{header}}
        a.link.link--primary(v-if="header_link_text && header_link_url" :href="header_link_url") 
          span.link__content {{header_link_text}}
          icon(name="arrow_long_right" size="20px")
      .image-grid(:class="gridClass")
        .image-grid-item(v-for="(image, index) in validImages" :key="index" :class="{ 'image-grid-item--main': isMainGridItem(index) }" :style="{ 'background-image': `url(${image.image})` }")
          .image-grid-item__overlay(:class="{ 'bg-black': image.overlay_color === 'dark', 'bg-white': image.overlay_color === 'light' }" :style="{ 'opacity': image.overlay_opacity ? (image.overlay_opacity/100) : .5 }")
          .image-grid-item__content(:class="{ 'color-black': image.text_color === 'dark', 'color-white': image.text_color === 'light' }")
            .image-grid-item__preheader.preheader(v-if="image.preheader") {{image.preheader}}
            .image-grid-item__header.h4-mobile.h5-tablet-up(v-if="image.header") {{image.header}}
            .image-grid-item__text.body-md.u-hidden-mobile-only(v-if="image.text") {{image.text}}
            a.button.image-grid-item__cta(v-if="image.cta_text && image.cta_link" :href="image.cta_link" :class="buttonClass")
              span.button__content {{image.cta_text}}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'ImageGrid',
    components: { Icon },
    props: {
      header: {
        type: String,
      },
      header_link_text: {
        type: String,
      },
      header_link_url: {
        type: String,
      },
      images: {
        type: Array,
        default: () => [],
      },
      cta_style: {
        type: String,
        default: 'primary',
      },
      align: {
        type: String,
        default: 'left',
        validator (value) {
          return [
            'left',
            'right'
          ].includes(value)
        }
      },
    },
    computed: {
      gridClass() {
        const gridModifier = this.images.length > 2 ? this.align : 'half-half';
        return `image-grid--${gridModifier}`;
      },
      buttonClass() {
        return `button--${this.cta_style}`;
      },
      validImages() {
        return this.images.filter(image => image.image);
      }
    },
    methods: {
      isMainGridItem(index) {
        if (this.images.length === 2) {
          return true;
        }
        const mainIndex = this.align === 'left' ? 0 : 2;

        return index === mainIndex;
      }
    },
    data() {
      return {}
    },
  }
</script>

<style lang="scss">
  .image-grid-container {
    padding: 8px 0 32px;

    @include tablet-up {
      padding: 16px 0 64px;
    }
  }

  .image-grid {
    display: flex;
    flex-direction: column;

    @include desktop-up {
      height: 688px;
      flex-wrap: wrap;
    }

    &__header-content {
      text-align: center;
      margin-bottom: 16px;

      @include desktop-up {
        display: flex;
        margin-bottom: 36px;
        text-align: left;
        justify-content: space-between;
        align-items: flex-end;
      }
    }

    &__header {
      margin-bottom: 12px;

      @include desktop-up {
        margin-bottom: 0;
      }
    }
  }

  .image-grid--half-half {
    @include desktop-up {
      height: 320px;
    }
  }

  .image-grid-item {
    position: relative;
    min-height: 180px;
    margin-bottom: 16px;
    background-position: center center;
    background-size: cover;
    order: 2;
  
    @include desktop-up {
      width: 42%;
      order: 1;
      flex-basis: calc(50% - 8px);
    }

    .image-grid--half-half & {
      @include desktop-up {
        min-height: 0;
      }
    }

    .image-grid--left &:last-child,
    .image-grid--right &:nth-child(2) {
      margin-bottom: 0;
    }

    &__overlay {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
    }

    &__content {
      position: relative;
      z-index: 2;
      padding: 16px 12px;

      .image-grid-item--main & {
        padding: 36px 12px;
      }
    }

    &__preheader {
      margin-bottom: 8px;
      text-transform: none;
    }

    &__header {
      margin-bottom: 16px;

      @include desktop-up {
        margin-bottom: 8px;
      }

      .image-grid-item--main & {
        @include h3();

        @include tablet-up {
          @include h4-tablet();
        }
      }
    }

    &__text {
      margin-bottom: 16px;
      max-width: 336px;

      .image-grid-item--main & {
        max-width: 552px;
      }
    }
    
    &__cta {
      .button__content {
        font-size: 1rem;
      }
    }
  }

  .image-grid-item--main {
    min-height: 320px;
    order: 1;

    @include desktop-up {
      margin-bottom: 0;
      width: calc(58% - 16px);
      flex-basis: 100%;
    }

    .image-grid--left & {
      @include desktop-up {
        margin-right: 16px;
      }
    }

    .image-grid--right & {
      @include desktop-up {
        margin-left: 16px;
      }
    }

    .image-grid--half-half & {
      @include desktop-up {
        width: calc(50% - 8px);
      }

      &:nth-child(1) {
        @include desktop-up {
          align-self: flex-start;
        }
      }

      &:last-child {
        @include desktop-up {
          align-self: flex-end;
        }
      }
    }
  }
</style>