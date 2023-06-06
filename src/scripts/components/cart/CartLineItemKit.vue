
<template lang="pug">
  .sidecart-line-item-kit
    .sidecart-line-item-kit__heading
      h5.sidecart-line-item-kit__h5 {{ getKitLineItemHeader(kit.items) }}
      icon.sidecart-line-item-kit__remove(name="close" size="16px" @click="removeKit")
    cart-line-item(
      v-for="(item, index) in kit.items"
      :item="item"
      :line="index + 1"
      :kit-id="item.properties_kitId"
      disable-remove
      disable-quantity
      in-kit
      :key="item.id")
</template>

<script>
  import axios from 'axios'

  import Icon from 'scripts/components/basic/Icon.vue'
  import CartLineItem from './CartLineItem.vue'
  import { getKitLineItemHeader } from '../../helpers/util';
  import pick from 'lodash/pick';

  export default {
    name: 'SidecartLineItemKit',
    components: { Icon, CartLineItem },
    props: {
      kit: Object
    },
    methods: {
      getKitLineItemHeader,
      removeKit() {
        // forcing clean cart request for IE11
        let timestamp = new Date().getTime()

        let removeItems = this.kit.items.map(item => ({key: item.key}))

        this.$store.dispatch('cart/removeItems', removeItems)
          .catch(err => {
          })
      }
    }
  }
</script>

<style scoped lang="scss">
.sidecart-line-item-kit {
  padding-bottom: 16px;
  border-bottom: 1px solid $color-grey;
  &__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    padding-bottom: 8px;
  }
  &__remove {
    cursor: pointer;
    opacity: 1;
    transition: opacity 200ms ease;
    &:hover {
      opacity: 0.5;
    }
  }
  /deep/ .cart__line-item {
    background-color: $color-white;
    border: none;
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
