<template lang="pug">
  form.product-form(
    @submit.prevent="() => {}",
    @click="toReviews"
    method="post"
    action="/cart/add"
    accept-charset="UTF-8"
    enctype="multipart/form-data"
    novalidate="novalidate"
    data-product-form=""
  )
    .product-form__left
      product-promo-card.u-hidden-tablet-up(v-if="onSale && product.tags.map(lowercase).includes('deal of the week')")
        span(slot="heading")
          span.body-md.strong-bold Deal of the Week
        span.body-sm(slot="subheading") This is a one time purchase opportunity!
      .product-form__desktop-top
        product-form-top-mobile.product-form__top(v-bind="$props" :value="variant" :display-vendor="displayVendor")
      //- variant options
      .product-form__options-container
        .product-form__variant-option-set.option-set(
          v-if="filteredVariants.length"
          v-for="(option, optIndex) in product.options"
          v-show="option != 'Inventory Type'"
        )
          //- render variant options
          template
            p.option-set__top
              span.option-set__label.swatch-type-count {{ option }}:
              span.option-set__value.swatch-type-count  {{ selectedOptions[optIndex] }}
            //- 10 variants or less variants
            template(v-for="_variant of uniqBy(filteredVariants, `option${optIndex + 1}`)" v-if="(uniqBy(filteredVariants, `option${optIndex + 1}`)) && ((uniqBy(filteredVariants, `option${optIndex + 1}`)).length <= 10)")
              input.product-form__option-button-input(
                type="radio",
                tabindex="0"
                :name="option",
                :value="_variant[`option${optIndex + 1}`]",
                :checked="_variant[`option${optIndex + 1}`] === selectedOptions[optIndex]"
                @change="variantChange(optIndex, _variant[`option${optIndex + 1}`])"
                :id="`${option}-${_variant[`option${optIndex + 1}`]}`"
              )
              label.body-sm(
                tabindex="0"
                :class="availableOption(optIndex + 1, _variant[`option${optIndex + 1}`]) ? 'variant--available' : 'variant--unavailable'"
                :for="`${option}-${_variant[`option${optIndex + 1}`]}`"
                v-tooltip.top="getVTooltipConfig(_variant)"
              ) {{ _variant[`option${optIndex + 1}`] }}
            //- More than 10 variants
            select-input(
              :options="selectOptions(`option${optIndex + 1}`)"
              :value="selectedOptions[optIndex]"
              @input="selectOptionChange(optIndex, $event)"
              :data-option-index="`${optIndex + 1}`"
              v-if="(uniqBy(filteredVariants, `option${optIndex + 1}`)) && ((uniqBy(filteredVariants, `option${optIndex + 1}`)).length > 10)"
            )

      //- custom fields -- repeater
      //- .product-form__feature-icons(v-if="customFields.product_icon_set")
      //-   ul.product-form__icon-set(v-for="index in (customFields.product_icon_set || '').split(',')")
      //-    li.product-form__icon-set-wrap
      //-         img(v-if="iconSetCollection[index].image", :src="iconSetCollection[index].image", alt="value proposition", aria-role="presentation")
      //-         span.body-sm {{ iconSetCollection[index].firstLine || '' }}
      //-         span.body-sm {{ iconSetCollection[index].secondLine || '' }}
      .product-form__custom-fields(v-if="customFields.personalization_fields")
        .product-form__custom-field(v-for="index in (customFields.personalization_fields || '').split(',')")
          text-input(
            v-if="customizationFields[index].type === 'Text'"
            v-model="lineProps[`${customizationFields[index].label}`]"
            :label="customizationFields[index].label",
            :hide-label="true",
            :id="`${customizationFields[index].label}-${index}`",
            :placeholder="`${customizationFields[index].placeholder}`"
            :info="customizationFields[index].helpText"
            :maxlength="customizationFields[index].maxLength"
          )
            .input__info(slot="info") {{customizationFields[index].helpText}}
          text-area-input(
            v-if="customizationFields[index].type === 'Textarea'"
            v-model="lineProps[`${customizationFields[index].label}`]"
            :charLimit="parseInt(customizationFields[index].maxLength)"
            :label="customizationFields[index].label",
            :placeholder="`${customizationFields[index].placeholder}`"
            :id="`${customizationFields[index].label}-${index}`"
          )
            .input__info(slot="info") {{customizationFields[index].helpText}}
          select-input(
            v-if="customizationFields[index].type === 'Dropdown'"
            v-model="lineProps[`${customizationFields[index].label}`]"
            :label="customizationFields[index].label",
            :options="customizationFields[index].options"
            :id="`${customizationFields[index].label}-${index}`"
            :disableDefault="true"
          )

      .terms-checkbox(v-if="product.tags.includes('Order Type::Special Order Custom')")
        input.input--checkbox(
          id="special-order-terms-checkbox"
          @change="updateTermsCheckbox"
          type="checkbox")
        label(for="special-order-terms-checkbox") {{ customFields.special_order_product_terms || "I understand that my special order is a final sale and cannot be cancelled, returned or exchanged. I agree to pay full amount upon placing the order." }}

      //- Special Order Product 2 & 3 [Special Order, Final Sale]
      .terms-checkbox(v-if="product.tags.includes('Order Type::Special Order NonReturnable') || product.tags.includes('Order Type::Final Sale Item')")
        input.input--checkbox(
          id="so-terms-checkbox"
          @change="updateTermsCheckbox"
          type="checkbox")
        label(for="so-terms-checkbox") {{ customFields.special_order_product_terms || "This item is special order and custom made just for you! As it is a made to order item, we cannot accept cancelations, returns, or exchanges. By purchasing this item, you acknowledge that it is a final sale. We know you'll love it!" }}

      //- quantity + ATC (shared mobile and desktop)
      .product-form__mobile
        product-upsell-card.u-hidden-tablet-up(
          v-if="settings.upsellCardProduct.handle"
          :product="settings.upsellCardProduct"
          :heading="customFields.d2_upsell_heading"
          :description="customFields.d2_upsell_description"
          :callout="customFields.d2_upsell_alert_text"
        )
        .flex-row.space-between.align-center.nowrap(v-if="!is3rdPartyProduct(product) && !customFields.hide_atc && variant && variant.available" :class="{'product-form--logo-active': customFields.logo_badge, 'product-form__quantity--hidden': product.tags.includes('Order Type::Special Order NonReplenishable')}")
          .product-form__quantity-wrapper(v-if="!isCallForPrice(product)")
            quantity-selector.product-form__quantity(
              v-model="quantity"
              :isValidQuantity="(num) => num > 0 && num <= variant.remaining_quantity" @valid="(isValid) => validQuantity = isValid"
              :max="variant.remaining_quantity"
              :class="{'product-form__quantity--error': !validQuantity}"
              :forceValidQuantity="true"
              :autocomplete="'off'"
            )
          img.product-form__logo(v-if="customFields.logo_badge" :src="customFields.logo_badge" :aria-hidden="true")
        v-button.pdp__atc.product-form__atc.button--primary(v-if="isHiddenProduct(product) && !customFields.hide_atc" disabled :class="atcCtaClass") Add To Cart
        a.button.pdp__atc.product-form__atc.product-form__atc--full.button--primary(v-else-if="!isCallForPrice(product) && is3rdPartyProduct(product) && !customFields.hide_atc && variant && variant.available" :class="atcCtaClass" :href="customFields.third_party_atc_url" target="_blank")
          span.button__content {{ customFields.third_party_atc_text || "Add To Cart" }}

        async-button.pdp__atc.product-form__atc.button--primary(
          v-else-if="!isCallForPrice(product) && !customFields.hide_atc && variant && variant.available"
          :class="atcCtaClass"
          :disabled="atcDisabled"
          :promise="addToCartPromise"
          @click.stop="addToCart"
          :title="atcTitle"
          type="submit"
          name="add"
          data-add-to-cart
        ) {{ atcVerbiage }}
        a.button.pdp__atc.product-form__atc.product-form__atc--full.product-form__atc--cfp.button--primary(v-else-if="isCallForPrice(product) && !customFields.hide_atc && variant && variant.available" :href="callForPriceNumber.tel")
          span.button__content Call for Pricing: {{ callForPriceNumber.display }}

        swym-back-in-stock(v-if="showBackInStockWidget && !isCallForPrice(product)" v-bind="$props")

        p.product-form__errors(v-if="errors.length")
          strong Please correct the following error(s):
          ul.product-form__errors-list
            li(v-for="error in errors") {{ error }}

        //- img.product-form__logo(v-if="customFields.logo_badge" :src="customFields.logo_badge" :aria-hidden="true")

        //- v-button.pdp__atc.product-form__atc(v-if="isHiddenProduct(product) && !customFields.hide_atc" disabled :class="atcCtaClass") Add To Cart

        //- a.button.pdp__atc.product-form__atc.product-form__atc--full.button--full.button.button--primary(v-else-if="is3rdPartyProduct(product) && !customFields.hide_atc" :class="atcCtaClass" :href="customFields.third_party_atc_url" target="_blank")
        //-   span.button__content {{ customFields.third_party_atc_text || "Add To Cart" }}

        //- .pdp--flex-row.product-form__save-row(:class="{'border-top': !shareShowing, 'border-bottom': !shareShowing}")
        //-   span(v-show="!shareShowing")
        //-     button.product-form__registry(
        //-       v-if="settings.registryEnabled"
        //-       @click="openRegistry"
        //-     )
        //-       icon(name="giftcard", size="20px")
        //-       span.link-text Add to Registry
        //-     button.product-form__wishlist(@click="() => wishlist.toggle(variant.id)", v-if="settings.wishlistEnabled")
        //-       template(v-if="!wishlist.includes(variant.id)")
        //-         icon(name="heart_hollow", size="20px")
        //-         span.link-text() Add to Wishlist
        //-       template(v-else)
        //-         icon(name="heart_filled", size="20px")
        //-         span.link-text Saved
        //-   product-share(v-bind="$props", v-model="shareShowing")

        //- Opional Messaging
        //- .product-form__optional-messaging.client-generated.border-bottom(v-if="customFields.optional_message", v-html="customFields.optional_message")

        //- .product-form__feature-icons(v-if="customFields.product_icon_set")
        //-   ul.product-form__icon-set(v-for="index in (customFields.product_icon_set || '').split(',')")
        //-     li.product-form__icon-set-wrap
        //-       img(v-if="iconSetCollection[index].image", :src="iconSetCollection[index].image", alt="value proposition", aria-role="presentation")
        //-       span.body-sm {{ iconSetCollection[index].firstLine || '' }}
        //-       span.body-sm {{ iconSetCollection[index].secondLine || '' }}
