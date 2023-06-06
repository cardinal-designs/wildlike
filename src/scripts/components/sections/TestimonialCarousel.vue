<template lang="pug">
    section.testimonials.testimonials--carousel.container.text-center(:style="paddingStyles")
      h3.h3.testimonials__title.text-center(
        :class="schema.settings.sectionHeaderColor"
      ) {{ schema.settings.sectionHeader }}
      swiper#testimonial-slider.testimonials__testimonials(
        :options="swiperOptions"
        ref="swiper"
      )
        swiper-slide(
            v-for="block in schema.blocks"
            :key="block.id"
          )
          article.testimonials__testimonial
            div.testimonials__inner
              p.h7.testimonials__source(v-if="block.settings.testimonial_source", :class="schema.settings.textColor") {{ block.settings.testimonial_source }}
              img(v-else :src="schema.settings.defaultQuoteImg", alt="quotation mark", aria-role="presentation")
              blockquote.body-sm.testimonials__body(
                :class="schema.settings.textColor"
                v-html="block.settings.testimonial_body"
              )
              img.testimonials__img(
                aria-role="presentation"
                v-if="block.settings.testimonial_logo"
                :src="imageSize(block.settings.testimonial_logo, '256x256')",
                :srcset="`${imageSize(block.settings.testimonial_logo, '128x128')} 1x, ${imageSize(block.settings.testimonial_logo, '256x256')} 2x`"
                :alt="block.testimonial_logo_alt"
              )
      div.testimonials__pagination
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { imageSize, imageCrop, checkUndefined } from '../../helpers/util';
import { px } from 'scripts/filters/string.js'

export default {
  name: "TestimonialBlocks",
  props: {
    schema: Object
  },
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      slideIndex: 0,
      swiperOptions: {
        pagination: {
          el: '.testimonials__pagination',
          clickable: true
        },
      }
    }
  },
  computed: {
    paddingStyles() {
      return {
        'padding-top': px(checkUndefined(this.schema.settings.marginTop, 56)),
        'margin-bottom': px(checkUndefined(this.schema.settings.marginBottom, 56))
      }
    }
  },
  methods: {
    imageSize,
    imageCrop,

    slide (index) {
      this.$refs.swiper.swiper.slideTo(index);
      this.slideIndex = index;
    }
  },
}
</script>

<style lang="scss">
  .testimonials.testimonials--carousel {
    max-width: 640px;

    .testimonials__pagination-images {
      display: none;
    }

    .testimonials__testimonial {
      max-width: 100%;
    }

    .testimonials__source {
      font-size: 1.125rem;
      font-weight: 400;
      line-height: 1.125rem;
      margin-bottom: 8px;
    }

    .testimonials__inner {
      padding: 16px 0;
    }

    .testimonials__img {
      margin-bottom: 0;
      min-width: 40px;
      width: auto;
      max-width: 30%;
    }

    .testimonials__body {
      margin-bottom: 32px;

      p {
        font-family: $font-family-secondary;
        font-size: 1.625rem;
        font-weight: 700;
        line-height: 1.625rem;
        text-transform: uppercase;
        @include tablet-up {
          font-size: 1.75rem;
          line-height: 1.75rem;
        }
      }
    }

    .swiper-pagination-bullet {
      margin: 0 8px;
      background: $color-white;
      border: 1px solid $color-primary-500;
      width: 8px;
      height: 8px;
      opacity: 1 !important; //overide third party 'swiper'
    }

    .swiper-pagination-bullet-active {
      background: $color-primary-500;
    }

    @include tablet-up {
      .testimonials__img {
        display: none;
      }
    }
  }
</style>
