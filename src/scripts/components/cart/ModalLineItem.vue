<template lang="pug">
  transition(name="slide-fade-left")
    .sidecart__line-item(v-if="item", :class="[itemClass, inKit ? `kit-${_kitId}-${line - 1}` : '', inKit ? 'kit-item' : '']")
      .sidecart__line-item__image-wrapper(:alt="item.product_title" :style="`backgroundImage: url(${item.image})`")
      .sidecart__line-item__content
        p.body-sm.strong-bold.sidecart__line-item__title {{ itemName }}
        p.sidecart__line-item__price
          span.body-sm(v-if="item.line_price > 0" :class="{ [`sidecart__line-item__price-discount ${$store.state.comparePriceColor}`]: isDiscounted }") {{ item.line_price | moneyWithoutDecimals }}
          span.body-sm(v-else) FREE
          s.body-sm.sidecart__line-item__price-compare-at.color-grey(v-if="isDiscounted") {{ comparePrice | moneyWithoutDecimals }}
        button.sidecart__line-item__remove.color-black.body-sm.hover-opacity(v-if="!disableRemove" tag="button" label="Remove" @click="removeItem", aria-label="Remove item") Remove
      .sidecart__line-item__quantity(v-if="!disableQuantity")
        quantity-selector(:value="item.quantity", @input="updateQuantity")
</template>

<script>
  import { mapState } from 'vuex'
  import { badge, debounce } from 'scripts/helpers/util.js'
  import SelectInput from '../forms/SelectInput.vue';
  import NumberInput from 'scripts/components/forms/NumberInput.vue';
  import QuantitySelector from 'scripts/components/basic/Quantity.vue';
  import range from 'lodash/range';

  export default {
    name: 'ModalLineItem',
    components: {
      NumberInput,
      QuantitySelector,
    },
    props: {
      item: Object,
      line: Number,
      inKit: Boolean,
      _kitId: [Number, String],
      disableQuantity: Boolean,
      disableRemove: Boolean
    },
    data () {
      return {
        updating: false,
        isPDPDesign2: window.bvaccel && window.bvaccel.themeTemplates && window.bvaccel.themeTemplates.product === 'BourdainProductDisplay',
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
      /** @returns {String} */
      productBadge() {
        if (this.variant) {
          return badge(this.product, this.variant, this.isDiscounted);
        }
      }
    },
    methods: {
      removeItem () {
        this.updating = true
        this.$store.dispatch('cart/removeItems', {key: this.item.key})
          .catch(error => this.$store.dispatch('toast/send', { text: error, type: 'error' }))
          .then(() => this.updating = false)
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
  .sidecart__line-item {
    text-align: left;
    display: flex;
    position: relative;
    align-items: center;

    .hover-opacity {
      transition: opacity .15s ease;

      &:hover {
        opacity: .7;
      }
    }


    &.updating {
      opacity: 0.5;
      pointer-events: none;

      &.slide-fade-left-leave-active {
        opacity: 0;
      }
    }

    &__image-wrapper {
      width: 56px;
      height: 56px;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      flex-shrink: 0;
      margin-right: 8px;
    }

    &__content {
      flex-grow: 1;

      > * + * {
        margin-top: 4px;
      }
    }

    &__title {
      flex-grow: 1;
      padding-right: 8px;
      margin: 0;
    }

    &__option-list {
      display: flex;
      flex-direction: column;
      span {
        color: $color-black-900;
      }
    }

    &__remove {
      text-decoration: underline;
    }

    &__price {
      flex-grow: 1;
      margin: 0;

      &-discount {
        margin-right: 8px;
      }
    }

    &__quantity {
      min-width: 72px;
      max-width: 72px;

      /deep/ .quantity {
        width: 100%;
        border: 1px solid $color-black-100;
        align-items: center;
      }

      /deep/ .quantity__change {
        display: none;
      }

      /deep/ .quantity__label {
        font-family: $font-family-secondary;
        font-weight: 600;
        width: 100%;
      }
    }
  }
</style>
