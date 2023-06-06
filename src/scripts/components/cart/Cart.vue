<template lang="pug">
  .cart
    .cart__shipping-promo--main-wrapper(v-if="shippingPromoEnabled")
      .cart__shipping-promo--wrapper.container.desktop(v-if="$mq !== 'mobile' && $mq !== 'tablet'")
        .cart__shipping-promo(:class="colors.shippingBg")
          transition(name="fade")
            span.cart__shipping-promo-message.body-md.body-sm-mobile.body-md-tablet-up(v-if="normalizedTotalPrice < shippingPromoTotal" :class="colors.shippingText") {{`Free shipping if you spend $${remainingThresholdValue}${totalPrice === 0 ? '' : ' more'}.`}}
            span.cart__shipping-promo-message.body-md.body-sm-mobile.body-md-tablet-up(v-if="normalizedTotalPrice >= shippingPromoTotal" :class="colors.shippingText") {{shippingPromoCopy}}
          .cart__shipping-promo-progress-bar-desktop
            transition(name="fade")
              .cart__shipping-promo-progress-bar.background-color-primary-200(:style="{width: `${remainingThresholdPercentage}%`}")
      .cart__shipping-promo--wrapper.mobile(v-else)
        .cart__shipping-promo(:class="colors.shippingBg")
          transition(name="fade")
            span.cart__shipping-promo-message.body-md.body-sm-mobile.body-md-tablet-up(v-if="normalizedTotalPrice < shippingPromoTotal" :class="colors.shippingText") {{`Free shipping if you spend $${remainingThresholdValue}${totalPrice === 0 ? '' : ' more'}.`}}
            span.cart__shipping-promo-message.body-md.body-sm-mobile.body-md-tablet-up(v-if="normalizedTotalPrice >= shippingPromoTotal" :class="colors.shippingText") {{shippingPromoCopy}}
        .cart__shipping-promo-progress-bar(:style="{width: `${remainingThresholdPercentage}%`}" :class="colors.shippingProgress")
    .cart__wrapper.container(v-if="$mq !== 'mobile' && $mq !== 'tablet'")
      .cart__main
        .cart__heading
          div
            v-link.cart__shipping-promo-continue-shopping.u-hidden-mobile-only(:primary="true" :href="continueShoppingLink") Continue Shopping
          .cart__heading-container(v-if="totalItems > 0")
              h1.h3 My Shopping Bag
              span.cart__heading-total.body-md {{totalItems}} items
        .cart__container(v-if="totalItems > 0")
          transition(name="fade", mode="out-in")
            .cart__contents-wrapper
              .cart__contents
                table.cart__table
                  tr.cart__contents-table-header
                    th.cart__contents-table-header--product.strong-medium.body-sm Product
                    th.cart__contents-table-header--price.strong-medium.body-sm Price
                    th.cart__contents-table-header--quantity.strong-medium.body-sm Quantity
                  cart-line-item(
                      v-for="(item, index) in itemsNotInKits",
                      :item="item",
                      :key="item.id")
                  div(v-if="kits && kits.length")
                    cart-line-item-kit(
                      v-for="kit in kits"
                      :kit="kit"
                      :key="kit.id")
        .cart__empty(v-else)
          p.cart__empty__message.h2 {{ emptyText }}
          v-button.cart__empty__link(v-for="(link, index) in emptyLinkArray" :primary="true" :href="link.url", :label="link.text" :key="index" tag="a" v-if="link.text")
      .cart__sidebar(v-if="totalItems > 0")
        .cart__total-checkout.bg-light-grey
          h2.h4.text-center Order Summary
          .cart__gift-messaging
            .cart__gift-messaging-header
              div
                input(type="checkbox" id="gift_message_enable" v-model="giftEnabled" @click="toggleGift")
                label(for="gift_message_enable") {{giftEnabled ? 'This is a gift!' : 'Is this a gift?'}}
              transition(name="fade", mode="out-in")
                v-link.cart__gift-messaging-edit.body-sm(v-if="giftEnabled" :secondary="true" @click="addRemoveGiftMessage") {{giftMessageEnabled ? 'Remove Message' : 'Write a Message'}}
            transition(name="fade", mode="out-in")
              .cart__gift-messaging-message(v-if="giftEnabled && giftMessageEnabled")
                text-area-input.cart__gift-messaging-textarea(:char-limit="250" label="Gift Message" v-model="giftMessage" :keydownEvent="debouncedUpdateGiftMessage") {{giftMessage}}
            transition(name="fade")
              p.cart__gift-messaging-message-confirmation.body-sm(v-if="giftMessageConfirmationActive") {{giftMessageConfirmationMessage}}
          .cart-summary
            .cart-summary__total
              .cart-summary__subtotal.h6 Subtotal
              p.cart-summary__subtotal-number  {{ totalPrice | moneyWithoutDecimals }}
            .cart-summary__savings.color-accent-2(v-if="savingsTotal > 0")
              span.savings.body-md You saved 
              span.savings.body-md {{ savingsTotal | moneyWithoutDecimals }}

          v-button.sidecart__checkout-cta.button.button--primary(:full="true" type="submit" name="checkout" value="Checkout" @click="goToCheckout" :class="[{'sidecart__checkout-cta-promo-active' : promoMessage }]" label="CHECKOUT")
          v-button.cart__checkout-cta.gsx-checkout__button.cart__international-checkout(:full="true" @click="goToIntlCheckout" type="submit" name="international checkout" value="Checkout" :class="[{'cart__checkout-cta-promo-active' : promoMessage }, colors.cta]" label="INTERNATIONAL CHECKOUT")
        .cart__promo(v-if="promoMessage")
          p.cart__promo__copy.body-sm {{ promoMessage }}
    .cart__container-mobile(v-else)
      .cart__heading-container.container(v-if="totalItems > 0")
        h1.h4.text-center My Shopping Cart
        span.cart__heading-total {{totalItems}} items
      transition(name="fade")
        .cart__contents-wrapper(v-if="totalItems > 0")
          .cart__contents
            sidecart-line-item(
                  v-for="(item, index) in itemsNotInKits",
                  :item="item",
                  :key="item.id",)
            div(v-if="kits && kits.length")
              sidecart-line-item-kit(
                v-for="kit in kits"
                :kit="kit"
                :key="kit.id")
          .cart__footer
            .cart__total-checkout.bg-light-grey
              h3.h4.text-center Order Summary
              .cart__gift-messaging
                .cart__gift-messaging-header
                  div
                    input(type="checkbox" id="gift_message_enable" v-model="giftEnabled" @click="toggleGift")
                    label(for="gift_message_enable") {{giftEnabled ? 'This is a gift!' : 'Is this a gift?'}}
                  transition(name="fade", mode="out-in")
                    v-link.cart__gift-messaging-edit.body-sm(v-if="giftEnabled" :secondary="true" @click="addRemoveGiftMessage") {{giftMessageEnabled ? 'Remove message' : 'Write a message'}}
                transition(name="fade", mode="out-in")
                  .cart__gift-messaging-message(v-if="giftEnabled && giftMessageEnabled")
                    text-area-input.cart__gift-messaging-textarea(:char-limit="250" label="Gift Message" v-model="giftMessage" :keydownEvent="debouncedUpdateGiftMessage") {{giftMessage}}
                transition(name="fade")
                  p.cart__gift-messaging-message-confirmation.body-sm(v-if="giftMessageConfirmationActive") {{giftMessageConfirmationMessage}}
              .cart-summary
                .cart-summary__total
                  h4.cart-summary__subtotal Subtotal
                  p  {{ totalPrice | moneyWithoutDecimals }}
                .cart-summary__savings(v-if="savingsTotal > 0", :class="$store.state.comparePriceColor")
                  span.savings.body-md You saved
                  span.savings.body-md {{ savingsTotal | moneyWithoutDecimals }}
              v-button.sidecart__checkout-cta.button.button--primary(:full="true" type="submit" name="checkout" value="Checkout" @click="goToCheckout" :class="[{'sidecart__checkout-cta-promo-active' : promoMessage }]" label="CHECKOUT")
              v-button.cart__checkout-cta.gsx-checkout__button(:full="true" @click="goToIntlCheckout" type="submit" name="international checkout" value="Checkout" :class="[{'cart__checkout-cta-promo-active' : promoMessage }, colors.cta]" label="INTERNATIONAL CHECKOUT")
            .cart__promo(v-if="promoMessage")
              p.cart__promo__copy {{ promoMessage }}
        .cart__empty(v-if="totalItems === 0")
          p.cart__empty__message.h2 {{ emptyText }}
          v-button.cart__empty__link(v-for="(link, index) in emptyLinkArray" :primary="true" :href="link.url", :label="link.text" :key="index" tag="a" v-if="link.text")
