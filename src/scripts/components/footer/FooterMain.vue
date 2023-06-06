
<template lang="pug">
  .footer-main-container.bg-light-grey
    accordion-group.footer-main
      .footer-main__column(v-for="block in filteredBlocks" :key="block.id" :class="{'footer-main__column--large footer-main__column--logo': block.type === 'logo_block'}")
        accordion.footer-main__menu-accordion(v-if="block.type === 'link_list_block' && $mq === 'mobile'" :heading="block.settings.menu.title" activeIcon="minus" inactiveIcon="plus" iconSize="16px" theme="footer-bourdain")
          .footer-main__menu-list
            v-link.footer-main__menu-link.footer-main__menu-link.link.link--primary(v-for="(link, index) in block.settings.menu.links" :key="index" :href="link.url") {{link.title}}
        .footer-main__menu-content(v-else-if="block.type === 'link_list_block'")
          h5.footer-main__menu-title {{block.settings.menu.title}}
          .footer-main__menu-list
            v-link.footer-main__menu-link.link.link--tertiary(v-for="(link, index) in block.settings.menu.links" :key="index" :href="link.url") {{link.title}}
        .footer-main__logo-content(v-else)
            .footer-main__logo-content-container
              img.footer-main__logo(v-if="block.settings.logo_png || block.settings.logo_svg" :src="block.settings.logo_svg ? block.settings.logo_svg : block.settings.logo_png" :alt="block.settings.logo_png_alt ? block.settings.logo_png_alt : ''")
              footer-contact-social(v-if="!schemaContact.settings.hideContact" :schema="schemaContact")
              h5.h6.footer-main__title {{block.settings.title}}
              .footer-main__body.body-sm.mobile-footer-address(v-html="block.settings.body")
</template>

<script>
  import Accordion from 'scripts/components/basic/Accordion.vue';
  import AccordionGroup from 'scripts/components/basic/AccordionGroup.vue';
  import Icon from 'scripts/components/basic/Icon.vue';
  import VLink from 'scripts/components/buttons/VLink.vue';

  import FooterContactSocial from 'scripts/components/footer/FooterContactSocial.vue';

  export default {
    name: 'FooterMain',
    components: {
      Accordion,
      AccordionGroup,
      Icon,
      VLink,
      FooterContactSocial,
    },
    props: {
      schema: Object,
      schemaContact: Object,
    },
    methods: {},
    data() {
      return {}
    },
    computed: {
      filteredBlocks() {
        const filteredArr = [];
        let columnTotal = 0;
        this.schema.blocks.forEach((block) => {
          if (block.type === 'logo_block') {
            columnTotal += 2;
          } else {
            columnTotal += 1;
          }

          if (columnTotal > 6) {
            return;
          }

          filteredArr.push(block);
        });

        return filteredArr;
      }
    }
  }
</script>

<style scoped lang="scss">
  .footer-main-container {
    padding: 0 16px;

    @include desktop-up {
      padding-top: 80px;
      padding-bottom: 70px;
    }
  }

  .footer-main {
    max-width: 1196px;
    margin: 0 auto;

    @include desktop-up {
      display: flex;
      justify-content: flex-start;
    }

    &__column {
      @include desktop-up {
        flex-basis: 17.5%;
      }

      &:not(:last-child) {
        @include desktop-up {
          padding-right: 20px;
        }
      }
    }

    &__column--large {
      @include desktop-up {
        flex-basis: 30%;
      }
    }

    &__menu-title {
      text-transform: uppercase;
      font-size: rem(20);
      line-height: rem(20);

      @include desktop-up {
        margin-bottom: 16px;
      }
    }

    &__menu-list {
      display: flex;
      padding-bottom: 24px;
      flex-direction: column;
      align-items: flex-start;

      @include desktop-up {
        padding-bottom: 0;
      }

      .footer-content--center & {
        @include mobile-only {
          align-items: center;
        }
      }
    }

    /deep/ &__menu-link {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      &.link .icon {
        display: none;
      }
    }

    &__logo-content-container {
      max-width: 232px;
        @include mobile-only {
          display: grid;
        }
      @include desktop-up {
        padding-left: 36px;
      }
    }

    &__logo-content {
      @include desktop-up {
        display: block;
      }

      .footer-content--center & {
        @include mobile-only {
          text-align: center;
        }
      }
    }

    &__logo {
      display: block;
      width: 116px;
      margin: 0 auto;

      @include mobile-only {
        margin-bottom: 24px;
      }

      .footer-content--center & {
        @include mobile-only {
          margin: 0 auto;
        }
      }
    }

    &__title {
      font-size: rem(16);
      margin-bottom: 8px;

      @include mobile-only {
        text-align: center;
      }
    }
  }
  .accordion-group {
    @include mobile-only {
      display: grid;
    }
  }

  .footer-main {

    &__column--logo {
      @include mobile-only {
        grid-row-start: 30;
        margin: 24px auto 0px;
      }
    }
  }

  .mobile-footer-address {
    @include mobile-only {
      font-size: rem(14);
      text-align: center;
    }
  }

</style>
