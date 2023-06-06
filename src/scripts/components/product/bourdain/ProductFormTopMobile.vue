<template lang="pug">
  article.pftm

    //- product-promo-card.u-hidden-mobile-only.margin-top(
    //-   v-if="onSale && product.tags.map(lowercase).includes('deal of the week')"
    //-   style="margin-bottom: 16px;"
    //- )
    //-   span(slot="heading")
    //-     icon(name="check", size="24px")
    //-     span.body-md.strong-bold Deal of the Week
    //-   span.body-sm(slot="subheading") This is a one time purchase opportunity!
    //- p.u-hidden-mobile-only.margin-top(v-show="onSale && product.tags.map(lowercase).includes('deal of the week')")

    //- Reviews
    //- .pftm__flex-row
    //-   .pftm__flex-row.pftm__review-row.pftm
    //-     span.pdp__review-stars-container
    //-       span.pdp__review-stars.shopify-product-reviews-badge(v-if="!settings.hideReviews && reviewSource === 'shopify'" :data-id="product.id")
    //-       bazaar-voice-reviews(v-else-if="!settings.hideReviews && reviewSource === 'bazaarvoice'" format="inline_rating" :productID="product.id" productURL="#BVRRContainer")
    //-     .pftm__badges.u-hidden-tablet-up
    //-       span.badge.button-text(v-for="badge in badges.slice(0,3)", :key="badge" v-if="variant", :class="[$store.state.badgeColorMap[badge][0]]") {{ badge }}

    //- product-promo-card.u-hidden-mobile-only.margin-top(
    //-   v-if="onSale && product.tags.map(lowercase).includes('deal of the week')"
    //-   style="margin-bottom: 16px;"
    //- )
    //-   span(slot="heading")
    //-     icon(name="check", size="24px")
    //-     span.body-md.strong-bold Deal of the Week
    //-   span.body-sm(slot="subheading") This is a one time purchase opportunity!
    //- p.u-hidden-mobile-only.margin-top(v-show="onSale && product.tags.map(lowercase).includes('deal of the week')")
    .pftm__flex-row
      h5.pdp-product-vendor(v-if="product.vendor" @click="navigateToCollections(product.vendor)") {{ product.vendor }}
    .pftm__flex-row
      h1.pdp-product-title {{ product.title }}
    template
      .pftm__flex-row
        //- v-link.pftm__right-margined(primary, v-if="customFields.d2_collection_link", :href="`/collections/${customFields.d2_collection_link}`") {{ customFields.d2_collection_link_text }}
        span.pdp__sku.pftm__sku-mobile.body-sm(v-if="skuText && skuText.length > 0") Item #: {{ skuText }}
        //- PDP STOCK
        //- span.pdp__stock.u-hidden-mobile-only(
        //-   v-if="variant"
        //-   :class="variant.available ? 'pdp-in-stock-flag' : 'pdp-out-of-stock-flag'"
        //- ) {{ variant.available ? 'in stock' : 'out of stock' }}
    product-upsell-card.u-hidden-mobile-only.margin-top(
      v-if="settings.upsellCardProduct.handle"
      :product="settings.upsellCardProduct"
      :heading="customFields.d2_upsell_heading"
      :description="customFields.d2_upsell_description"
      :callout="customFields.d2_upsell_alert_text"
    )
    .pftm__price-container(v-if="!isCallForPrice(product)")
      span.pftm__price.pdp-price(
        v-if="variant"
        :class="prices.price < prices.compare_at_price ? 'pftm__price--accent' : ''"
      ) #[span.visually-hidden Now: ]{{ prices.price | moneyWithoutDecimals }}
      span.pftm__price-compare.pdp-price.pdp-price-compare(v-if="variant && prices.price < prices.compare_at_price") #[span.visually-hidden Was: ]{{ prices.compare_at_price | moneyWithoutDecimals }}

      .affirm-holder
        .affirm-as-low-as(
          data-page-type="product",
          data-affirm-color="blue",
          :data-amount="prices.price"
        ) Starting at 0% APR at
          span.affirm-ala-price(:data-amount="variant.price") /mo with
          span.__affirm-logo.__affirm-logo-blue.__ligature__affirm_full_logo__
      //- AFFIRM APR https://docs.affirm.com/affirm-developers/docs/customize-affirm-promotional-messaging
      //- span.pftm__APR &nbsp;Starting at 0% APR at $308/Mo with
      //- span
      //-   img.pftm__APR-logo(src="https://cdn.shopify.com/s/files/1/0444/4028/9445/files/Affirm_logo.svg?v=1601958525")
      //- span
      //-   icon(name="info", size="12px")
