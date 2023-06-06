<template lang="pug">
  v-link.featured-offers-link(v-on:click="onLinkClick" :secondary="true" :class="[colorClass, { 'active': offers.modalOpen }]") {{ `${content} (${offers.offerCount})` }}
</template>

<script>
import { mapState } from 'vuex';
import VLink from 'scripts/components/buttons/VLink.vue';
export default {
  name: 'FeaturedOffersLink',
  props: {
    content: String,
    colorClass: String
  },
  components: {
    VLink
  },
  computed: mapState(['offers']),
  methods: {
    onLinkClick() {
      this.$store.dispatch('offers/setModalOpen', !this.offers.modalOpen);
    }
  }
};
</script>

<style lang="scss">
.featured-offers-link {
  display: none;
  @include desktop-up {
    display: flex;
  }
  &.promo-color-light {
    color: $color-white;
  }
  &.promo-color-dark {
    color: $color-black-900;
  }
}
</style>