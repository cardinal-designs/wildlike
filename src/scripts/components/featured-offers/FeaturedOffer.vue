<template lang="pug">
  component.offer(:is="offer.settings.offerLink ? 'a' : 'div'" :href="offer.settings.offerLink")
    .offer__image(:style="backgroundImage")
    .offer__content
      p.offer__content-item.offer__content-item--link-text {{ offer.settings.offerText }}
      v-link.offer__content-item.offer__content-item--link(v-if="offer.settings.offerLink" :primary="true" :href="offer.settings.offerLink") {{ offer.settings.offerLinkText }}
</template>

<script>
import VLink from 'scripts/components/buttons/VLink.vue';
export default {
  name: 'FeaturedOffer',
  props: {
    // * { id: number: type: string; settings: { offerImage: string; offerText: string; offerLink: string; offerLinkText: string; }; }
    offer: Object
  },
  components: {
    VLink
  },
  computed: {
    backgroundImage() {
      return {
        'background-image': `url(${this.offer.settings.offerImage})`
      };
    }
  }
};
</script>

<style lang="scss">
.offer {
  flex: 1;
  color: inherit;
  &__content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border: 1px solid $color-black-100;
  }
  &__image {
    width: 100%;
    height: 160px;
    background-size: cover;
    background-repeat: no-repeat;
  }
  &__content-item {
    padding: 18.5px 16px 16px;
    display: flex;
  }
}
</style>