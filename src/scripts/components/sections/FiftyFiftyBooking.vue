<template lang="pug">
  .fifty-fifty-booking(:class="schema.backgroundColor")
    .ff__container(:style="{'max-width': schema.maxWidth}")
      split-wrapper(
        :imageWidthClass="schema.imageWidth"
        :backgroundColorClass="schema.backgroundColor"
        :textAlignmentClass="schema.textAlignment"
        :reversedClass="schema.layout"
        :marginTop="schema.marginTop"
        :marginBottom="schema.marginBottom"
      )
        template(slot="image")
          a.ff__image.ff__image--mobile(
            :href="schema.ctaUrl"
            :style="`background-image: url(${schema.imageMobile || schema.imageDesktop});`",
            :aria-label="schema.subheader || schema.preheader"
          )
          a.ff__image.ff__image--desktop.hidden-sm(
            :href="schema.ctaUrl"
            :style="`background-image: url(${schema.imageDesktop});`",
            :aria-label="schema.subheader || schema.preheader"
          )
        template(slot="content")
          .ff__main-wrap
            p.preheader.ff__preheader(:class="schema.preheaderColor", v-if="schema.preheader") {{ schema.preheader }}
            h2.ff__header(:class="[schema.imageWidth === 'sw--50' ? 'h3': 'h2', schema.headerColor]", v-if="schema.header") {{ schema.header }}
            p.subheader.ff__subheader(:class="schema.subheaderColor", v-if="schema.subheader") {{ schema.subheader }}
            .ff__body(:class="{[schema.bodyColor]: true, 'ff-body-margin-bottom--none': !(schema.ctaText && schema.ctaUrl)}", v-html="schema.body", v-if="schema.body")
            template(v-for="(variant, optIndex) of schema.serviceProductAllVariantIDs")
              div
                input(
                  type="radio"
                  :name="schema.serviceProductHandle"
                  :id="variant.id"
                  @change="variantChange(optIndex, variant)"
                )
                label(
                  :for="variant.id"
                ) {{ variant.title }}
            form(
              method="post"
              id="cartform"
              action="/cart/add"
            )
              input(
                type="hidden"
                name="id"
                :data-productid="schema.serviceProductID"
                :value="selectedVariantId"
              )
              .sesami__additionalButtonWrapper(
                :class="[productIdAsClassName]"
                :data-sesami-product-id="schema.serviceProductID"
                :data-sesami-variant-id="selectedVariantId"
              )
</template>

<script>
// import ProductTileBooking from '../product/ProductTileBooking.vue';
import Icon from 'scripts/components/basic/Icon.vue';
import VButton from '../buttons/VButton.vue';
import VLink from '../buttons/VLink.vue';
import SplitWrapper from '../basic/SplitWrapper.vue';
import { mapState } from 'vuex';

export default {
  name: "FiftyFiftyBooking",
  components: {
    // ProductTileBooking,
    VButton,
    VLink,
    SplitWrapper,
    Icon
  },
  props: {
    schema: Object,
    popupHeader: String,
    popupDescription: String,
    index: [String, Number]
  },
  data() {
    return {
      dateChosen: false,
      selectedVariantId: this.schema.serviceProductAllVariantIDs[0].id,
      showOverlay: false,
    }
  },
  computed: {
    ...mapState({
      itemsInCart: state => state.cart.checkout.items
    }),
    isFirstService(){
      // Sesami app requires to use an ID for the first service of the page and Classes for the other ones
      return this.index == 0 ? true : false;
    },
    isNotFirstService() {
      return {
        'sesami__additionalButtonWrapper': !this.isFirstService,
      }
    },
    productIdAsClassName(){
      const variantIdClass = "product-with-id-" + this.schema.serviceProductID.toString();
      return variantIdClass;
    },
  },
  methods: {
    variantChange(n, variant) {
      this.selectedVariantId = variant.id;
    },
    addToCart() {
      const buttonClass = ".product-with-id-" + this.schema.serviceProductID;
      const formElement = document.querySelector(buttonClass);
      const sesamiDateInput = formElement.querySelector("[name='properties[Date]']").value
      const sesamiTimeInput = formElement.querySelector("[name='properties[Time]']").value
      const sesamiTimezoneInput = formElement.querySelector("[name='properties[Timezone]']").value
      const sesamiTeamMemberInput = formElement.querySelector("[name='properties[Team Member]']").value

      let addService = {
        id: this.selectedVariantId,
        quantity: 1,
        properties: {
          Date: sesamiDateInput,
          Time: sesamiTimeInput,
          Timezone: sesamiTimezoneInput,
          'Team Member': sesamiTeamMemberInput
        }
      };
      this.$store
        .dispatch("cart/addItems", addService)
        .then(() => this.$store.dispatch("cart/afterAddToCart"))
        .then(() => (this.adding = false)
      );
    },
    closePopup(){
      this.showOverlay = false;
    }
  },
  mounted() {
    const that = this;

    window.addEventListener('sesami:loaded', function(){
      const buttonClass = ".product-with-id-" + that.schema.serviceProductID;
      const formElement = document.querySelector(buttonClass);
      const sesamiDateInput = formElement.querySelector("[name='properties[Date]']")
      sesamiDateInput.addEventListener('change', function(){
        that.addToCart();
        // const FD = new FormData( formElement )
        // createOrder(FD)
      })
    })
  }

}
</script>