</template>

<script>
  import { mapState } from 'vuex'

  import Icon from 'scripts/components/basic/Icon.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'
  import VLink from 'scripts/components/buttons/VLink.vue'
  import AsyncButton from 'scripts/components/buttons/AsyncButton.vue'
  import TextAreaInput from 'scripts/components/forms/TextAreaInput.vue'
  import CartLineItem from 'scripts/components/cart/CartLineItem.vue'
  import SidecartLineItem from 'scripts/components/cart/SidecartLineItem.vue'
  import CartLineItemKit from './CartLineItemKit.vue'
  import SidecartLineItemKit from './SidecartLineItemKit.vue'
  import axios from 'axios'


  export default {
    name: 'Cart',
    components: { VButton, CartLineItem, SidecartLineItem, Icon, VLink, TextAreaInput, AsyncButton, CartLineItemKit, SidecartLineItemKit },
    props: {
      cartObject: Object,
      promoMessage: String,
      emptyText: String,
      emptyLinkArray: Array,
      wishlistCta: Object,
      shippingPromoEnabled: Boolean,
      shippingPromoTotal: Number,
      shippingPromoCopy: String,
      continueShoppingLink: String,
      colors: {
        type: Object,
        default: () => window.bvaccel.cart.colors
      }
    },
    data () {
      return {
        giftEnabled: false,
        giftMessageEnabled: false,
        giftMessage: null,
        lineItemsBottom: false,
        giftMessageConfirmationActive: false,
        giftMessageConfirmationMessage: ""
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
        kits: state => state.cart.kits
      }),
      normalizedTotalPrice() {
        return parseFloat(this.totalPrice / 100)
      },
      remainingThresholdValue () {
        if(this.normalizedTotalPrice < this.shippingPromoTotal) {
          return parseFloat((this.shippingPromoTotal - this.normalizedTotalPrice)).toFixed(2)
        }
        return 0
      },
      remainingThresholdPercentage() {
        if(this.normalizedTotalPrice < this.shippingPromoTotal) {
          return parseInt((this.normalizedTotalPrice / this.shippingPromoTotal * 100).toFixed(0))
        }
        return 100
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
      pageTopHeight() {
        let navHeight = document.querySelector('.main-navigation-container').offsetHeight
        let headingHeight = 48
        let promoHeight
        if(document.querySelector('.cart__shipping-promo--wrapper.mobile')) {
          promoHeight = document.querySelector('.cart__shipping-promo--wrapper.mobile').offsetHeight
        } else {
          promoHeight = 0
        }
        return navHeight + headingHeight + promoHeight
      },
      itemsNotInKits() {
        return this.items.filter(item => !item.properties || !item.properties._kitId)
      }
    },
    mounted () {
      if (this.thresholdProductHandle) {
        this.$store.dispatch('products/addProduct', this.thresholdProductHandle)
      }
      this.getGiftMessage()
      this.updateGiftMessage()
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
      toggleGift() {
        this.giftEnabled = !this.giftEnabled
        this.updateGiftMessage()
      },
      addRemoveGiftMessage() {
        this.giftMessageEnabled = !this.giftMessageEnabled
        if (this.giftMessageEnabled === false) {
          this.giftMessage = null
        }
        this.updateGiftMessage()
      },
      checkSpecialChars(message) {
        let pattern = RegExp(/[^\u0020-\u007E]/gm)
        return pattern.test(message)
      },
      updateGiftMessage() {
        if (this.giftEnabled === true && this.giftMessage !== "") {

          if (this.checkSpecialChars(this.giftMessage)) {
            this.giftMessageConfirmationMessage = 'Error! Please remove special characters and returns.'
            this.giftMessageConfirmation()
          } else {
            this.giftMessageConfirmationMessage = 'Message Saved!'
            this.giftMessageSuccess = axios.post('/cart/update.js', {
              attributes: {
                "giftEnabled": this.giftEnabled,
                "giftMessage": this.giftMessage
              }
            })
          }
        }
        if (this.giftEnabled === true && this.giftMessage === "") {
          this.giftMessageSuccess = axios.post('/cart/update.js', {
            attributes: {
              "giftEnabled": this.giftEnabled
            }
          })
        }
        if (this.giftEnabled === false) {
          this.giftMessageSuccess = axios.post('/cart/update.js', {
            attributes: {
              "giftEnabled": this.giftEnabled
            }
          })
        }
      },
      getGiftMessage() {
        if (!this.cartObject.attributes.giftEnabled && !this.cartObject.attributes.giftMessage) {
          this.giftEnabled = false
        }
        if (this.cartObject.attributes.giftEnabled === "true" && this.cartObject.attributes.giftMessage) {
          this.giftEnabled = true
          this.giftMessageEnabled = true
          this.giftMessage = this.cartObject.attributes.giftMessage
        }
        if (this.cartObject.attributes.giftEnabled === "true" && !this.cartObject.attributes.giftMessage) {
          this.giftEnabled = true
          this.giftMessageEnabled = false
        }
        if (this.cartObject.attributes.giftEnabled === "false") {
          this.giftEnabled = false
        }
      },
      debouncedUpdateGiftMessage() {
        this.giftMessageConfirmationActive = false
        clearTimeout(this.timeout)
        let self = this
        this.timeout = setTimeout(function() {
          self.updateGiftMessage()
          document.getElementById('giftMessageInput').blur()
          self.giftMessageConfirmation()
        }, 3000)
      },
      giftMessageConfirmation() {
        this.giftMessageConfirmationActive = true
      },
      goToCheckout() {
        window.location = '/checkout'
      },
      goToIntlCheckout() {
        window.location = '/pages/globalshopex-checkout'
      }
    }
  }
