
<template lang="pug">
  .sidecart-wrapper
    transition(name="fade")
      .sidecart__overlay(v-if="sidecartOpen", @click="$store.dispatch('cart/closeSidecart')")
    transition(name="off-canvas-right")
      .sidecart(v-show="sidecartOpen" v-scroll-lock="sidecartOpen && isNotMobile")
        .sidecart__header(:class="{'sidecart__header--border-bottom': !shippingPromoEnabled}")
          .sidecart__icon-total-container(v-if="cartIcon")
            img.sidecart__cart-image(:src="cartIcon" :alt="cartIconAlt")
            span.cart-bubble-quantity.sidecart__header-total-badge(v-if="totalItems > 0" :class="colors.bubbleBg")
              span.cart-bubble-count.sidecart__header-total-badge-count(:class="[colors.bubbleText, {'cart-bubble-count--small': totalItems >= 100}]") {{ totalItems < 100 ? totalItems : '99+' }}
          .sidecart__icon-total-container(v-else)
            icon(name="cart" size="30px")
            span.cart-bubble-quantity.sidecart__header-total-badge(v-if="totalItems > 0" :class="colors.bubbleBg")
              span.cart-bubble-count.sidecart__header-total-badge-count(:class="[colors.bubbleText, {'cart-bubble-count--small': totalItems >= 100}]") {{ totalItems < 100 ? totalItems : '99+' }}
          h2.sidecart__title My Bag
          button.sidecart__close(label="Close side cart", @click="$store.dispatch('cart/closeSidecart')", aria-label="Close side cart")
            icon(name="close" size="24px")
        .sidecart__shipping-promo(v-if="shippingPromoEnabled" :class="colors.shippingBg")
          transition(name="fade")
            span.sidecart__shipping-promo-message.body-sm(v-if="!hasAServiceProduct && normalizedTotalPrice < shippingPromoTotal" :class="colors.shippingText") {{`Free shipping if you spend $${remainingThresholdValue}${totalPrice === 0 ? '' : ' more'}.`}}
            span.sidecart__shipping-promo-message.body-sm(v-if="!hasAServiceProduct && normalizedTotalPrice >= shippingPromoTotal" :class="colors.shippingText") {{shippingPromoCopy}}
        .sidecart__shipping-promo-progress-bar.background-color-primary-200(v-if="shippingPromoEnabled" :style="{width: `${remainingThresholdPercentage}%`}")
        .sidecart__container
          transition(name="fade", mode="out-in")
            .sidecart__contents-wrapper(v-if="totalItems > 0", key="content")
              .sidecart__contents(id="sidecartContents")
                sidecart-line-item(
                  v-for="(item, index) in itemsNotInKits",
                  :item="item",
                  :key="item.id")
                div(v-if="kits && kits.length")
                  sidecart-line-item-kit(
                    v-for="kit in kits"
                    :kit="kit"
                    :key="kit.id")
              .sidecart__footer(:class="enableFooterDropshadow ? 'footer-dropshadow-enabled' : ''")
                .sidecart__gift-messaging
                  .sidecart__gift-messaging-header
                    div
                      input(type="checkbox" id="gift_message_enable" v-model="giftEnabled" @input="toggleGift")
                      label(for="gift_message_enable") {{ hasAServiceProduct ? "Note for the Piercer" : (giftEnabled ? 'This is a Gift!' : 'Is this a Gift?')}}
                    transition(name="fade")
                      v-link.sidecart__gift-messaging-edit.body-sm(v-show="giftEnabled" :secondary="true" @click="addRemoveGiftMessage") {{giftMessageEnabled ? 'Remove Message' : 'Write a Message'}}
                  transition(name="fade")
                    .sidecart__gift-messaging-message(v-show="giftEnabled && giftMessageEnabled")
                      text-area-input.sidecart__gift-messaging-textarea(:char-limit="250" label="Write Your Message" v-model="giftMessage" :keydownEvent="debouncedUpdateGiftMessage" id="giftMessageInput") {{giftMessage}}
                  transition(name="fade")
                    p.sidecart__gift-messaging-message-confirmation.body-sm(v-if="giftMessageConfirmationActive") {{giftMessageConfirmationMessage}}
                table.sidecart__table
                  tbody.sidecart__table-body
                    tr.sidecart__table-row
                      td.sidecart__table-data-type.body-md.subtotal.strong-bold Subtotal
                      td.sidecart__table-data-price.body-md.subtotal {{ totalPrice | moneyWithoutDecimals }}
                    tr.sidecart__table-row.color-accent-2(v-if="savingsTotal !== totalPrice && savingsTotal > 0")
                      td.sidecart__table-data-type.savings.body-md You Saved
                      td.sidecart__table-data-price.savings.body-md {{ savingsTotal | moneyWithoutDecimals }}
                v-button.sidecart__checkout-cta.button.button--primary(:full="true" type="submit" name="checkout" value="Checkout" @click="goToCheckout" :class="[{'sidecart__checkout-cta-promo-active' : promoMessage }]" label="CHECKOUT")
                v-button.sidecart__checkout-cta.gsx-checkout__button.button.button--primary(:full="true" type="submit" name="international checkout" value="Checkout" @click="goToIntlCheckout" :class="[{'sidecart__checkout-cta-promo-active' : promoMessage }]" label="INTERNATIONAL CHECKOUT")
                .sidecart__promo(v-if="promoMessage")
                  p.sidecart__promo__copy.body-sm {{ promoMessage }}
            .sidecart__empty(v-else, key="empty")
              p.sidecart__empty__message {{ emptyText }}
              v-button.sidecart__empty__link(v-for="(link, index) in emptyLinkArray" :primary="true" :href="link.url", :label="link.text" :key="index" tag="a" v-if="link.text")
