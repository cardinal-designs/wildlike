<template lang="pug">
  portal(to="featured-offers-modal-portal")
    modal(ref="modal" @close="onModalClose")
      .featured-offers__content(slot="content" v-bind:style="{ top: `${topOffset}px` }")
        .container
          .featured-offers
            featured-offer(v-for="offer in blocks" :key="offer.id" :offer="offer")
</template>

<script>
import Modal from 'scripts/components/basic/Modal.vue';
import FeaturedOffer from './FeaturedOffer.vue';

export default {
  name: 'FeaturedOffers',
  props: {
    settings: Object,
    blocks: Array,
    modalOpen: Boolean
  },
  components: {
    Modal,
    FeaturedOffer
  },
  watch: {
    modalOpen(val) {
      if (val) {
        this.setModalPosition();
        return this.$refs.modal.open();
      }
      return this.$refs.modal.close();
    }
  },
  data() {
    return {
      topOffset: 0
    };
  },
  methods: {
    onModalClose() {
      this.$store.dispatch('offers/setModalOpen', false);
    },
    setModalPosition() {
      const $promoBar = document.querySelector('[data-promo-bar]');
      const offset = $promoBar ? $promoBar.offsetHeight : 0;

      if (offset) {
        this.topOffset = window.scrollY <= offset ? offset - window.scrollY : 0;
      }
    }
  }
};
</script>

<style lang="scss">
.featured-offers__modal-portal {
  display: none;
  .featured-offers {
    display: flex;
    justify-content: center;
    &__content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      max-width: 100%;
      transform: none;
      padding: 28px 0;
      background-color: $color-white;
    }
  }
  .offer {
    margin: 0 20px;
    max-width: 320px;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  .modal {
    &__content {
      position: relative;
      top: auto;
      left: auto;
      width: 100%;
      max-width: 100%;
      transform: none;
      padding: 0;
      margin: 0;
    }
    &__close {
      display: none;
    }
  }
  @include desktop-up {
    display: block;
  }
}
</style>
