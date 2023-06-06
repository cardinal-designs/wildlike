<template lang="pug">
  div(:class="schema.settings.backgroundColor")
    .ff__container(:style="{'max-width': schema.settings.maxWidth}")
      split-wrapper(
        :imageWidthClass="schema.settings.imageWidth"
        :backgroundColorClass="schema.settings.backgroundColor"
        :textAlignmentClass="schema.settings.textAlignment"
        :reversedClass="schema.settings.layout"
        :marginTop="schema.settings.marginTop"
        :marginBottom="schema.settings.marginBottom"
      )
        template(slot="image")
          a.ff__image.ff__image--mobile(
            :href="schema.settings.ctaUrl"
            :style="`background-image: url(${schema.settings.imageMobile || schema.settings.imageDesktop});`",
            :aria-label="schema.settings.subheader || schema.settings.preheader"
          )
          a.ff__image.ff__image--desktop.hidden-sm(
            :href="schema.settings.ctaUrl"
            :style="`background-image: url(${schema.settings.imageDesktop});`",
            :aria-label="schema.settings.subheader || schema.settings.preheader"
          )
        template(slot="content")
          .ff__main-wrap
            p.preheader.ff__preheader(:class="schema.settings.preheaderColor", v-if="schema.settings.preheader") {{ schema.settings.preheader }}
            h2.ff__header(:class="[schema.settings.imageWidth === 'sw--50' ? 'h3': 'h2', schema.settings.headerColor]", v-if="schema.settings.header") {{ schema.settings.header }}
            p.subheader.ff__subheader(:class="schema.settings.subheaderColor", v-if="schema.settings.subheader") {{ schema.settings.subheader }}
            .ff__body(:class="{[schema.settings.bodyColor]: true, 'ff-body-margin-bottom--none': !(schema.settings.ctaText && schema.settings.ctaUrl)}", v-html="schema.settings.body", v-if="schema.settings.body")
              .button.button--secondary(
                v-if="dateChosen"
              ) Confirm Appointment
            component(
              v-if="schema.settings.ctaText && schema.settings.ctaUrl"
              :is="/link/.test(schema.settings.ctaStyle) ? 'v-link': 'v-button'"
              tag="a"
              :class="schema.settings.ctaStyle"
              :href="schema.settings.ctaUrl"
            ) {{ schema.settings.ctaText }}
</template>

<script>
import VButton from '../buttons/VButton.vue';
import VLink from '../buttons/VLink.vue';
import SplitWrapper from '../basic/SplitWrapper.vue';

export default {
  name: "FiftyFifty",
  props: {
    schema: Object,
  },
  data() {
    return {
      dateChosen: false
    }
  },
  components: {
    VButton,
    VLink,
    SplitWrapper
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
