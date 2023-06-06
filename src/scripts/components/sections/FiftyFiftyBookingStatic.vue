<template lang="pug">
  .fifty-fifty-booking(:class="schema.backgroundColor")
    .ff__container(:style="{'max-width': schema.maxWidth}")
      split-wrapper(
        :imageWidthClass="schema.imageWidth"
        :backgroundColorClass="schema.backgroundColor"
        :textAlignmentClass="schema.textAlignment"
        :reversedClass="schema.layout"
        :marginTop="schema.marginTop"
        :marginBottom="schema.marginBottom"
      )
        template(slot="image")
          a.ff__image.ff__image--mobile(
            :href="schema.ctaUrl"
            :style="`background-image: url(${schema.imageMobile || schema.imageDesktop});`",
            :aria-label="schema.subheader || schema.preheader"
          )
          a.ff__image.ff__image--desktop.hidden-sm(
            :href="schema.ctaUrl"
            :style="`background-image: url(${schema.imageDesktop});`",
            :aria-label="schema.subheader || schema.preheader"
          )
        template(slot="content")
          .ff__main-wrap
            p.preheader.ff__preheader(:class="schema.preheaderColor", v-if="schema.preheader") {{ schema.preheader }}
            h2.ff__header(:class="[schema.imageWidth === 'sw--50' ? 'h3': 'h2', schema.headerColor]", v-if="schema.header") {{ schema.header }}
            p.subheader.ff__subheader(:class="schema.subheaderColor", v-if="schema.subheader") {{ schema.subheader }}
            .ff__body(:class="{[schema.bodyColor]: true, 'ff-body-margin-bottom--none': !(schema.ctaText && schema.ctaUrl)}", v-html="schema.body", v-if="schema.body")
</template>

<script>
// import ProductTileBooking from '../product/ProductTileBooking.vue';
import Icon from 'scripts/components/basic/Icon.vue';
import VButton from '../buttons/VButton.vue';
import VLink from '../buttons/VLink.vue';
import SplitWrapper from '../basic/SplitWrapper.vue';

export default {
  name: "FiftyFiftyBookingStatic",
  components: {
    VButton,
    VLink,
    SplitWrapper,
    Icon
  },
  props: {
    schema: Object,
    popupHeader: String,
    popupDescription: String,
    index: [String, Number]
  }
}
</script>

<style lang="scss">
  .ff {
    &__container {
      margin: 0 auto;

      @include mobile-only {
        .sw__image {
          padding-right: 16px;
          padding-left: 16px;
        }
      }

      @include desktop-up {
        .sw__image {
          padding-left: 40px;
        }


        .sw--reverse {
          .sw__image {
            padding-left: 0;
            padding-right: 40px;
          }
        }
      }
    }

    &__main-wrap > * {
      margin-bottom: 8px;
    }

    &__main-wrap > *:last-child {
      margin-bottom: 0;
    }

    &__header {
      @include desktop-up {
        margin-bottom: 8px;
      }
    }

    &__body {
      margin-bottom: 24px;
      @include mobile-only {
        margin-bottom: 16px;
      }
    }

    &__body-margin-bottom--none {
      margin-bottom: 0;
    }


    .sw &__image--desktop {
      display: none;
    }

    .button {
      margin: 0;
    }

    @include desktop-up {
      .sw &__image--mobile {
        display: none;
      }

      .sw &__image--desktop {
        display: block;
      }

      .sw__main {
        padding: 5%;
      }
    }
  }
  @include mobile-only {
    .sw {
      &__image {
        height: 229px;
        min-height: 180px;
      }
    }
    .sw__main {
      padding: 0px 14px 24px;
    }
    .sw {
      padding: 24px 12px 0px;
    }
  }
  .ff__body.body-md p {
    // Passing the selected color to v-html
    color: inherit;
  }

  .ff__body p {
    font-family: $font-family-secondary;
    font-size: rem(16);
    font-weight: 600;
    line-height: 24px;
  }
</style>
