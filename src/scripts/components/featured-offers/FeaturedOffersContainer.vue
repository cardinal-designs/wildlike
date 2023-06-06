<template lang="pug">
  featured-offers(:settings="settings" :blocks="blocks" :modalOpen="modalOpen")
</template>

<script>
import { mapState } from 'vuex';
import FeaturedOffers from './FeaturedOffers.vue';

export default {
  name: 'FeaturedOffersContainer',
  props: {
    settings: Object,
    blocks: Array
  },
  components: {
    FeaturedOffers
  },
  computed: mapState({
    modalOpen: state => state.offers.modalOpen
  }),
  mounted() {
    this.$store.dispatch('offers/setOfferCount', this.blocks.length);
    this.$store.dispatch('offers/setData', { settings: this.settings, blocks: this.blocks });
  }
};
</script>