</template>

<script>
  import { mapState } from 'vuex'

  import Icon from 'scripts/components/basic/Icon.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'
  import VLink from 'scripts/components/buttons/VLink.vue'
  import AsyncButton from 'scripts/components/buttons/AsyncButton.vue'
  import TextAreaInput from 'scripts/components/forms/TextAreaInput.vue'
  import SidecartLineItem from './SidecartLineItem.vue'
  import SidecartLineItemKit from './SidecartLineItemKit.vue'
  import axios from 'axios'


  export default {
    name: 'Sidecart',
    components: {
      VButton,
      SidecartLineItem,
      Icon,
      VLink,
      TextAreaInput,
      AsyncButton,
      SidecartLineItemKit },
    props: {
      cartObject: Object,
      promoMessage: String,
      emptyText: String,
      emptyLinkArray: Array,
      shippingPromoEnabled: Boolean,
      shippingPromoTotal: Number,
      shippingPromoCopy: String,
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
        giftMessageSuccess: null,
        enableFooterDropshadow: false,
        giftMessageConfirmationActive: false,
        giftMessageConfirmationMessage: ""
      }
    },
    computed: {
      ...mapState({
        items: state => state.cart.checkout.items,
        allProducts: state => state.products.all,
        sidecartOpen: state => state.cart.sidecartOpen,
        itemsSubtotal: state => state.cart.checkout.items_subtotal_price,
        totalDiscount: state => state.cart.checkout.total_discount,
        totalPrice: state => state.cart.checkout.total_price,
        totalItems: state => state.cart.checkout.item_count,
        kits: state => state.cart.kits,
        cartIcon: state =>
          state.header.settings &&
          (state.header.settings.cartIconSvgUrl ||
            state.header.settings.cartIconImage ||
            state.header.defaultIcons.cartIconDefault),
        cartIconAlt: state => state.header.settings.cartIconImageAlt
      }),
      hasAServiceProduct(){
        const foundAService = this.items.find(item => item.product_type === "Services");
        return !(typeof foundAService === 'undefined')
      },
      allServiceProducts(){
        const allService = this.items.every(item => item.product_type === "Services");
        return allService;
      },
      isNotMobile() {
        if (this.$mq !== 'mobile') {
          return true
        } return false
      },
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
        if (this.giftMessageE)
        this.updateGiftMessage()
      },
      checkSpecialChars(message) {
        let pattern = RegExp(/[^\u0020-\u007E]/gm)
        return pattern.test(message)
      },
      updateGiftMessage() {
        if (this.giftEnabled === true && this.giftMessage !== "") {
          if (this.checkSpecialChars(this.giftMessage)) {
            this.giftMessageConfirmationMessage = 'Error! Please remove special characters and line breaks.'
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
  .button.gsx-checkout__button {
    display: none;
  }
  .sidecart {
    display: flex;
    flex-direction: column;
    background-color: $color-white;

    @include tablet-up {
      max-width: 480px;
    }

    &, &__overlay {
      position: fixed;
      right: 0;
      top: 0;
      height: 100%;
      width: 100%;
    }

    &__container {
      display: flex;
      flex-grow: 1;
      min-height: 0;  // override auto to prevent growing too tall
      height: 100%;
    }

    &__contents {
      flex-grow: 1;
      padding: 0 $grid-gutter;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 0;
      }
      &::-webkit-scrollbar-track,
      &::-webkit-scrollbar-thumb {
        background-color: transparent;
      }

      &-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
        height: calc(100vh - 70px); // declared height for IE 11
        height: -webkit-fill-available; // adjusts for bottom bar on iOS - will fallback safely if not supported
      }
    }

    &__overlay {
      background-color:#0E0E0E;
      opacity: 0.2;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      border: none;
      position: relative;
      background-color: $color-white;

      @include tablet-up {
        height: 44px;
      }
    }

    &__header--border-bottom {
      border-bottom: 1px solid $color-grey;
    }

    &__close {
      opacity: 1;
      transition: opacity 200ms ease;
      &:hover {
        opacity: 0.5;
      }
    }
    &__icon-total-container {
      position: relative;
    }
    &__shipping-promo {
      padding: 10px;
      text-align: center;
    }
    &__shipping-promo-progress-bar {
      height: 4px;
      transition: width 200ms ease;
    }
    &__footer {
      padding-top: 8px;
      border: none;
      position: relative;
      &.footer-dropshadow-enabled {
        z-index: 1;
        box-shadow: 0 -1px 8px rgba(0,0,0,0.1);
      }
    }
    &__gift-messaging {
      padding: 16px 10px;
      border-top: 1px solid $color-grey;
      border-bottom: 1px solid $color-grey;
      background: $color-black-100;
      margin: 8px 0 16px;
      &-header {
        display: flex;
        justify-content: space-between;
        input[type="checkbox"]{
          display: none;
          &:checked + label{
            &:after{
              background: $color-white;
              border-color: $color-primary-500;
            }
            &:before{
              position: absolute;
              left: 4px;
              top: 4px;
              background: $color-primary-500;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              z-index: 1;
            }
          }
        }
        label{
          position: relative;
          padding-left: 25px;
          &:after{
            content: '';
            background: white;
            width: 16px;
            height: 16px;
            position: absolute;
            left: 0;
            top: 0;
            border-radius: 50%;
            border: 1px solid $color-black-900;
          }
          &:before{
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
    &__table {
      display: table;
      width: 100%;
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
    &__promo {
      background-color: $color-white;
      padding: 16px;
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
      padding: 0 $grid-gutter;

      &__message {
        @include h5-desktop;
        margin-bottom: 16px;
      }
      &__image,
      &__message {
        margin: 0 0 24px;
      }
      &__link {
        width: 220px;
        margin-bottom: 16px;
      }
    }
    &__checkout-cta {
      margin-top: 10px;
      height: 50px;
      width: 100%;
      margin-bottom: 24px;
      /deep/ .button__content {
        line-height: 50px;
      }
    }
    &__checkout-cta-promo-active {
      margin-bottom: 16px;
    }
    &__header,
    &__footer {
      padding: $grid-gutter;
      flex-shrink: 0;
    }
    &__footer {
      padding-top: 8px;
    }
    &__empty__link {
      padding: 0;
    }
    &__cart-image {
      width: 30px;
      height: auto;
    }
    &__gift-messaging-textarea {
      label{
        display: block;
      }
    }
  }

  .sidecart__checkout-cta.link--secondary {
    &:hover {
      &:before {
        height: 100%;
      }
    }
  }

  .sidecart__title {
    @include h4-mobile;
  }

  .sidecart__line-item__title,
  .sidecart__line-item__options span,
  .sidecart__line-item__quantity__label,
  .sidecart__line-item__price span,
  .sidecart__checkout-cta .button__content,
  .sidecart__gift-messaging-edit,
  .sidecart__table-data-type,
  .sidecart__table-data-price,
  .sidecart__gift-messaging-header label {
    font-family: $font-family-secondary !important;
    font-weight: 600 !important;
    vertical-align: sub;
  }
  .sidecart__gift-messaging-edit *{
    font-size: 12px;
  }
</style>
