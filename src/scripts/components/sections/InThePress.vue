<template lang="pug">
    section.itp-section-padded(
      :class="[schema.settings.backgroundColor]"
      :style="paddingStyles"
    )
      div.itp.text-center.container
        h2.h4.itp__title.text-center(
          :class="schema.settings.sectionHeaderColor"
        ) {{ schema.settings.sectionHeader }}
        .itp__blocks.itp__static
          component.itp__itp(
            v-for="block in schema.blocks"
            :is="block.settings.itp_url ? 'a' : 'div'"
            :href="block.settings.itp_url"
            :target="block.settings.itp_link_target || '_self'"
            :key="block.id"
            v-if="block.settings.itp_logo"
          )
            img.itp__img(
              aria-role="presentation"
              v-if="block.settings.itp_logo"
              :src="imageSize(block.settings.itp_logo, '400x400')",
              :srcset="`${imageSize(block.settings.itp_logo, '200x200')} 1x, ${imageSize(block.settings.itp_logo, '400x400')} 2x`"
              :alt="block.itp_logo_alt"
            )
        .itp__slider
          div.itp__pagination
          swiper.itp__blocks(:options="swiperOptions")
            swiper-slide(
              v-for="block in schema.blocks"
              :key="block.id"
              v-if="block.settings.itp_logo"
            )
              component.itp__itp(
                :is="block.settings.itp_url ? 'a' : 'div'"
                :href="block.settings.itp_url"
                :target="block.settings.itp_link_target || '_self'"
                v-if="block.settings.itp_logo"
              )
                img.itp__img(
                  aria-role="presentation"
                  v-if="block.settings.itp_logo"
                  :src="imageSize(block.settings.itp_logo, '400x400')",
                  :srcset="`${imageSize(block.settings.itp_logo, '200x200')} 1x, ${imageSize(block.settings.itp_logo, '400x400')} 2x`"
                  :alt="block.itp_logo_alt"
                )
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { imageSize, imageCrop, checkUndefined } from '../../helpers/util';
import { px } from 'scripts/filters/string.js'

export default {
  name: "InThePress",
  props: {
    schema: Object
  },
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOptions: {
        pagination: {
          el: '.itp__pagination',
          clickable: true
        }
      }
    }
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

<style lang="scss">
  .itp-section-padded {
    padding: 0 24px;
  }

  .itp {
    &__title {
      user-select: none;
      margin-bottom: 32px;

      @include tablet-up {
        margin-bottom: 32px;
      }
    }

    &__slider {
      position: relative;
      padding-bottom: 32px;
    }

    &__img {
      user-select: none;
    }

    &__static {
      display: none;
    }

    &__itp {
      margin: 0 auto;
      width: 50%;
    }

    &__pagination {
      position: absolute;
      top: calc(100% - 16px);
      left: 0;
      width: 100%;
    }

    .swiper-pagination-bullet {
      margin: 0 4px;
      background: $color-white;
      border: 1px solid $color-primary-500;
      width: 8px;
      height: 8px;
    }

    .swiper-pagination-bullet-active {
      margin: 0 4px;
      background: $color-primary-500;
    }

    @include tablet-up {
      &__itp {
        width: 18%;
        margin: 0 2.13%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__slider {
        display: none;
      }

      &__static {
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
      }
    }
  }
</style>
