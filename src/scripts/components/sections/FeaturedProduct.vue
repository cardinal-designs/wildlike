<template lang="pug">
  div.fp
    a.fp__main-image-content-container(
    v-if="schema.settings.ctaUrl"
    :href="schema.settings.ctaUrl"
    )
      split-wrapper(
          :imageWidthClass="schema.settings.imageWidth"
          :backgroundColorClass="schema.settings.backgroundColor"
          textAlignmentClass="text-center"
          :reversedClass="schema.settings.layout"
          :marginTop="schema.settings.marginTop"
          :marginBottom="schema.settings.marginBottom"
        )
          template(slot="image")
            .fp__image(
              :class="[schema.settings.layout]"
              :style="`background-image: url(${schema.settings.lifestyleImage});`"
            )
          template(slot="content")
            .fp__main-wrap
              img.fp__product-image.hidden-sm(:src="schema.settings.productImageOverride || schema.settings.product.featured_image", :alt="schema.settings.product.title")
              h2.fp__header(:class="[schema.settings.imageWidth === 'sw--50' ? 'h4': 'h5', schema.settings.productTitleColor]") {{ schema.settings.productTitleOverride || schema.settings.product.title }}
              div.fp__body.client-generated(
                :class="[schema.settings.productDescriptionColor]"
                v-html="schema.settings.productDescription || truncateHTML(schema.settings.product.description, 134)"
              )
              component(
                :is="/link/.test(schema.settings.ctaStyle) ? 'v-link': 'v-button'"
                :class="schema.settings.ctaStyle"
                v-if="schema.settings.ctaText"
              ) {{ schema.settings.ctaText }}
    .fp__main-image-content-container(v-else)
      split-wrapper(
        :imageWidthClass="schema.settings.imageWidth"
        :backgroundColorClass="schema.settings.backgroundColor"
        textAlignmentClass="text-center"
        :reversedClass="schema.settings.layout"
        :marginTop="schema.settings.marginTop"
        :marginBottom="schema.settings.marginBottom"
      )
        template(slot="image")
          .fp__image(
            :class="[schema.settings.layout]"
            :style="`background-image: url(${schema.settings.lifestyleImage});`"
          )
        template(slot="content")
          .fp__main-wrap
            img.fp__product-image.hidden-sm(:src="schema.settings.productImageOverride || schema.settings.product.featured_image", :alt="schema.settings.product.title")
            h2.h3-mobile.fp__header(:class="[schema.settings.imageWidth === 'sw--50' ? 'h4-tablet-up': 'h5-tablet-up', schema.settings.productTitleColor]") {{ schema.settings.productTitleOverride || schema.settings.product.title }}
            div.fp__body.body-md.client-generated(
              :class="[schema.settings.productDescriptionColor]"
              v-html="schema.settings.productDescription || truncateHTML(schema.settings.product.description, 134)"
            )
            component(
              :is="/link/.test(schema.settings.ctaStyle) ? 'v-link': 'v-button'"
              :class="schema.settings.ctaStyle"
              v-if="schema.settings.ctaText"
            ) {{ schema.settings.ctaText }}
</template>

<script>
import VButton from '../buttons/VButton.vue';
import VLink from '../buttons/VLink.vue';
import SplitWrapper from '../basic/SplitWrapper.vue';
import truncateHTML from 'truncate-html';

export default {
  name: "FeaturedProduct",
  props: {
    schema: Object,
    customFields: Object,
  },
  methods: {
    truncateHTML
  },
  components: {
    VButton,
    VLink,
    SplitWrapper
  },
}
</script>

<style lang="scss">
  .fp {
    .sw {
      padding-top: 12px;
      padding-bottom: 0;

      &__main-image-content-container {
      
        @include tablet-up {
          padding: 48px;
        }
      }
    }

    .sw__main-wrap {
      padding-top: 0;

      @include tablet-up {
        padding-top: 8px;
      }
    }

    &__main-wrap > * {
      margin-bottom: 24px;
    }

    &__main-wrap > *:last-child {
      margin-bottom: 0;
    }

    &__title {
      margin-bottom: 16px;
    }

    &__product-image {
      width: 256px;
      margin: 0 auto 16px;
    }

    &__header {
      margin: 16px auto;
      margin-top: 0;

      @include tablet-up {
        margin-top: 16px;
      }
    }

    .button {
      margin: 0;
    }

    @include tablet-up {
      .sw {
        padding-top: 0;
      }

      .sw__main {
        padding: 3.27% 5.86%;
      }

      &__header {
        margin: 0 auto 16px;
      }
    }
  }
</style>