<template lang="pug">
  accordion-group.product-details(
    ref="accordion-group"
  )
    accordion(
      heading="Product Details"
      v-if="product.description"
      id="product-details-accordion"
      :selected="true"
      :auto-close="false"
      theme="footer-bourdain")
      span.h6.product-details__heading(slot="heading") Product Details
      accordion-tease(:on-tease-expand="onTeaseExpand" :collapsed-height="314")
        .client-generated.scrolling-text__content(v-html="product.description")
    accordion(
      heading="Designer details"
      v-if="jsonDesignerCollection"
      ref="designer-details-accordion"
      id="product-details-accordion"
      :selected="false"
      :auto-close="false"
      theme="footer-bourdain")
      span.h6.product-details__heading(slot="heading") Designer details
      accordion-tease(:on-tease-expand="onTeaseExpand" :collapsed-height="314")
        .client-generated.scrolling-text__content(v-html="jsonDesignerCollection.description")
    accordion(
      :heading="settings.accordionName"
      theme="footer-bourdain"
      :auto-close="false"
      v-if="settings.accordionContent"
    )
      span.h6.product-details__heading(slot="heading") {{ settings.accordionName }}
      accordion-tease(:on-tease-expand="onTeaseExpand" :collapsed-height="314")
        .client-generated.scrolling-text__content(v-html="settings.accordionContent")

    .flex.align-center.product-details__download(v-if="customFields.d2_download_link_url && customFields.d2_download_link_text")
      icon(name="save_alt", size="16px")
      v-link(primary, :href="customFields.d2_download_link_url", download)
        span {{ customFields.d2_download_link_text }}
</template>

<script>
import AccordionGroup from '../../basic/AccordionGroup.vue';
import Accordion from '../../basic/Accordion.vue';
import AccordionTease from '../../basic/AccordionTease.vue';
import Icon from '../../basic/Icon.vue';
import VLink from '../../buttons/VLink.vue';

export default {
  name: 'ProductDetails',
  components: {
    AccordionGroup,
    Accordion,
    VLink,
    AccordionTease,
    Icon
  },
  props: {
    jsonDesignerCollection: Object,
    collection: Object,
    product: Object,
    customFields: Object,
    settings: Object
  },
  // mounted() {
  //   // expose methood for product form to open product details accordion
  //   window.bvaccel.productDetailsaccordion = this.$refs['product-details-accordion'];
  //   window.bvaccel.toggleProductDetailsaccordion = this.$refs['accordion-group'].activate.bind(this.$refs['accordion-group'], this.$refs['product-details-accordion']);
  // },
  computed : {
    splitTableCategory() {
      return this.customFields['details_category'] ? this.customFields['details_category'].split('|###|') : [];
    },
    splitTableSpecification() {
      return this.customFields['specification'] ? this.customFields['specification'].split('|###|') : [];
    }
  },
  methods: {
    onTeaseExpand() {
      // tell the active accordions to update their height
      this.$refs['accordion-group'].accordions.filter(a => a.active)
        .forEach(a => a.setContentHeight())
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-details {
    @include desktop-up {
      padding-bottom: 47px; // to match the bottom border of value props
      margin-top: 42px;
    }

    &__heading {
      font-size: rem(20);
    }

    &__optional-body-copy{
      margin-bottom: $grid-gutter;
    }

    &__table {
      border-collapse: collapse;
      margin: $grid-gutter 0;
    }

    &__table-row {
      width: 100%;
      border-top: 1px solid $color-black-300;

      &:last-child {
        border-bottom: 1px solid $color-black-300;
      }

      &:nth-child(odd) {
        background-color: red;
      }
    }

    &__table-category,
    &__table-specification {
      padding: 16px 8px;
    }

    &__download {
      margin-top: 20px;


      .link {
        line-height: inherit;
      }

      svg {
        margin-right: 8px;
        display: inline-block;
      }

      &:hover svg {
        fill: $color-brand-primary;
      }
    }

    /deep/ .accordion {
      border-bottom: 1px solid $color-black-300;
      border-top: 1px solid $color-black-300;

      + .accordion {
        border-top: none !important;
      }

      .accordion__content {
        padding: 0px 0px 14px;
      }

      .accordion__header {
      padding: 12px 8px;
      transition: background-color .2s linear;

      @include tablet-up {
        padding: 12px 0px;

        &:not(.is-open):hover {
          background: $color-white;
        }
      }
    }
    }

    /deep/ .accordion.is-open  {
      border-bottom: 1px solid $color-black-300;
      border-top: 1px solid $color-black-300;

      .accordion__header,
      .accordion__content {
        background: $color-white;
      }
    }
  }
  .accordion__content div,
  .accordion__content p,
  .accordion__content li {
    font-size: rem(16) !important;
    line-height: 24px;
    font-family: $font-family-secondary;
    margin-bottom: 16px;
    font-weight: 600;
  }
</style>
