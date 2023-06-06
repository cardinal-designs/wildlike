<template lang="pug">
  //- 
  .cart-modal-wrapper(@mouseenter="openModal", @mouseleave="closeModal")
    slot
    transition(name="fade")
      div.cart-modal.tooltip.popover.vue-popover-theme(
        v-if="cartModalOpen"
        tabindex="0"
        x-placement="bottom"
      )
        div(class="wrapper")
          div(class="tooltip-inner popover-inner" style="position: relative;")
            cart-modal-content(@open-full="openSidecart")
          div(class="tooltip-arrow popover-arrow", :style="arrowStyle")
</template>

<script>
/**
 * @module CartModal
 * @summary a mini sidecart that, if enabled, opens on hover and when a product is added to cart
 *
 * - Open on hover and when the store state indicates to be open.
 * - Opening the regular sidecart closes this.
 * - This component is only visible desktop widths and up
 */

import { createNamespacedHelpers } from "vuex";
import debounce from 'lodash/debounce';
import CartModalContent from './CartModalContent.vue';

const { mapGetters, mapActions } = createNamespacedHelpers("cart");
const ARROW_WIDTH_PX = 6;
const MODAL_CLOSE_DELAY_MS = 500;

export default {
  name: "CartModal",
  components: {
    CartModalContent
  },
  data() {
    return {
      width: 0,
      timerId: 0,
    }
  },
  methods: {
    ...mapActions(["openCartModal", "closeCartModal", "openSidecart"]),
    openModal() {
      window.clearTimeout(this.timerId);
      this.openCartModal();
    },
    closeModal() {
      this.timerId = window.setTimeout(this.closeCartModal, MODAL_CLOSE_DELAY_MS);
    },
    setWidth() {
      this.width = this.$el.offsetWidth;
    }
  },
  computed: {
    ...mapGetters(["cartModalOpen"]),
    arrowStyle () {
      return {
        right: `${(this.width / 2) - ARROW_WIDTH_PX}px`,
        left: 'unset',
      };
    }
  },
  mounted() {
    window.matchMedia('(min-width: 1024px)')
      .addEventListener('change', this.setWidth.bind(this));
    
    this.setWidth();
  }
};
</script>

<style scoped lang="scss">
  .cart-modal-wrapper {
    text-align: right;
  }

  .cart-modal {
    position: absolute;
    top: 100%;
    right: 0;
    display: none;

    &:focus {
      outline: none;
    }

    @include tablet-up {
      display: block;
      top: 160%;
    }

    .tooltip-arrow {
      top: -3px;
      left: calc(50% - 3px);
    }

    .tooltip-inner {
      padding: 0;
      max-width: inherit;
    }
  }
</style>
