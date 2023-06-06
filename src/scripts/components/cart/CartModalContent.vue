
<template lang="pug">
  .sidecart
    .sidecart__container
      transition(name="fade", mode="out-in")
        .sidecart__contents-wrapper(v-if="totalItems > 0", key="content")
          .sidecart__contents.padded(id="sidecartContents")
            modal-line-item(
              v-for="(item, index) in itemsNotInKits.slice(0, 2)",
              :item="item",
              :key="item.id",
            )

          v-link.sidecart__overflow-link.hover-opacity(:secondary="true" @click="() => $emit('open-full')" v-if="remainingProductCount") {{ `${remainingProductCount} More Products` }}
          .sidecart__footer.padded(:class="enableFooterDropshadow ? 'footer-dropshadow-enabled' : ''")
            table.sidecart__table
              tbody.sidecart__table-body
                tr.sidecart__table-row
                  td.text-left
                    button.sidecart__view-cart.text-left.body-md.hover-opacity(@click="() => $emit('open-full')") View Cart ({{ totalItems }})
                  td.sidecart__table-data-price
                    span.body-md.strong-medium Subtotal:
                    span.body-md.strong-medium {{ totalPrice | moneyWithoutDecimals }}
            v-button.sidecart__checkout-cta(:full="true" type="submit" name="checkout" value="Checkout" @click="goToCheckout" :class="[colors.cta]" label="CHECKOUT")
</template>

<script>
  import { mapState } from 'vuex'

  import Icon from 'scripts/components/basic/Icon.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'
  import VLink from 'scripts/components/buttons/VLink.vue'
  import AsyncButton from 'scripts/components/buttons/AsyncButton.vue'
  import TextAreaInput from 'scripts/components/forms/TextAreaInput.vue'
  import ModalLineItem from './ModalLineItem.vue'
  import SidecartLineItemKit from './SidecartLineItemKit.vue'
  import axios from 'axios'


  export default {
    name: 'CartModalContent',
    components: {
      VButton,
      ModalLineItem,
      Icon,
      VLink,
      TextAreaInput,
      AsyncButton,
      SidecartLineItemKit },
    props: {
      colors: {
        type: Object,
        default: () => window.bvaccel.cart.colors
      }
    },
    data () {
      return {
        enableFooterDropshadow: false,
      }
    },
    computed: {
      ...mapState({
        allProducts: state => state.products.all,
        sidecartOpen: state => state.cart.sidecartOpen,
        items: state => state.cart.checkout.items,
        itemsSubtotal: state => state.cart.checkout.items_subtotal_price,
        totalDiscount: state => state.cart.checkout.total_discount,
        totalPrice: state => state.cart.checkout.total_price,
        totalItems: state => state.cart.checkout.item_count,
        kits: state => state.cart.kits,
        cartIcon: state =>
          state.header.settings &&
          (state.header.settings.cartIconSvgUrl ||
            state.header.settings.cartIconImage ||
            state.header.defaultIcons.cartIconDefault)
      }),
      remainingProductCount() {
        const { items } = this;

        if(items.length - 2 > 0)
          return items.length - 2;
      },
      isNotMobile() {
        if (this.$mq !== 'mobile') {
          return true
        } return false
      },
      normalizedTotalPrice() {
        return parseFloat(this.totalPrice / 100)
      },
      savingsTotal() {
        let totalFullPrices = 0
        let totalDiscounts = 0
        let fullPrices = []
        let discountedPrices = []
        this.items.forEach(item => {
          this.allProducts.forEach(product => {
            if (item.id === product.id && product.compare_at_price !== item.price) {
              fullPrices.push(product.compare_at_price * item.quantity)
            }
            product.variants.forEach(variant => {
              if (item.id === variant.id && variant.compare_at_price !== variant.price) {
                fullPrices.push(variant.compare_at_price * item.quantity)
              }
            })
          })
        })
        this.items.forEach(item => {
          this.allProducts.forEach(product => {
            if (item.id === product.id && product.compare_at_price !== item.price ) {
              discountedPrices.push(product.price * item.quantity)
            }
            product.variants.forEach(variant => {
              if (item.id === variant.id && variant.compare_at_price !== variant.price) {
                discountedPrices.push(variant.price * item.quantity)
              }
            })
          })
        })

        discountedPrices.forEach(price => totalDiscounts += price)
        fullPrices.forEach(price => totalFullPrices += price)

        return totalFullPrices - totalDiscounts
      },
      itemsNotInKits() {
        return this.items.filter(item => !item.properties || !item.properties._kitId)
      }
    },
    watch: {
      sidecartOpen() {
        this.updateDropShadow()
      },
      totalItems() {
        this.updateDropShadow()
      }
    },
    mounted () {
      if (this.thresholdProductHandle) {
        this.$store.dispatch('products/addProduct', this.thresholdProductHandle)
      }
      this.initBoldUpsell();
    },
    updated() {
      this.initBoldUpsell();
    },
    methods: {
      initBoldUpsell () {
        // init bold
        if (window.BOLD && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function') {
          BOLD.common.eventEmitter.emit('BOLD_COMMON_cart_loaded');
        }
      },
      goToCheckout() {
        window.location = '/checkout'
      },
      updateDropShadow() {
        if(document.getElementById('sidecartContents')) {
          setTimeout(() => {
            let contentsElement = document.getElementById('sidecartContents')
            let scroll = contentsElement.scrollHeight
            let offset = contentsElement.offsetHeight
            if (scroll > offset) {
              this.enableFooterDropshadow = true
              this.$forceUpdate()
            } else {
              this.enableFooterDropshadow = false
              this.$forceUpdate()
            }
          }, 300)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .sidecart {
    display: flex;
    flex-direction: column;
    background-color: $color-white;;
    width: 336px;
    max-width: 336px;

    /deep/ .sidecart__line-item + .sidecart__line-item {
      margin-top: 16px;
    }

    .padded {
      padding: 16px 12px;
    }

    .hover-opacity {
      transition: opacity .15s ease;

      &:hover {
        opacity: .7;
      }
    }

    &__container {
      display: flex;
      flex-grow: 1;
      min-height: 0;  // override auto to prevent growing too tall
      height: 100%;
    }

    &__overflow-link {
      margin-bottom: 16px;
    }

    &__contents {
      flex-grow: 1;
      padding: 0;
      overflow-y: visible;

      &-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        flex-grow: 1;
      }
    }

    &__footer {
      width: 100%;
      border: none;
      position: relative;
      padding-top: 16px;
      border-top: 1px solid $color-black-100;

      &.footer-dropshadow-enabled {
        z-index: 1;
        box-shadow: 0 -1px 8px rgba(0,0,0,0.1);
      }
    }

    &__table {
      display: table;
      width: 100%;
      margin-bottom: 8px;
      &-body {
        width: 100%;
      }
      &-row {
        display: table;
        width: 100%;
      }
      &-data-price {
        text-align: right;
      }

    }

    &__view-cart {
      text-decoration: underline;
    }

    &__header,
    &__footer {
      flex-shrink: 0;
    }
  }

  .sidecart__title {
    @include h4-mobile;
  }

  .sidecart__line-item__title,
  .sidecart__line-item__options span,
  .sidecart__line-item__quantity__label,
  .sidecart__checkout-cta .button__content,
  .sidecart__gift-messaging-edit,
  .sidecart__table-data-type,
  .sidecart__table-data-price,
  .sidecart__gift-messaging-header label {
    font-family: $font-family-primary;
    font-weight: 900;
  }

  .sidecart__line-item__price span {
    font-family: $font-family-secondary;
  }

</style>
