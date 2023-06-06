<template lang="pug">
  section.brand-message-block
    .brand-message-block__image-container
      .brand-message-block__line-before
      img.brand-message-block__image(:src="schema.settings.brandImage" :alt="schema.settings.brandImageAlt")
      .brand-message-block__line-after
    .brand-message-block__wrapper
      h1.brand-message-block__heading.h1-display {{schema.settings.brandMessage}}
      .brand-message-block__cta-wrapper(v-if="schema.settings.ctaURL !== '' && schema.settings.ctaText !== ''")
        a.button.button--primary(:href="schema.settings.ctaURL")
          span.button__content {{schema.settings.ctaText}}
</template>

<script>

export default {
  name: "BrandMessage",
  props: {
    schema: Object,
  },
  components: {},
  computed: {},
  mounted () {},
  beforeDestroy () {},
  methods: {}
}
</script>

<style lang="scss">
  .brand-message-block {
    padding: 40px 16px 56px;

    @include tablet-up {
      padding: 24px 16px 48px;
    }

    &__wrapper {
      margin: 0 auto;
      max-width: 660px;
      text-align: center;
    }

    &__image-container {
      display: flex;
      max-width: 1440px;
      margin: 0 auto;
    }

    &__line-before {
      height: 1px;
      background-color: $color-black-900;
      width: 100%;
      margin-top: 16px;
      margin-right: 8px;
    }

    &__line-after {
      height: 1px;
      background-color: $color-black-900;
      width: 100%;
      margin-top: 16px;
      margin-left: 8px;
    }

    &__image {
      max-width: 80px;
      margin-bottom: 16px;
      max-width: 24px;
      display: flex;
      align-items: center;

      @include tablet-up {
        margin-bottom: 39px;
      }
    }

    &__cta-wrapper {
      padding-top: 16px;
    }
  }
</style>
