<template lang="pug">
    tr.cart__line-item.cart-line-item__row(v-if="item", :class="[itemClass, inKit ? `kit-${kitId}-${line - 1}` : '', inKit ? 'kit-item' : '']")
      td.cart__line-item__column.flex-row
        a.cart__line-item__outer-image-wrapper(:href="item.url" :aria-label="`Link to ${item.title} product page`")
          .cart__line-item__image-wrapper(:style="{backgroundImage: `url(${item.image})`}" :alt="item.title")
        .cart__line-item__product-details
          .cart__line-item__title
            .cart__line-item__vendor {{ product.vendor }}
            a.cart__line-item__details.body-md(:href="item.url") {{ itemName }}
            .cart__line-item__options
              span.body-sm
                span.cart__line-item__details.cart__line-item__sku.body-sm(v-if="subtitlePreText") {{`${subtitlePreText} `}}
                span.cart__line-item__details.body-sm {{ item.sku }}
              span.cart__line-item__details.cart__line-item__option.body-sm(v-for="option in item.options_with_values" v-if="option.value !== 'Default Title'") {{option.name}}: {{option.value}}
              span.cart__line-item__details.cart__line-item__option.cart__line-item__properties.body-sm(v-for="(prop_value, prop_name) in item.properties" v-if="hasPropertiesToShow") {{prop_name}}: {{prop_value}}
      td.cart__line-item__column
        p
          span.body-sm(v-if="item.line_price > 0" :class="{ [`cart__line-item__price-discount strong-bold color-accent-2`]: isDiscounted }") #[span.visually-hidden Now: ]{{ item.line_price | moneyWithoutDecimals }}
          span.body-sm(v-else) #[span.visually-hidden Now: ]FREE
          span.cart__line-item__price-compare-at.body-md-sm(v-if="isDiscounted") #[span.visually-hidden Was: ]{{ comparePrice | moneyWithoutDecimals }}
      td.cart__line-item__column(v-if="!disableQuantity")
        .cart__line-item__flex
          .cart__line-item__quantity
            template(v-if="!IS_BOURDAIN")
              button.cart__line-item__quantity__change( label="Decrement Count" @click="decrement" aria-label="Decrease count" :disabled="item.quantity === 1")
                icon(class="fill-black" name="minus" size="12px")
              p.cart__line-item__quantity__label {{ item.quantity }}
              button.cart__line-item__quantity__change(label="Increment Count", @click="increment" aria-label="Increase count")
                icon(class="fill-black"  name="plus" size="14px")
            quantity-selector(
              v-else
              :value="item.quantity"
              @input="updateQuantity"
            )
          .cart__line-item__remove
            v-link(v-if="!disableRemove" @click="removeItem" :secondary="true") Remove
      td.cart__line-item__column(v-else)
        div
</template>

<script>
  import { mapState } from 'vuex'
  import range from 'lodash/range';
  import { debounce } from 'scripts/helpers/util.js'
  import VLink from 'scripts/components/buttons/VLink.vue'
  import Icon from 'scripts/components/basic/Icon.vue'
  import QuantitySelector from 'scripts/components/basic/Quantity.vue';

  export default {
    name: 'CartLineItem',
    components: { Icon, VLink, QuantitySelector },
    props: {
      item: Object,
      line: Number,
      inKit: Boolean,
      kitId: [Number, String],
      disableQuantity: Boolean,
      disableRemove: Boolean,
    },
    data () {
      return {
        updating: false,
        selectOptions: range(1, 11).map(qty => ({label: qty, value: qty})),
        isPDPDesign2: window.bvaccel && window.bvaccel.themeTemplates && window.bvaccel.themeTemplates.product === 'BourdainProductDisplay',
      }
    },
    computed: {
      ...mapState({
        allProducts: state => state.products.all,
        IS_BOURDAIN: state => state.config.IS_BOURDAIN
      }),
      itemClass () {
        return {
          'updating': this.updating
        }
      },
      product () {
        return this.allProducts.find(product => {
          return Boolean(product.variants.find(variant => this.item.id === variant.id))
        })
      },
      variant () {
        return this.product ? this.product.variants.find(variant => variant.id === this.item.id) : null
      },
      hasPropertiesToShow () {
        const props_keys = Object.keys(this.item.properties);
        return props_keys.length && !props_keys.includes('_base_product') && !props_keys.includes('shipping_interval_frequency') && !props_keys.includes('shipping_interval_unit_type');
      },
      hasBaseProduct () {
        return this.item.properties && !!this.item.properties._base_product;
      },
      baseProduct () {
        if(this.hasBaseProduct) {
          return this.allProducts.find(product => product.handle === this.item.properties._base_product)
        }

        return null;
      },
      itemName () {
        if(this.baseProduct) {
          const freq = this.item.properties.shipping_interval_frequency
          const unit = this.item.properties.shipping_interval_unit_type

          return `${this.item.product_title} - ${freq} ${unit} Subscription`;
        }

        return this.item.product_title;
      },
      comparePrice () {
        if(this.baseProduct) {
          return this.baseProduct.price * this.item.quantity;
        }

        return (this.variant) ? parseInt(this.variant.compare_at_price, 10) * this.item.quantity : this.item.price * this.item.quantity
      },
      isDiscounted () {
        return !isNaN(this.comparePrice) && this.item.price * this.item.quantity < this.comparePrice
      },
      subtitlePreText() {
        return window.bvaccel.schema.productTile.subtitle_pretext
      }
    },
    methods: {
      removeItem () {
        this.updating = true

        this.$store.dispatch('cart/removeItems', {key: this.item.key})
          .catch(error => this.$store.dispatch('toast/send', { text: error, type: 'error' }))
          .then(() => this.updating = false)
      },
      increment () {
        this.updateQuantity(this.item.quantity + 1)
      },
      decrement () {
        if (this.item.quantity > 0) {
          this.updateQuantity(this.item.quantity - 1)
        }
      },
      updateQuantity: debounce(function (newQuantity) {
        this.updating = true

        if (newQuantity < 1) {
          this.removeItem()
          return
        }

        this.$store.dispatch('cart/updateItems', { key: this.item.key, quantity: newQuantity })
          .catch(error => this.$store.dispatch('toast/send', { text: error, type: 'error' }))
          .then(() => this.updating = false)
      }, 100)
    },
    created () {
      if(this.hasBaseProduct && !this.baseProduct) {
        this.$store.dispatch('products/addProduct', this.item.properties._base_product)
      }
    }
  }
