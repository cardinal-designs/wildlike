<template lang="pug">
  div.product-share(:class="{'product-share--open': shadowOpen}")
    button(@click="() => { shadowOpen = !shadowOpen; $emit('input', shadowOpen);}")
      span.link-text(v-show="!shadowOpen", key="share") Share
      icon(v-show="shadowOpen", key="close", name="close", size="20px")
    .product-share__icon-container(v-show="shadowOpen")
      a.product-form__share-icon(:href="shareLinks.facebook", target="_blank" aria-label="Facebook")
        icon(name="facebook_pdp" size="20px")
      a.product-form__share-icon(:href="shareLinks.twitter", target="_blank" aria-label="Twitter")
        icon(name="twitter_pdp" size="20px")
      a.product-form__share-icon(:href="shareLinks.pinterest", target="_blank" aria-label="Pinterest")
        icon(name="pinterest_pdp" size="20px")
      a.product-form__share-icon(:href="shareLinks.email", target="_blank" aria-label="Email")
        icon(name="email_pdp" size="20px")
</template>

<script>
import { overrideDataOnChange, getProductSocialLinks } from '../../helpers/util';
import Icon from '../basic/Icon.vue';

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    product: Object,
    variant: Object,
    collection: Object,
  },
  model: {
    prop: 'open',
  },
  components: { Icon },
  data() {
    return {
      shadowOpen: this.open,
    }
  },
  computed: {
    shareLinks() {
      return getProductSocialLinks(undefined, this.collection, this.product, this.variant);
    },
  },
  watch: {
    open: overrideDataOnChange('shadowOpen')
  }
}
</script>

<style lang="scss">
  .product-share {
    position: relative;
    display: inline-block;
    padding: 8px 4px;

    &__icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button * {
      transition: none !important;
      vertical-align: middle;
    }

    a {
      display: inline-block;
      margin: 0 8px;
      vertical-align: middle;
    }

    svg {
      vertical-align: middle;
    }
  }

  .product-share--open {
    padding: 17px 4px;
    border: 1px solid $color-brand-primary;
    border-radius: 4px;
    text-align: center;
    width: 100%;

    button {
      position: absolute;
      top: 17px;
      right: 8px;
    }
  }
</style>