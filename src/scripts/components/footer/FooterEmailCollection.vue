
<template lang="pug">
  .footer-email-collection(:class="[schema.settings.backgroundColor, schema.settings.borderColor]")
    .footer-email-collection__content
      .footer-email-collection__text
        h3.footer-email-collection__title {{ schema.settings.title }}
        .footer-email-collection__body.client-generated(v-html="schema.settings.body")
      .footer-email-collection__form
        slot
</template>

<script>
  export default {
    name: 'FooterEmailCollection',
    props: {
      schema: Object,
      newsletter: String,
    },
    methods: {},
    data() {
      return {};
    },
  }
</script>

<style lang="scss">
  .footer-email-collection {
    background-color: $color-accent-2-700;
    padding: 48px 16px 56px 16px;
    margin: 0 auto;

    @include desktop-up {
      padding: 48px 20px 56px 20px;
    }

    &__content {
      position: relative;
      flex-direction: column;
      align-items: center;
      max-width: 344px;
      text-align: center;
      margin: 0 auto;

      @include desktop-up {
        max-width: 429px;
        margin: 0 auto;
        padding: 0;
      }
    }

    &__title {
      margin-bottom: 8px;
      font-size: 28px;
      color: $color-white;

      @include desktop-up {
        width: 100%;
        margin-bottom: 16px;
      }
    }

    &__text {
      font-size: rem(14);
      color: $color-white;

      @include desktop-up {
        font-size: rem(16);
        width: 100%;
        margin-right: 44px;
        flex-basis: 50%;
      }

      .footer-content--center & {
        @include mobile-only {
          text-align: center;
        }
      }
    }

    &__body {
      margin-bottom: 16px;
      font-size: rem(12);
      line-height: 1.33;

      @include desktop-up {
        font-size: rem(14);
      }

      p, span, em, strong {
        font-size: inherit;
        line-height: inherit;
        color: inherit;
        font-family: $font-family-secondary;
      }
    }

    &__form {
      width: 100%;

      @include desktop-up {
        margin-top: 4px;
        flex-basis: 45%;
      }

      .newsletter-form-inner-container {
        height: 44px;
        max-width: 429px;

        .newsletter-check{
          width: 16px;
        }
        .newsletter-arrow-fill {
          fill: $color-brand-secondary;
        }
        &:hover {
          border: 1px solid $color-accent-3-700;
          cursor: pointer;

          button[type="submit"] {
            color: $color-brand-primary;
          }

        }
        input {
          font-size: rem(16);

          &::placeholder {
            color: $color-text-dark;
            font-size: rem(16);
            @include mobile-only {
              margin-bottom: 2px;
            }
          }
        }
      }

      .errors {
        font-size: rem(12);
        line-height: rem(14);
        padding: 4px 0 0 0;

        ul, li {
          text-align: left;
          font-size: inherit;
          line-height: inherit;
          color: $color-black-500;
        }
      }
    }
  }
  .newsletter-submit-text {
    @include mobile-only {
      margin-bottom: 6px !important;
    }
  }
</style>