<style lang="scss">
  .hidden {
    display: none;
  }

  .booking-sesami {
    &__button {
      padding: 0px;
    }
    .sesami__button{
      color: $color-white;
    }
  }
  .ff {
    &__container {
      margin: 0 auto;

      @include mobile-only {
        .sw__image {
          padding-right: 16px;
          padding-left: 16px;
        }
      }

      @include desktop-up {
        .sw__image {
          padding-left: 40px;
        }


        .sw--reverse {
          .sw__image {
            padding-left: 0;
            padding-right: 40px;
          }
        }
      }
    }

    &__main-wrap > * {
      margin-bottom: 8px;
    }

    &__main-wrap > *:last-child {
      margin-bottom: 0;
    }

    &__header {
      @include desktop-up {
        margin-bottom: 8px;
      }
    }

    &__body {
      margin-bottom: 24px;
      @include mobile-only {
        margin-bottom: 16px;
      }
    }

    &__body-margin-bottom--none {
      margin-bottom: 0;
    }


    .sw &__image--desktop {
      display: none;
    }

    .button {
      margin: 0;
    }

    @include desktop-up {
      .sw &__image--mobile {
        display: none;
      }

      .sw &__image--desktop {
        display: block;
      }

      .sw__main {
        padding: 5%;
      }
    }
  }
  @include mobile-only {
    .sw {
      &__image {
        height: 229px;
        min-height: 180px;
      }
    }
    .sw__main {
      padding: 0px 14px 24px;
    }
    .sw {
      padding: 24px 12px 0px;
    }
  }
  .ff__body.body-md p {
    // Passing the selected color to v-html
    color: inherit;
  }

  .ff__body p {
    font-family: $font-family-secondary;
    font-size: rem(16);
    font-weight: 600;
    line-height: 24px;
  }

  // .overlay {
  //   position: fixed;
  //   top: 0;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  //   background: rgba(0, 0, 0, 0.8);
  //   transition: opacity 500ms;
  //   z-index: 32;
  // }

  // .popup {
  //   margin: 61px auto 0;
  //   padding: 64px 64px 48px;
  //   background: $color-white;
  //   position: relative;
  //   z-index: 33;
  //   width: 863px;

  //   &__close {
  //     right: 20px;
  //     top: 20px;
  //     position: absolute;

  //     &:hover {
  //       cursor: pointer;
  //     }
  //   }

  //   &__title {
  //     text-align: center;
  //   }

  //   &__description {
  //     margin-top: 18px;
  //     text-align: center;
  //   }

  //   &__product-image {
  //     width: 100%;
  //     margin-bottom: 4px;
  //   }

  //   &__product-vendor {
  //     font-size: 16px;
  //     line-height: 24px;
  //     margin-bottom: 5px;
  //   }

  //   &__products {
  //     display: grid;
  //     grid-template-columns: 165px 165px;
  //     column-gap: 24px;

  //     @include desktop-up {
  //       grid-template-columns: 165px 165px 165px 165px;
  //       margin: 0 auto;
  //     }
  //   }
  // }

  .sesami__button {
    background-color: $color-black-900;
    color: $color-white;
    border: 2px solid $color-black-900;
    margin-top: 16px;

    @include desktop-up {
      margin-top: 24px;
    }

    &:hover {
      background-color: $color-primary-700;
      border: 2px solid $color-primary-700;
    }
  }
</style>

<!-- Popup addon
            //   - @change="addToCart(selectedVariantId)"
            //   - button(
            //   -   v-show="showOverlay"
            //   -   type="submit"
            //   -   value="Add to cart here"
            //   - )
            // - .overlay(
            // -   v-if="showOverlay"
            // - )
            // -   .popup
            // -     icon.popup__close(
            // -       name="close"
            // -       size="24"
            // -       @click="closePopup"
            // -     )
            // -     h3.h2.popup__title {{ popupHeader }}
            // -     p.body-md.popup__description {{ popupDescription }}
            // -     .popup__products
            // -       .popup__product(
            // -         v-for="addonProduct in addonProducts"
            // -         :key="addonProduct.selectedOrFirstAvailableVariant"
            // -       )
            // -         product-tile-booking(
            // -           :product="addonProduct"
            // -         ) -->


<!--
Computed:
addProducts() {
  let addonArray = [];
  const addon01 = {
    addonProductImage: this.schema.addonProductImage01,
    addonProductVendor: this.schema.addonProductVendor01,
    addonProductTitle: this.schema.addonProductTitle01,
    addonProductPrice: this.schema.addonProductPrice01,
    selectedOrFirstAvailableVariant: this.schema.selectedOrFirstAvailableVariant01,
  }
  const addon02 = {
    addonProductImage: this.schema.addonProductImage02,
    addonProductVendor: this.schema.addonProductVendor02,
    addonProductTitle: this.schema.addonProductTitle02,
    addonProductPrice: this.schema.addonProductPrice02,
    selectedOrFirstAvailableVariant: this.schema.selectedOrFirstAvailableVariant02,
  }
  const addon03 = {
    addonProductImage: this.schema.addonProductImage03,
    addonProductVendor: this.schema.addonProductVendor03,
    addonProductTitle: this.schema.addonProductTitle03,
    addonProductPrice: this.schema.addonProductPrice03,
    selectedOrFirstAvailableVariant: this.schema.selectedOrFirstAvailableVariant03,
  }
  const addon04 = {
    addonProductImage: this.schema.addonProductImage04,
    addonProductVendor: this.schema.addonProductVendor04,
    addonProductTitle: this.schema.addonProductTitle04,
    addonProductPrice: this.schema.addonProductPrice04,
    selectedOrFirstAvailableVariant: this.schema.selectedOrFirstAvailableVariant04,
  }
  addonArray.push(addon01)
  addonArray.push(addon02)
  addonArray.push(addon03)
  addonArray.push(addon04)
  return addonArray
}
