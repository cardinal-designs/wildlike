
<template lang="pug">
  .navbar__cart(:class="sidecartOpen ? 'open' : ''")
    cart-modal
      v-button(label="Open Cart", @click="$store.dispatch('cart/openSidecart')", aria-label="Open Cart")
        svg(xmlns='http://www.w3.org/2000/svg' width='32' height='32')
          g(fill='none' fill-rule='evenodd')
            rect.innersvg(fill="#FFFFFF" x="6" y="8" width="20" height="20")
            path(d='M6 8h20v20H6z')
            path(fill='#231A22' fill-rule='nonzero' d='M16 3.5a4.5 4.5 0 00-4.5 4.29V8h-1a5.5 5.5 0 0111-.22V8H26v20H6V8h14.5A4.5 4.5 0 0016 3.5zM25 9H7v18h18V9z')
        span.cart-bubble-quantity.navbar__cart__quantity(v-if="numCartItems >= 0")
          span.cart-bubble-count.navbar__cart__count(:class="[cartBubbleColors.bubbleText, {'cart-bubble-count--small': numCartItems >= 100}]") {{ numCartItems < 100 ? numCartItems : '99+' }}
</template>

<script>
  import { mapState } from 'vuex'

  import VButton from 'scripts/components/buttons/VButton.vue'
  import Icon from 'scripts/components/basic/Icon.vue'
  import CartModal from 'scripts/components/cart/CartModal.vue';

  export default {
    name: 'NavbarCart',
    components: { VButton, Icon, CartModal },
    props: {
      cartBubbleColors: Object
    },
    computed: {
      ...mapState({
        checkout: state => state.cart.checkout,
        sidecartOpen: state => state.cart.sidecartOpen
      }),
      numCartItems () {
        return this.checkout.item_count || 0;
      }
    }
  }
</script>

<style scoped lang="scss">
  .navbar__cart {
    display: inline-block;
    position: relative;
    //margin-right: 22px;
    opacity: 1;
    transition: opacity 100ms ease;
    margin-top: 5.5px;

    @include desktop-up {
      margin-right: 0;
    }
  }

  .desktop-account-icon{
    grid-column-start: 3;
  }

  .navbar__cart .button--icon {
    border: 0;
    min-width: 24px;
    height: 40px;
  }
  .open {
    opacity: 0;
  }

  .innersvg:hover {
    fill: #FFADD8;
  }
</style>
