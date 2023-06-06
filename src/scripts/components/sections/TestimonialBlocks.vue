<template lang="pug">
    section.testimonials.container.text-center(
      :class="schema.settings.testimonialsLayout"
      :style="paddingStyles"
    )
      h3.h3.testimonials__title.text-center(
        :class="schema.settings.sectionHeaderColor"
      ) {{ schema.settings.sectionHeader }}
      div.testimonials__testimonials
        article.testimonials__testimonial(
          v-for="block in schema.blocks"
        )
          div.testimonials__inner(
            :class="[schema.settings.testimonialBackgroundColor]"
          )
            img.testimonials__img(
              aria-role="presentation"
              v-if="block.settings.testimonial_logo" 
              :src="imageSize(block.settings.testimonial_logo, '256x256')", 
              :srcset="`${imageSize(block.settings.testimonial_logo, '128x128')} 1x, ${imageSize(block.settings.testimonial_logo, '256x256')} 2x`"
              :alt="block.testimonial_logo_alt"
            )
            blockquote.body-sm.testimonials__body(
              :class="schema.settings.textColor"
              v-html="block.settings.testimonial_body"
            )
            p.h7.testimonials__source(:class="schema.settings.textColor") {{ block.settings.testimonial_source }}
</template>

<script>
import { imageSize, imageCrop, checkUndefined } from '../../helpers/util';
import { px } from 'scripts/filters/string.js'

export default {
  name: "TestimonialBlocks",
  props: {
    schema: Object
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
    imageCrop
  },
}
</script>

<style lang="scss">
  .testimonials {
    &__title {
      margin-bottom: 16px;  
    }

    &__inner {
      padding: 24px;
    }

    &__inner * {
      margin-bottom: 16px;
    }

    &__img {
      width: 14px;
      user-select: none;
    }

    &__source {
      margin: 0;
    }

    &--colored-blocks &__testimonial {
      margin-bottom: 24px;
    }
    
    @include tablet-up {
      &__testimonials {
        display: flex;
        justify-content: center;
        align-items: flex-start;
      }

      &__testimonial {
        margin-bottom: 0;
        max-width: ($container-max-width / 3);
        padding: 0 16px;
        min-height: 150px;
      }

      &__img {
        height: 28px;
        width: auto;
      }

      &--colored-blocks &__testimonial {
        margin-bottom: 0;
      }

      &--colored-blocks &__testimonial:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>