</script>

<style scoped lang="scss">

  .cart__line-item__column {
    text-align: left;
    padding: 24px 0;
  }

  .cart__line-item__flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cart__line-item {
    position: relative;
    align-items: center;
    border-top: 1px solid $color-black-300;

    &__vendor {
      font-weight: 900;
      font-family: $font-family-primary;
      font-size: rem(16);
      line-height: 24px;
      margin-bottom: 2px;
      text-transform: uppercase;
      font-style: italic;
    }

    &__details{
      font-weight: 600;
      font-family: $font-family-secondary;
      font-size: rem(14);
      line-height: 24px;
    }

    &.updating {
      opacity: 0.5;
      pointer-events: none;

      &.slide-fade-left-leave-active {
        opacity: 0;
      }
    }

    &__product-info-container {
      width: 100%;
      display: flex;
      align-items: center;
    }

    &__image-product-details-container {
      display: flex;
      width: 60%;
      align-items: center;
    }

    &__product-details {
      margin-right: 24px;
      margin-left: 24px;
      display: flex;
      align-items: center;
    }

    &__image-wrapper {
      width: 112px;
      height: 112px;
      padding: 0;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }

    &__image {
      max-height: 100%;
      flex-shrink: 0;
    }

    &__content {
      margin-left: 24px;
    }

    &__header,
    &__details {
      display: flex;
    }

    &__details {
      justify-content: space-between;
    }

    &__title {
      a {
        @include cart-line-item-title;
        text-align: left;
        color: inherit;
      }
    }

    &__options {
      padding-top: 3px;
      display: flex;
      flex-direction: column;
      color: $color-black-900;
    }

    &__sku {
      span {
        font-size: inherit;
      }
    }

    &__price-remove-container {
      display: flex;
      justify-content: space-between;
      width: 20%;
    }

    &__remove {
      text-align: right !important;
    }

    &__remove a {

      @media screen and (min-width: 1024px) and (max-width: 1150px) {
        font-size: 14px;
      }
    }

    &__price {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 32px;

      &-discount{
        margin-right: 5px;
      }

      &-compare-at {
        color: $color-black;
        text-decoration: line-through;
      }
    }

    &__price span {

      @media screen and (min-width: 1024px) and (max-width: 1150px) {
        font-size: 14px;
      }
    }

    &__quantity {
      display: inline-flex;
      margin-right: 16px;
      align-items: center;
      border: 1px solid $color-light-grey;
      &__label {
        width: 27px;
        color: $color-black-900;
        text-align: center;
        margin: 0 12px;
      }

      &__change {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 35px;
        height: 45px;
        &[disabled] {
          background-color: transparent;
          opacity: 0.3;
        }
      }
    }

    /deep/ &-quantity-select {
      max-width: 50px;

      .vs__dropdown-menu {
        max-width: 50px;
      }
    }

    &__price-remove-container {
      display: flex;
      align-items: center;
    }
  }
</style>
