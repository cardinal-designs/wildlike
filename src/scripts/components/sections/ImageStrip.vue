<template lang="pug">
    section.itp-section-padded(
      :style="paddingStyles"
    )
      div.itp.text-center.container(
        v-if="schema.blocks.length >= 2"
      )
        .itp__blocks.itp__static
          component.itp__itp(
            v-for="block in schema.blocks"
            :is="block.settings.itp_url ? 'a' : 'div'"
            :href="block.settings.itp_url"
            :aria-label="block.settings.link_aria_label"
            :target="block.settings.itp_link_target || '_self'"
            :key="block.id"
            v-if="block.settings.itp_logo"
          )
            img.itp__img(
              aria-role="presentation"
              v-if="block.settings.itp_logo" 
              :src="imageSize(block.settings.itp_logo, '1360x1360')", 
              :srcset="`${imageSize(block.settings.itp_logo, '680x680')} 1x, ${imageSize(block.settings.itp_logo, '1360x1360')} 2x`"
              :alt="block.itp_logo_alt"
            )
</template>

<script>
import { imageSize, imageCrop, checkUndefined } from '../../helpers/util';
import { px } from 'scripts/filters/string.js'

export default {
  name: "ImageStrip",
  props: {
    schema: Object
  },
  computed: {
    paddingStyles() {
      return {
        'padding-top': px(checkUndefined(this.schema.settings.marginTop, 56)), 
        'padding-bottom': px(checkUndefined(this.schema.settings.marginBottom, 56))
      }
    }
  },
  methods: {
    imageSize,
    imageCrop
  },
}
</script>

<style lang="scss" scoped>
  .itp-section-padded {
    padding: 0 24px;
    @include mobile-only {
      padding: 0;
    }

    .booking & {

      @include mobile-only {
        padding-top: 28px !important; //had to use important as it is computed value and only needed for booking page
        padding-bottom: 28px !important;
      }
    }
  }
  
  .itp {
    &__title {
      user-select: none;
      margin-bottom: 32px;

      @include desktop-only {
        margin-bottom: 32px;
      }
    }

    &__img {
      user-select: none;
      padding: 0;
      width: 100%;
    }

    &__static {
      display: none;
    }

    &__itp {
      margin: 0 auto;
      width: 50%;
      @include mobile-only {
        width: 100%;
      }
    }

    &__pagination {
      position: absolute;
      top: calc(100% - 16px);
      left: 0;
      width: 100%;
    }

    @include desktop-only {
      &__itp {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__static {
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
      }
    }
    @include mobile-only {
      &__itp {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__static {
        display: flex;
        justify-content: center;
        flex-direction: column;
      }
    }
  }
</style>