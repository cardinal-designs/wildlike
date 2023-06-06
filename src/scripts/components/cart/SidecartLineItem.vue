<template lang="pug">
  transition(name="slide-fade-left")
    .sidecart__line-item(v-if="item", :class="[itemClass, inKit ? `kit-${_kitId}-${line - 1}` : '', inKit ? 'kit-item' : '']")
      span.sidecart__line-item-badge.badge(
        :class='$store.state.badgeColorMap[productBadge]'
        v-if='productBadge'
      ) {{ productBadge }}
      a.sidecart__line-item__image-wrapper(:alt="item.product_title" :style="`backgroundImage: url(${item.image})`" :href="item.url")
      .sidecart__line-item__content
        .sidecart__line-item__info
          .sidecart__line-item__header
            a.sidecart__line-item__title(:href="item.url") {{ itemName }}
            button.sidecart__line-item__remove(v-if="!disableRemove" label="Remove" @click="removeItem", aria-label="Remove item")
              icon(name="close" size="15px")
          .sidecart__line-item__option-list
            span.sidecart__line-item__option.sidecart__line-item__sku.body-sm
              span {{ item.sku }}
            span.sidecart__line-item__option.body-sm(v-for="option in item.options_with_values" v-if="option.value !== 'Default Title'") {{option.name}}: {{option.value}}
            span.sidecart__line-item__option.sidecart__line-item__properties.body-sm(v-for="(prop_value, prop_name) in item.properties" v-if="hasPropertiesToShow") {{prop_name}}: {{prop_value}}
          .sidecart__line-item__quantity(v-if="!disableQuantity && !lineItemIsAService")
            button.sidecart__line-item__quantity__change( label="Decrement Count" @click="decrement" :disabled="item.quantity === 1" aria-label="Decrease count")
              icon(class="fill-black" name="minus" size="12px")
            p.sidecart__line-item__quantity__label.body-md {{ item.quantity }}
            button.sidecart__line-item__quantity__change(label="Increment Count", @click="increment" aria-label="Increase count")
              icon(class="fill-black"  name="plus" size="14px")
        .sidecart__line-item__details
          p.sidecart__line-item__price
            span(v-if="item.line_price > 0" :class="{ [`sidecart__line-item__price-discount color-accent-2`]: isDiscounted }") #[span.visually-hidden Now: ]{{ item.line_price | moneyWithoutDecimals }}
            span(v-else) #[span.visually-hidden Now: ]FREE
            span.sidecart__line-item__price-compare-at(v-if="isDiscounted") #[span.visually-hidden Was: ]{{ comparePrice | moneyWithoutDecimals }}
</template>

