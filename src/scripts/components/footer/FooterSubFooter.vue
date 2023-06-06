
<template lang="pug">
  .footer-subfooter-container.bg-light-grey
    .footer-subfooter
      .footer-subfooter__menu(v-if="schema.settings.subfooterMenu.links.length > 0")
        .footer-subfooter__link-container(v-for="link in schema.settings.subfooterMenu.links" :key="link.id")
          a.footer-subfooter__link(:href="link.url")
            span.link__content.body-sm.link--tertiary {{link.title}}
      .footer-subfooter__copyright.body-sm {{schema.settings.copyrightText}}
</template>

<script>
  export default {
    name: 'FooterSubFooter',
    props: {
      schema: Object
    },
  }
</script>

<style lang="scss">
  .footer-subfooter-container {
    padding: 16px;
    border-top: 1px solid $color-black-300;

    @include desktop-up {
      padding: 15px 20px 14px 20px;
    }
  }

  .footer-subfooter {
    max-width: #{$container-max-width - 40px};
    margin: 0 auto;
    overflow: hidden;

    @include desktop-up {
      display: flex;
      justify-content: center;
    }

    &__menu {
      display: flex;
      justify-content: center;

      &:not(:last-child) {
        @include desktop-up {
          margin-left: -12px;
        }
      }

      .footer-content--center & {
        @include mobile-only {
          justify-content: center;
        }
      }
    }

    &__link-container {
      @include mobile-only {
        margin-bottom: 8px;
        padding: 0 8px;
      }

      @include desktop-up {
        margin: 0 12px;
        line-height: 1.15;
        flex-basis: auto;
        flex-grow: 0;
      }

      &:nth-child(even) {

        @include desktop-up {
          padding-left: 0;
        }
      }

      &:nth-child(odd) {

        @include desktop-up {
          padding-right: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      }
    }

    &__link {
      display: block;
      color: inherit;

      .footer-content--center & {
        @include mobile-only {
          margin: 0 auto;
        }
      }
    }

    &__copyright {
      text-align: center;
    }
  }
</style>