</template>

<script>
  import { mapState } from 'vuex';

  // lodash commented out since it though an error and prevent the site from loading.
  import uniqBy from 'lodash/uniqBy';
  import uniq from 'lodash/uniq';
  import defaults from 'lodash/defaults';
  import { truncateEllipsis, getProductUrl, getProductSocialLinks, generateId, imageSize, imageCrop, isHiddenProduct, is3rdPartyProduct, isCallForPrice } from '../../../helpers/util';
  import { scrollToId } from '../../../helpers/scroll';
  import QuantitySelector from '../../basic/Quantity.vue';
  import TextInput from '../../forms/TextInput.vue';
  import TextAreaInput from '../../forms/TextAreaInput.vue';
  import SelectInput from '../../forms/SelectInput.vue';
  import AsyncButton from '../../buttons/AsyncButton.vue';
  import VButton from '../../buttons/VButton.vue';
  import ProductSwatchesStatic from './ProductSwatchesStatic.vue';
  import Icon from '../../basic/Icon.vue';
  import VLink from '../../buttons/VLink.vue';
  import ProductShare from '../../basic/ProductShare.vue';
  import ProductFormTopMobile from './ProductFormTopMobile.vue';
  import ProductUpsellCard from './ProductUpsellCard.vue';
  import ProductPromoCard from './ProductPromoCard.vue';
  import SwymBackInStock from '../SwymBackInStock.vue';
  // lodash commented out since it though an error and prevent the site from loading.
  import lowercase from 'lodash/lowerCase';
  import { SwymWishlist } from '../../../helpers/swym-wishlist';

  export default {
    name: 'ProductForm',
    components: {
      QuantitySelector,
      TextInput,
      TextAreaInput,
      SelectInput,
      AsyncButton,
      ProductSwatchesStatic,
      Icon,
      VLink,
      VButton,
      ProductShare,
      ProductFormTopMobile,
      ProductUpsellCard,
      ProductPromoCard,
      SwymBackInStock,
    },
    model: {
      prop: 'variant',
    },
    props: {
      collection: Object,
      product: Object,
      customFields: Object,
      settings: Object,
      variant: Object,
      prices: Object,
      atcCtaClass: String,
      displayVendor: Boolean,
      swym: Object,
      autocomplete: String,
    },
    data() {
      return {
        selectedOptions: [this.variant.option1, this.variant.option2, this.variant.option3],
        quantity: 1,
        addToCartPromise: null,
        reviewSource: window.bvaccel && window.bvaccel.reviewSource,
        validQuantity: true,
        termsCheckbox: false,
        lineProps: {},
        errors: [],
        callForPriceNumber: window.bvaccel && window.bvaccel.callForPriceNumber
      };
    },
    filters: {
      truncate: truncateEllipsis(237),
    },
    computed: {
      atcDisabled() {
        return (
          !this.variant ||
          !this.variant.available ||
          !this.validQuantity ||
          (this.product.tags.includes('Order Type::Special Order Custom') && !this.termsCheckbox) ||
          (this.product.tags.includes('Order Type::Special Order NonReturnable') && !this.termsCheckbox) ||
          (this.product.tags.includes('Order Type::Final Sale Item') && !this.termsCheckbox)
        );
      },
      showBackInStockWidget() {
        // special order product tags
        return !this.product.tags.includes('Order Type::Special Order NonReplenishable') && !this.product.tags.includes('Order Type::Special Order NonReturnable');
      },
      atcTitle() {
        return '';
      },
      skuText() {
        const { subtitlePretext, showSKU } = this.settings;
        return showSKU && this.variant ? `${subtitlePretext} ${this.variant.sku}` : '';
      },
      vendorText() {
        return this.variant && this.variant.cf_vendor ? this.variant.cf_vendor : this.customFields.product_vendor;
      },
      iconSetCollection(index) {
        if (!this.customFields.product_icon_set) return [];
        const images = (this.customFields.icon_image || '').split('|###|');
        const firstLines = (this.customFields.first_line_of_text || '').split('|###|');
        const secondLines = (this.customFields.second_line_of_text || '').split('|###|');

        return this.customFields.product_icon_set.split(',').map((index) => ({
          image: images[index],
          firstLine: firstLines[index],
          secondLine: secondLines[index],
        }));
      },
      customizationFields(index) {
        if (!(this.customFields.personalization_fields && this.customFields.personalization_fields.split(',').length)) return [];

        const helpTexts = (this.customFields.personalization_help_text || '').split('|###|');
        const labels = (this.customFields.personalization_label || '').split('|###|');
        const maxLengths = (this.customFields.personalization_max_length || '').split('|###|');
        const options = (this.customFields.personalization_options || '').split('|###|');
        const placeholders = (this.customFields.personalization_placeholder || '').split('|###|');
        const requiredFlags = (this.customFields.personalization_required || '').split('|###|');
        const types = (this.customFields.personalization_type || '').split('|###|');

        for (let i = 0; i < labels.length; i++) {
          this.lineProps[`${labels[i]}`] = '';
        }

        return this.customFields.personalization_fields.split(',').map((index) => ({
          helpText: helpTexts[index],
          label: labels[index],
          maxLength: maxLengths[index],
          options: options[index]
            ? options[index].split(',').map((opt) => {
                return { label: opt, value: opt };
              })
            : [],
          placeholder: placeholders[index],
          required: requiredFlags[index],
          type: types[index],
        }));
      },
      /** @returns {Boolean} */
      hasColorVariants() {
        return this.product.options.some((opt) => /color|pattern|design/i.test(opt));
      },
      /** @returns {Number} */
      colorIndex() {
        if (!this.hasColorVariants) return 0;

        return this.product.options.reduce((acc, opt, i) => (/color|pattern|design/i.test(opt) ? i : acc), 0);
      },
      /** @returns {Array<Object>} */
      filteredVariants() {
        return this.product.variants.filter((v) => v.title.toLowerCase() !== 'default title');
      },
      /** @returns {Object} {swatchType: [variants with that swatch type]} */
      filteredColorVariants() {
        if (!this.hasColorVariants) return [];

        const uniqueColorVariants = uniqBy(this.product.variants, `option${this.colorIndex + 1}`);
        const swatchTypeDefault = this.product.options[this.colorIndex];
        const separatedBySwatchType = uniqueColorVariants.reduce((acc, cur) => {
          const swatchType = cur.swatch_type || swatchTypeDefault;
          acc[swatchType] = acc[swatchType] instanceof Array ? [...acc[swatchType], cur] : [cur];
          return acc;
        }, {});

        return separatedBySwatchType;
      },
      shareLinks() {
        return getProductSocialLinks(window.bvaccel.shop.domain, this.collection, this.product, this.variant);
      },
      atcVerbiage() {
        if (!this.variant) {
          return 'Unavailable';
        } else if (!this.variant.available) {
          return 'Out of Stock';
        } else if (!this.validQuantity) {
          return 'Enter Quantity';
        }

        return 'Add to Bag';
      },
      upsellData() {
        const cf = this.customFields;
        const { settings } = this;

        return defaults(
          {
            img: cf.upsell_image,
            heading: cf.upsell_heading,
            copy: cf.upsell_copy,
            cta_copy: cf.upsell_cta_copy,
            cta_url: cf.upsell_cta_url,
          },
          {
            img: settings.upsellImg,
            heading: settings.upsellHeading,
            copy: settings.upsellCopy,
            cta_copy: settings.upsellCtaCopy,
            cta_url: settings.upsellCtaUrl,
          },
        );
      },
      onSale() {
        return this.variant && this.variant.price < this.variant.compare_at_price;
      },
    },
    methods: {
      imageSize,
      imageCrop,
      uniqBy,
      lowercase,
      isHiddenProduct,
      is3rdPartyProduct,
      isCallForPrice,
      availableOption(optIndex, value) {
        const variantAvailability = this.filteredVariants.find((variant) => {
          if (optIndex === 1) {
            return value === variant['option1'] && variant['option2'] === this.selectedOptions[1] && variant['option3'] === this.selectedOptions[2];
          } else if (optIndex == 2) {
            return value === variant['option2'] && variant['option1'] === this.selectedOptions[0] && variant['option3'] === this.selectedOptions[2];
          } else if (optIndex == 3) {
            return value === variant['option3'] && variant['option1'] === this.selectedOptions[0] && variant['option2'] === this.selectedOptions[1];
          }
        });

        if (variantAvailability) {
          return variantAvailability.available;
        }
        return false;
      },
      openRegistry() {
        const target = document.querySelector('.myregistry');
        if (window.currentMrWidgetObj && target) target.click();
      },
      selectOptions(optKey) {
        const uniqueOptions = uniqBy(this.filteredVariants, optKey);
        return uniqueOptions.map((item) => {
          return { value: item[optKey], label: item[optKey] };
        });
      },
      updateTermsCheckbox(e) {
        const ele = e.target;
        this.termsCheckbox = ele.checked;
      },
      /**
       * Get a v-tooltip configuration object
       * @param {Object} variant
       * @returns {Object}
       * */
      getVTooltipConfig(variant) {
        return {
          position: 'top',
          content: variant.d2_variant_hover_text,
          trigger: this.$mq === 'mobile' ? 'manual' : 'hover', // don't show the tooltip on mobile (iOS extra click)
          classes: this.$mq === 'mobile' ? 'u-hidden' : '',
        };
      },
      /** @desc scroll to reviews section when reviews badge is clicked */
      toReviews(e) {
        if (e.target.matches('.spr-badge, .spr-badge *')) {
          scrollToId(e, '#pdp-reviews');
        }
      },
      validateCustomizationFields() {
        this.errors = [];
        if (this.customizationFields.length === 0) return true;
        for (let i = 0; i < this.customizationFields.length; i++) {
          if (this.customizationFields[i].required === '1' && this.lineProps[this.customizationFields[i].label].length === 0) {
            this.errors.push(`${this.customizationFields[i].label} is required.`);
          }
        }
      },
      addToCart() {
        this.validateCustomizationFields();
        if (this.errors.length) return false;

        let items = [];
        const _kitId = generateId();

        if (this.selectedMagnetVariant) {
          items = [
            { id: this.variant.id, quantity: this.quantity },
            { id: this.selectedMagnetVariant.id, quantity: this.quantity },
          ].map((obj) => Object.assign(obj, { properties: { _kitId } }));
        } else {
          items.push({
            id: this.variant.id,
            quantity: this.quantity,
            properties: this.lineProps,
          });
        }

        this.addToCartPromise = this.$store
          .dispatch('cart/addItems', items)
          .then(() => window.setTimeout(() => this.$store.dispatch('cart/afterAddToCart'), 1000))
          .catch((error) => this.$store.dispatch('toast/send', { text: error, type: 'error' }));
        return this.addToCartPromise;
      },
      scrollTo(...args) {
        scrollToId(...args);

        if (!window.bvaccel.toggleProductDetailsaccordion.active) window.bvaccel.toggleProductDetailsaccordion();
      },
      colorChange(variant) {
        this.variantChange(this.colorIndex, variant[`option${this.colorIndex + 1}`]);
      },
      variantChange(optionIndex, optionValue) {
        this.$set(this.selectedOptions, optionIndex, optionValue);
        const [newVariant] = this.product.variants
          .filter((v) => v.option1 === this.selectedOptions[0])
          .filter((v) => v.option2 === this.selectedOptions[1])
          .filter((v) => v.option3 === this.selectedOptions[2]);

        this.$emit('input', newVariant);
      },
      selectOptionChange(optionIndex, optionValue) {
        this.variantChange(optionIndex, optionValue);
      },
    },
    watch: {
      variant(newValue, oldValue) {
        if (!newValue || !oldValue) return;

        if (newValue.id !== oldValue.id) {
          window.history.replaceState({ vid: newValue.id }, document.title, getProductUrl(this.collection, this.product, newValue));
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .terms-checkbox {
    background: #eee;
    margin-bottom: 10px;
    display: flex;
    padding: 12px;
    input[type='checkbox'] + label {
      flex: 1;
      line-height: 120%;
    }
  }
  .product-form {
    .product-form__variant-option-set {
      .variant--unavailable {
        color: $color-black-700;
        border-color: $color-black-700;
        position: relative;
        &::after {
          position: absolute;
          left: 0;
          bottom: 0;
          content: '';
          width: 100%;
          height: 100%;
          background: linear-gradient(to top left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) calc(50% - 0.8px), $color-black-700 50%, rgba(0, 0, 0, 0) calc(50% + 0.8px), rgba(0, 0, 0, 0) 100%);
        }
      }

      input:not(:checked) + .variant--unavailable {
        color: $color-black-300;
        border-color: $color-black-300;
        &::after {
          background: linear-gradient(to top left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) calc(50% - 0.8px), $color-black-300 50%, rgba(0, 0, 0, 0) calc(50% + 0.8px), rgba(0, 0, 0, 0) 100%);
        }
      }
    }

    &__options-container {
      margin-bottom: 16px;
    }
    &__errors {
      margin-top: 10px;
      color: $color-accent-1-700;
      &-list {
        list-style: disc;
      }
    }

    &__custom-field {
      margin-bottom: 1rem;
    }

    &__vendor {
      font-weight: 500;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    &__logo {
      height: 28px;
      width: auto;
    }

    &--logo-active {
      @include mobile-only {
        .product-form__quantity-wrapper {
          width: 115px;
          order: 1;
        }
      }
    }

    &__desktop-top &__price-container,
    &__desktop-top .pdp__sku {
      margin-bottom: 16px;
    }

    &__scroll-more-arrow {
      fill: $color-brand-primary;
      transform: rotate(-90deg);
      position: absolute;
      right: -14px;
      bottom: 36px;
    }

    .pdp__sku,
    .pdp__stock {
      display: inline-block;
    }

    &__desktop-top &__price-container {
      display: flex;
      align-items: center;
    }

    &__desktop-top &__description {
      margin-bottom: 24px;
    }

    &__to-description {
      display: inline-block;
      font-weight: 400;
      line-height: 22px;
      vertical-align: bottom;
    }

    &__includes {
      display: block;
      margin-top: 8px;
      line-height: 22px;

      * {
        font-size: rem(12);
      }

      strong {
        font-weight: 500;
        color: $color-black-900;
      }

      span {
        color: $color-black-900;
      }
    }

    &__quantity-atc-wrapper {
      display: flex;
    }

    &__quantity-wrapper {
      display: inline-flex;
      align-items: center;
      width: 115px;
    }

    &__atc-wrapper {
      background-color: blue;
      margin-left: 16px;
      width: 100%;
    }

    /deep/ &__quantity {
      height: 45px;
      border: 1px solid $color-black-300;
      border-radius: 2px;
      background: $color-white;
      align-items: center;
      transition: border 300ms ease-in-out;

      .quantity__label {
        font-family: $font-family-secondary;
        font-weight: 600;
        width: 32px;

        @include desktop-up {
          width: 36px;
        }
      }

      .quantity__change {
        margin: 0 4px;

        &:not(:hover) {
          box-shadow: none;
        }
      }
      &--hidden {
        display: none !important;
        & + .product-form__atc {
          margin-left: 0;
        }
      }
    }

    /deep/ &__quantity--error {
      border: 1px solid $color-util-error !important;
    }

    &__optional-messaging {
      padding: 8px 0;
      color: $color-accent-3-200;

      /deep/ * {
        color: inherit;
      }

      /deep/ p {
        margin: 0 !important;
      }
    }

    &__atc.button:not(.button--state-loading):disabled,
    &__atc.button:not(.button--state-error):disabled,
    &__atc.button:not(.button--state-success):disabled {
      background: #abacaf;
      border-color: #abacaf;
      flex: 1;

      /deep/ .button__content {
        color: $color-white;
      }
    }

    &__feature-icons {
      padding: 12px 0;
    }

    &__icon-set {
      padding: 0;
      margin: 0;
    }

    &__icon-set + &__icon-set {
      margin-top: 8px;
    }

    &__icon-set img {
      width: 20px;
      margin: 0 8px 0 0;
      display: inline-block;
      vertical-align: middle;
    }

    &__icon-set span {
      vertical-align: middle;
    }

    .swatches-static {
      margin-bottom: 0;
    }

    .swatches-static:last-child {
      margin-bottom: -8px;

      @include tablet-up {
        margin-bottom: -14px;
      }
    }

    .pdp--flex-row.product-form__share-desktop {
      display: none;
    }

    .pdp--flex-row.product-form__share-mobile {
      display: flex;
    }

    &__share-mobile > * {
      max-width: 50%;
    }

    &__share-desktop span {
      font-size: rem(12);
      letter-spacing: 0.75px;
      text-transform: uppercase;
      font-weight: 500;
      align-items: center;
    }

    &__share-mobile span {
      font-size: rem(12);
      letter-spacing: 0.75px;
      text-transform: uppercase;
      font-weight: 400;
      align-items: center;
    }

    &__share-desktop *,
    &__share-mobile * {
      vertical-align: middle;
    }

    &__share-desktop:first-child,
    &__share-mobile:first-child {
      margin-right: 8px;
    }

    .spr-starrating {
      padding: 0;
    }

    &__sku-mobile.pdp__sku {
      margin: 0;
    }

    &__atc {
      height: 44px;
      width: 100%;
      margin-left: 8px;
      flex: 1;

      &--cfp {
        margin-left: 0;
      }
    }

    &__description-mobile {
      padding-top: 16px;
      border-top: 1px solid $color-grey;
    }

    &__save-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      position: relative;

      button {
        padding: 16px 0;
      }

      button,
      button * {
        color: $color-brand-primary;
        fill: $color-brand-primary;
      }

      button .icon {
        margin-right: 8px;
        vertical-align: middle;
      }

      button + button {
        margin-left: 16px;
      }
    }
  }

  .option-set {
    position: relative;
    font-size: 0;
    padding: 0;

    &__top {
      margin: 0 0 4px;
    }

    label {
      border: 1px solid $color-black-300;
      font-weight: 400;
      padding: 9px 0px;
      border-radius: 2px;
      text-align: center;
      transition: all 100ms ease;
      color: $color-black-900;
      margin-right: 8px;
      margin-bottom: 8px;
      min-width: 65px;
      font-family: 600;
      font-weight: 600;

      @include desktop-up {
        height: 41px;
      }
    }

    label:not(:last-child):nth-child(3n - 2),
    label:not(:last-child):nth-child(3n) {
      // first
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    label:not(:last-child):nth-child(3n - 1) {
      // middle
      border-radius: 0;
    }

    label:nth-child(3n - 1), // last
    label:nth-child(3n + 1) {
      // last
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    input:not(:disabled) + label {
      cursor: pointer;
      font-family: 600
    }

    &__value {
      color: $form-color-grey;
    }

    input {
      appearance: none;
      display: none;
    }

    input:not(:disabled) + label:hover,
    input:not(:disabled) + label:focus {
      background: $color-white;
      outline: none !important;
      border-color: $color-black-900;
    }

    input:checked + label {
      background: $color-white !important;
      border-color: $color-primary-500;
    }

    input:disabled + label {
      background-color: $color-white;
      color: $color-black-300 !important;
      border-color: $color-black-300;
      position: relative;

      &:focus {
        outline-width: 0;
      }
      &::after {
        left: 0px;
        bottom: 1px;
        content: '';
        width: 75px;
        height: 0px;
        border-bottom: 1px solid #E8E4DA;
        -webkit-transform: translateY(-18px) translateX(-6px) rotate(-32deg);
        position: absolute;
      }
    }

    input:checked + label:hover {
      cursor: default;
      background: $color-primary-200;
      border-color: $color-black-500;
    }
  }

  @include tablet-up {
    .product-form {
      font-size: 0;
      vertical-align: top;
      width: 50%;
      left: 0;
      float: right; // so the accordions can be directly under the image gallery in ~tablet widths

      &__atc {
        font-size: rem(20);
        letter-spacing: 2px;
        line-height: 20px;
        max-width: 299px;
      }

      &__top {
        display: block !important;
      }

      &__max-width-container {
        max-width: 440px;
      }

      &__desktop-top &__price-container {
        display: flex;
        align-items: center;
        justify-items: flex-start;
      }

      &__price {
        margin-right: 16px;
      }

      .swatches-static {
        margin-bottom: 10px;
      }

      .swatches-static:last-child {
        margin-bottom: 0;
      }

      &__price-compare {
        margin-right: 7%; // 40px @ containers max-width
        color: $color-compare-price;
      }

      .pdp__sku,
      .pdp__stock {
        margin-bottom: 16px;
      }

      /deep/ &__quantity-wrapper label {
        position: static;
        display: inline-block;
        transform: none;
      }

      &__description-mobile {
        display: none;
      }

      &__mobile {
        padding-left: 0 !important;
        padding-right: 0 !important;
        position: relative;
        top: 1px;
      }

      &__price-compare,
      &__price {
        display: inline-block;
        position: relative;
      }
    }
  }

  @include desktop-up {
    .product-form {
      width: 472px;
    }
  }

  .product-form__mobile {
    display: flex;
    flex-wrap: wrap;
    @include mobile-only {
      margin-bottom: 12px;
    }
  }

  .byk-callout {
    padding-top: 16px;
    border-top: 1px solid $color-grey;

    &__heading {
      text-align: center;
      font-family: $font-family-primary;
      text-transform: inherit;
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 16px;
    }

    &__main {
      padding: 8px;
      border: 1px solid $color-black-100;
      font-size: 0;
      width: 100%;
      border-radius: 4px;
    }

    &__main > * {
      display: inline-block;
      vertical-align: top;
    }

    &__main img {
      width: 88px;
      margin-right: 16px;
    }

    &__main div {
      width: calc(100% - 88px - 16px);
    }

    &__main p {
      margin-bottom: 8px;
      line-height: 20px;
    }

    @include desktop-up {
      border-top: none;
      padding-top: 8px;

      &__heading {
        font-size: 18px;
        line-height: 22px;
        text-align: left;
      }

      &__main img {
        width: 112px;
        margin-right: 24px;
      }

      &__main p {
        line-height: 22px;
        font-size: rem(16);
        max-width: 95%;
      }

      &__main div {
        width: calc(100% - 112px - 24px);
      }
    }
  }
  .swatch-type-count {
    font-size: rem(12);
    color: $color-black-900;
    line-height: 14px;
  }
</style>
