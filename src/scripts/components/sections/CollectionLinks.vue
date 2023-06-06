<template lang="pug">
  .collection-links__wrapper(:class="schema.sectionBgColor" :style="wrapperStyle")
    .collection-links__container.container
      h3.collection-links__heading(:class="schema.sectionTitleColor") {{ schema.sectionTitle }}
      .collection-links__links-section
        a.collection-links__large-link(v-if="largeLink" :style="largeLinkStyle" :href="largeLink.settings.linkUrl")
          h6.collection-links__large-link-heading {{ largeLink.settings.heading }}
          p.collection-links__large-link-copy {{ largeLink.settings.bodyCopy }}
          v-link.collection-links__large-link-anchor(:primary="true" :href="largeLink.settings.linkUrl") {{ largeLink.settings.linkText }}
        .collection-links__link-wrapper
          .collection-links__link-container(v-for="link in smallLinks" :key="link.id")
            a.collection-links__link(:href="link.settings.linkUrl")
              span.strong-bold.body-md-sm {{ link.settings.linkTitle }}
              icon.icon(name="arrow-right" size="24px")
</template>

<script>
import Icon from 'scripts/components/basic/Icon.vue';
import VLink from 'scripts/components/buttons/VLink.vue';

import { px } from 'scripts/filters/string.js';

export default {
  name: 'CollectionLinks',
  components: {
    Icon,
    VLink
  },
  computed: {
    wrapperStyle() {
      return {
        paddingTop: px(this.schema.topPadding),
        paddingBottom: px(this.schema.bottomPadding)
      };
    },
    largeLinkStyle() {
      if (this.largeLink.settings.bgImage) {
        return {
          backgroundImage: `url(${this.largeLink.settings.bgImage})`
        };
      }
    }
  },
  props: {
    schema: Object,
    smallLinks: Array,
    largeLink: Object
  }
};
</script>

<style lang="scss" scoped>
.collection-links {
  &__heading {
    text-align: center;
    margin-bottom: 20px;
  }
  &__large-link-heading {
    margin-bottom: 8px;
    max-width: 60%;
  }
  &__large-link-copy {
    margin-bottom: 16px;
    max-width: 60%;
  }
  &__large-link-anchor {
    display: block;
    max-width: 60%;
  }
  &__links-section {
    display: flex;
    flex-direction: column;
  }
  &__link-wrapper {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 8px;
    justify-content: center;
    @include ie {
      display: flex;
      justify-content: center;
    }
  }
  &__link-container {
    flex: 0 0 20%;
    min-width: 0;
  }
  &__large-link {
    flex: 0 0 40%;
    padding: 20px;
    background-color: $color-white;
    background-repeat: no-repeat;
    background-size: 176px;
    background-position: calc(100% + 30px) calc(100% + 30px);
    margin-bottom: 8px;
  }
  &__link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $color-white;
    padding: 12px 20px;
    box-shadow: $drop-shadow--light;
    border-radius: 4px;
    transition: box-shadow 300ms ease, transform 300ms ease;

    span {
      font-family: $font-family-secondary;
      font-size: 14px;
      letter-spacing: 1px;
      line-height: 22px;
      font-weight: bold;
      color: $color-black-900;
      max-width: calc(100% - 24px);
      @include mobile-only {
        font-family: $font-family-primary;
        font-size: 12px;
        letter-spacing: 0;
        line-height: 16px;
      }
    }

    .icon {
      transition: transform 300ms ease;
    }

    &:hover {
      box-shadow: 1px 2px 2px 1px rgba(0, 0, 0, 0.08);
      transform: translate3d(0, -2px, 0);
      .icon {
        transform: translate3d(4px, 0, 0);
      }
    }
  }
  @media (min-width: 960px) {
    &__links-section {
      flex-direction: row;
    }
    &__link-wrapper {
      grid-template-columns: repeat(auto-fill, 240px);
    }
    &__link-container {
      flex: 0 0 20%;
      min-width: 240px;
    }
    &__large-link {
      margin-bottom: 0;
    }
  }
}
</style>