<script>
  import axios from 'axios';
  import range from 'lodash/range';
  import { mapState } from 'vuex'
  import { badge, debounce } from 'scripts/helpers/util.js'

  import Icon from 'scripts/components/basic/Icon.vue'
  import QuantitySelector from 'scripts/components/basic/Quantity.vue';


  export default {
    name: 'SidecartLineItem',
    components: {
      Icon,
      QuantitySelector
    },
    props: {
      item: Object,
      line: Number,
      inKit: Boolean,
      _kitId: [Number, String],
      disableQuantity: Boolean,
      disableRemove: Boolean,
    },
    data () {
      return {
        updating: false
      }
    },
    computed: {
      ...mapState({
        allProducts: state => state.products.all
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
      lineItemIsAService() {
        return this.item.product_type === "Services"
      },
      hasBaseProduct () {
        return this.item.properties && !!this.item.properties._base_product;
      },
      hasPropertiesToShow () {
        const props_keys = Object.keys(this.item.properties);
        return props_keys.length && !props_keys.includes('_base_product') && !props_keys.includes('shipping_interval_frequency') && !props_keys.includes('shipping_interval_unit_type');
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
      /** @returns {String} */
      productBadge() {
        if (this.variant) {
          return badge(this.product, this.variant, this.isDiscounted);
        }
      },
      subtitlePreText() {
        return window.bvaccel.schema.productTile.subtitle_pretext
      }
    },
    methods: {
      getProductJSON(handle, callback) {
        axios.get(`/products/${handle}?view=json`, {withCredentials: true})
          .then((res) => {
            if(res && res.data) {
              callback(res.data);
            }
          })
          .catch((e) => console.error('error fetching recommended products', e.message));
      },
      removeItem () {
        this.updating = true
        this.$store.dispatch('cart/removeItems', {key: this.item.key})
          .catch(error => this.$store.dispatch('toast/send', { text: error, type: 'error' }))
          .then(() => this.updating = false)
      },

      increment () {
        this.getProductJSON(this.item.handle, (data) => {
          const remainingQuantity = data.selected_or_first_available_variant.remaining_quantity;
          if (this.item.quantity > remainingQuantity && remainingQuantity != 0 && this.item.quantity != 0) {
              this.updateQuantity(remainingQuantity)
          }
          if (remainingQuantity >=  this.item.quantity + 1)  {
              this.updateQuantity(this.item.quantity + 1)
          }
        });
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
        this.getProductJSON(this.item.handle, (data) => {
          const remainingQuantity = data.selected_or_first_available_variant.remaining_quantity;
          if (newQuantity > remainingQuantity && remainingQuantity != 0 && newQuantity != 0) {
            newQuantity = remainingQuantity
          }
        });
        this.$store.dispatch('cart/updateItems', { key: this.item.key, quantity: newQuantity })
          .catch(error => this.$store.dispatch('toast/send', { text: error, type: 'error' }))
          .then(() => this.updating = false)
      }, 100)
    },
    created () {
      if (this.item.product_type !== "Services") {
        this.getProductJSON(this.item.handle, (data) => {
          const remainingQuantity = data.selected_or_first_available_variant.remaining_quantity;
          if (this.item.quantity > remainingQuantity && remainingQuantity != 0 && this.item.quantity != 0) {
              this.updateQuantity(remainingQuantity)
          }
          if(this.hasBaseProduct && !this.baseProduct) {
            this.$store.dispatch('products/addProduct', this.item.properties._base_product)
          }
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .sidecart__line-item:first-of-type  {
    padding: 20px 0 14px;
  }
  .sidecart__line-item {
    display: flex;
    position: relative;
    padding: 14px 0;
    border-bottom: 1px solid $color-black-100;

    &.updating {
      opacity: 0.5;
      pointer-events: none;

      &.slide-fade-left-leave-active {
        opacity: 0;
      }
    }

    &__image-wrapper {
      width: 112px;
      height: 110px;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      flex-shrink: 0;

      @include mobile-only {
        width: 72px;
        background-position: top;
      }
    }

    &__info {
      width: 52%;
    }

    &__content {
      padding-left: 8px;
      flex-grow: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    &__header,
    &__details {
      display: flex;
    }

    &-badge {
      position: absolute;
      font-size: 8px;
    }

    &__details {
      justify-content: space-between;
      width: 48%;

      /deep/ .quantity {
        padding: 8px;
        width: 100%;
        max-width: 120px;
        border: 1px solid $color-black-100 !important;
        border-radius: 2px;
        background-color: $color-white;
      }

      /deep/ .quantity__label {
        font-family: $font-family-secondary;
        font-weight: 600;
        width: 100%;
      }

      /deep/ .quantity__change {
        flex: 0 0 auto;

        &:not(:hover) {
          box-shadow: none;
        }
      }
    }

    &__title {
      @include sidecart-line-item-title;
      font-family: $font-family-primary;
      font-style: italic;
      text-transform: uppercase;
      font-weight: 900;
      flex-grow: 1;
      padding-right: 8px;
      margin: 0;
      color: inherit;
      line-height: 100%;
    }

    &__option-list {
      display: flex;
      flex-direction: column;
      span {
        color: $color-black-900;
      }
    }

    &__sku {
      span {
        font-size: inherit;
      }
    }

    &__option {
      &:nth-child(1) {
        padding-top: 4px;
      }

      &:last-child {
        padding-bottom: 4px;
      }
    }

    &__remove {
      //align-self: flex-start;
      margin-top: 0;
      opacity: 1;
      transition: opacity 200ms ease;
      position: absolute;
      top: 0;
      right: 0;
      &:hover {
        opacity: 0.5;
      }
    }

    &__price {
      text-align: right;
      flex-grow: 1;
      line-height: 32px;
      margin: 0;

      span {
        @include sidecart-line-item-title;
      }

      &-compare-at {
        display: inline-block;
        margin-right: 8px;
        color: $color-black;
        text-decoration: line-through;
      }

      &-discount {
        //font-weight: bold;
        margin-right: 8px;
      }
    }

    &__quantity {
      display: inline-flex;
      margin-top: 12px;
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
        //border-radius: 100%;
        //box-shadow: 1px 1px 8px rgba(0,0,0,0.1);
        //transition: box-shadow 200ms ease;
        &[disabled] {
          background-color: transparent;
          opacity: 0.3;
        }
        &:hover {
          //box-shadow: 1px 1px 8px rgba(0,0,2px,0.2);
        }
      }
    }

    /deep/ &-quantity-select {
      max-width: 50px;

      .vs__dropdown-menu {
        max-width: 50px;
      }
    }
  }
</style>