</template>

<script>
import { badgeList, isCallForPrice } from '../../../helpers/util';
import VLink from '../../buttons/VLink.vue';
import ProductUpsellCard from './ProductUpsellCard.vue';
import ProductPromoCard from './ProductPromoCard.vue';
import BazaarVoiceReviews from 'scripts/components/product/BazaarVoiceReviews.vue';
import Icon from '../../basic/Icon.vue';
// import lowercase from 'lodash/lowerCase';
// lodash commented out since it though an error and prevent the site from loading.
// import lowercase from 'lodash/lowerCase';


export default {
  name: "ProductFormTopMobile",
  props: {
    collection: Object,
    product: Object,
    customFields: Object,
    variant: Object,
    settings: Object,
    prices: Object,
    displayVendor: Boolean
  },
  model: {
    prop: 'variant',
  },
  data() {
    return {
      reviewSource: window.bvaccel && window.bvaccel.reviewSource,
    }
  },
  components: {
    VLink,
    Icon,
    ProductUpsellCard,
    ProductPromoCard,
    BazaarVoiceReviews
  },
  watch: {
    variant() {
      this.$nextTick(() => {
        try {
          affirm.ui.refresh();
        } catch (e) {}
      });
    }
  },
  computed: {
    skuText () {
      return  this.variant ? `${this.variant.sku}` : '';
    },
    vendorText () {
      return this.variant && this.variant.cf_vendor ? this.variant.cf_vendor : this.customFields.product_vendor;
    },
    onSale() {
      return this.variant && this.variant.price < this.variant.compare_at_price;
    },
    badges() {
      return badgeList(this.product, this.variant, this.onSale);
    },
  },
  methods: {
    isCallForPrice,
    navigateToCollections(vendor) {
      window.location.href = `/collections/${vendor.toLowerCase().replace(" ", "-")}`;
    }
  }
}
</script>

<style lang="scss">
  .pftm {
    padding-top: 12px;
    padding-bottom: 12px;

    &__APR {
      font-size: 12px;
      margin-left: 8px;
      &-logo {
        width: 40px;
        margin: 0 8px;
      }
    }

    &__price {
      color: $color-black;
      
      &--accent {
        color: $color-accent-2-700;
      }
    }

    &__price-compare {
      color: $color-black;
      text-decoration: line-through;
      margin-right: 8px;
    }

    &__sku-mobile {
      display: inline-block;
      margin-right: 28px;
    }

    &__flex-row {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      width: 100%;
    }

    .link {
      text-decoration: underline;
    }

    .link::before,
    .link__content::before {
      display: none;
    }

    .spr-badge .spr-badge-caption {
      font-size: rem(12);
      font-family: $font-family-primary;
    }

    .spr-starrating {
      padding: 0;
    }

    .badge {
      position: relative;
      top: unset;
      left: unset;
      pointer-events: none;
      float: right;
      margin-left: 8px;
      font-size: rem(12);
      padding: 2px 0;
    }

    @include desktop-up {
      display: none;
      padding-bottom: 16px;
      margin-bottom: 0;
      padding-top: 0;
    }
    .pdp-vendor {
      text-transform: uppercase;
      letter-spacing: .5px;
      font-size: 12px;
    }
    .pdp-price{
      font-size: rem(20);
      line-height: 30px;
      margin-right: 8px;
      font-family: $font-family-secondary;
    }
    .pdp-product-title{
      margin-bottom: 8px;
    }

    .affirm-holder {
      display: inline-block;
    }
    .affirm-as-low-as,
    .affirm-ala-price,
    .affirm-modal-trigger {
      font-size: 12px;
    }
    .affirm-modal-trigger {
      color: $color-black-700;
      text-decoration: underline;
    }
  }
</style>

<style lang="scss" scoped>
.pdp-product-vendor {
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 100%;
    width: 0;
    height: 4px;
    transition: width 150ms linear;
    background: $color-primary-700;
    transform: translateY(-2px);
    z-index: 1;
  }

  &:hover::before,
  &:focus::before {
    width: 100%;
    background: $color-primary-700;
  }
}
</style>
