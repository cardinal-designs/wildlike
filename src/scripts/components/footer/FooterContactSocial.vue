<template lang="pug">
  .footer-contact-container.bg-light-grey
    .footer-contact(:class="[schema.settings.textColor]")
      .footer-contact__social(v-if="enabledSocial.length > 0")
        .footer-contact__social-list
          a.footer-contact__social-link(v-for="social in enabledSocial" :key="social.id" :href="social.url" target="_blank" :aria-label="social.id")
            icon.footer-contact__social-icon(:name="social.id" :fillClass="schema.settings.socialIconColor" :size="'24px'")
</template>

<script>
import Icon from 'scripts/components/basic/Icon.vue';

export default {
  name: 'FooterContactSocial',
  components: {
    Icon,
  },
  props: {
    schema: Object,
  },
  methods: {},
  data() {
    return {};
  },
  computed: {
    enabledSocial() {
      return this.schema.settings.socialLinks.filter((social) => social.id !== 'none');
    },
  },
};
</script>

<style lang="scss">
.footer-contact-container {
  padding: 16px 16px 12px 0px;
  
  @include mobile-only {
    grid-row-start: 4;
    padding: 0px;
    margin: 24px auto;
  }
  
  @include desktop-up {
    padding-top: 32px;
    padding-bottom:24px;
  }
}

.footer-contact {
  display: flex;
  max-width: #{$container-max-width - 40px};
  margin: 0 auto;
  flex-wrap: wrap;
  overflow: hidden;
  
  @include desktop-up {
    flex-wrap: nowrap;
    justify-content: center;
  }

  &__contact,
  &__social {
    flex-basis: 50%;
    flex-grow: 1;
    order: 1;

    &:nth-child(1) {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }

    .footer-content--center & {
      @include mobile-only {
        text-align: center;
      }
    }
  }

  &__contact {
    padding-right: 4px;

    @include desktop-up {
      min-width: 200px;
      padding-right: 0;
      flex-grow: 0;
    }

    &:nth-child(2) {
      order: 2;

      @include desktop-up {
        order: 1;
      }

      .footer-content--center & {
        @include mobile-only {
          order: 1;
        }
      }
    }
  }

  &__social {
    padding-left: 4px;

    @include desktop-up {
      padding-left: 0;
    }
  }

  &__social-list {
    margin: 0 -8px;
  }

  &__social-link {
    display: inline-block;
    margin: 4px 8px;

    @include desktop-up {
      margin-right: 8px;
      margin-left: 8px
    }
  }
}
</style>