</script>

<style scoped lang="scss">
  .button.gsx-checkout__button {
    display: none;
  }

  .cart__main {
    margin-right: 35px;
    flex-grow: 2;
  }

  .cart__heading {
    display: flex;
    flex-direction: row-reverse;
  }

  .cart-summary {
    margin-bottom: 16px;
  }


  .cart-summary__total {
    display: flex;
    justify-content: space-between;
    font-size: rem(14);

    &-number {
      font-family: $font-family-secondary;
      font-weight: 600;
    }

    @include desktop-up {
      font-size: rem($font-size-base);
    }
  }

  .cart {
    display: flex;
    flex-direction: column;
    background-color: $color-white;

    &__international-checkout {
      font-family: $font-family-secondary;
      font-weight: 600;
    }

    h1 {
      text-align: left;
    }

    &__wrapper {
      display: flex;
      justify-content: space-between;
      padding-bottom: 50px;
      width: 100%;
      padding-top: 24px;

      @include tablet-up {
        padding-top: 40px;
      }

      @include mobile-only {
        flex-direction: column;
      }
    }

    &__container {
      width: 100%;
    }

    .cart__container-mobile {
      margin-top: 16px;
    }

    &__contents-wrapper {
      display: flex;
      flex-grow: 1;
      width: 100%;
      @include desktop-up {
        max-width: 864px;
      }
      &-mobile {
        width: 100%;
        height: 100%;
        position: relative;
      }
    }
    &__sidebar {
      width: 100%;
      max-width: 416px;
      @include mobile-tablet {
        max-width: none;
      }
    }


    &__contents-table-header {
      text-align: left;

      &--product {
        width: 50%;
      }
      &--quantity {
        width: 30%;
      }
      &--price {
        width: 20%;
      }
    }

    &__heading-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;


      > * + * {
        margin-top: 8px;
      }

      @include mobile-only {
        border-bottom: 1px solid $color-black-100;
        align-items: center;
      }

      @include mobile-tablet {
        padding-bottom: 24px;
      }
      @include desktop-up {
        padding-bottom: 32px;
      }
      h1 {
        display: block;
      }
    }
    &__shipping-promo.container {
      padding: 9px $grid-gutter;
    }
    &__shipping-promo {
      padding: 10px;
      text-align: center;

      @include desktop-up {
        > * {
          display: block;
        }
      }
      &-continue-shopping {
        width: auto;
        white-space: nowrap;
      }
    }
    &__shipping-promo-progress-bar-desktop {
      background-color: $color-white;
      width: 100%;
      max-width: 416px;
      height: 8px;
      margin: 12px auto 0;
      border-radius: $border-radius--light;
    }

    &__shipping-promo-progress-bar {
      height: 4px;
      transition: width 200ms ease;
      margin-bottom: 50px;

      @include mobile-tablet {
        margin-bottom: 24px;
      }
      @include desktop-up {
        margin: 0;
        height: 8px;
      }
    }
    &__contents {
      flex-grow: 1;
      overflow: visible; // allow quantity select dropdown to overflow
      @include mobile-tablet {
        width: 100%;
        padding: 0 $grid-gutter;
      }
      &-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
      }
    }
    &__gift-messaging {
      padding: 10px 0;
      background: $color-black-100;
      margin: 8px 0 16px;
      &-header {
        display: flex;
        justify-content: space-between;
        input[type="checkbox"] {
          display: none;
          &:checked + label {
            &:after {
              background: $color-primary-700;
              border-color: $color-primary-700;
            }
            &:before {
              position: absolute;
              left: 4px;
              top: 7px;
              background: #ffffff;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              z-index: 1;
            }
          }
        }
        label {
          position: relative;
          padding-left: 25px;
          font-size: rem($font-size-base);
          &:after {
            content: '';
            background: white;
            width: 16px;
            height: 16px;
            position: absolute;
            left: 0;
            border-radius: 50%;
            border: 1px solid #231A22;
          }
          &:before {
              content: '';
          }
        }
      }
      &-edit {
        cursor: pointer;
      }
      &-message {
        display: flex;
        flex-direction: column;
        &-confirmation {
          color: $color-util-success;
          margin-top: 8px;
        }
      }
      &-textarea {
        margin-top: 18px;
        margin-bottom: 0;
      }
      &-submit {
        align-self: flex-end;
      }
    }
    &__footer {
      padding-top: 8px;
      border: none;
      @include mobile-tablet {
        display: flex;
        flex-direction: column;
        padding: 0;
        width: 100%;
        background-color: $color-white;
        align-content: flex-end;
      }
    }
    &__total-checkout {
      display: flex;
      flex-direction: column;
      padding: 24px;
      border-radius: $border-radius--medium;

      @include mobile-tablet {
        padding: 32px 12px;
        margin-bottom: 16px;
        box-shadow: none;
      }

      @include desktop-up {
        margin-bottom: 0;
      }
    }
    &__gift-messaging {
      background: $color-black-100;
      border-radius: $border-radius--medium;

      @include mobile-tablet {
        padding: 24px 0;
        box-shadow: none;
        margin: 8px 0 16px;
      }
      &-header {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      &-edit {
        cursor: pointer;
      }
      &-message {
        display: flex;
        flex-direction: column;
        &-confirmation {
          color: $color-util-success;
          margin-top: 8px;
        }
      }
      &-textarea {
        margin-top: 18px;
      }
      &-submit {
        align-self: flex-end;
      }
    }
    &__table {
      display: table;
      width: 100%;
      margin-bottom: 12px;
      border-collapse: collapse;

      .cart__contents-table-header > th {
        padding-bottom: 15px;
      }
    }
    &__promo {
      background-color: $color-white;
      padding: 26px $grid-gutter;

      @include desktop-up {
        margin-top: 16px;
      }
      &__copy {
        margin: 0;
        padding: 0;
        text-align: center;
      }
    }
    &__empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 100%;
      padding: 32px $grid-gutter 42px;

      &__image,
      &__message {
        margin: 0 0 24px;
      }
      &__link {
        width: 220px;
        margin-bottom: 16px;
        padding: 0;
      }
    }
    &__checkout-cta {
      height: 50px;
      margin-bottom: 24px;

      /deep/ .button__content {
        line-height: 50px;
        font-family: $font-family-secondary;
        font-weight: 600;
      }

      @include desktop-up {
        margin-bottom: 0;
      }
    }
    &__checkout-cta-promo-active {
      margin-bottom: 16px;

      @include desktop-up {
        margin-bottom: 0;
      }
    }
    &__continue-shopping {
      padding-top: 16px;
      padding-bottom: 4px;
      text-align: center;
      width: 100%;
    }
    &__continue-shopping-link-container {
      display: inline-block;
      margin: 0 auto;
    }
  }

  .cart__checkout-cta.link--secondary {
    &:hover {
      &:before {
        height: 100%;
      }
    }
  }

  .cart-type-bar {
    padding-top: 28px;
    padding-bottom: 24px;
    width: 100%;


    @include mobile-only {
      justify-content: center;
    }

    &__tab-wrap {
      display: flex;
      width: 100%;

      @include tablet-up {
        width: 75%;
      }
    }

    &__tab {
      width: 170px;
      height: 40px;
      background: $color-white;
      border: 1px solid $color-black-900;
      border-radius: $border-radius--light;

      @include mobile-only {
        width: 50%;
      }
    }

    &__tab:disabled {
      background: $color-black-100;
      border: none;
    }
  }
</style>
