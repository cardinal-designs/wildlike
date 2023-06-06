<template lang="pug">
  split-wrapper.product-ts
    div.product-ts__image-container(slot="image")
      img.product-ts__image(v-if="customFields['5050_image']", :src="imageCrop(imageSize(customFields['5050_image'], '640x480'), 'center')" :alt="customFields['5050_header']")
    article.product-ts__main(slot="content")
      .product-ts__main-wrap
        h2.h3.product-ts__header {{ customFields['5050_header'] }}
        div.product-ts__text-copy.client-generated(v-html="customFields['5050_body_copy']")
        table.product-ts__table(v-if="customFields['5050_show_table']")
          tr.product-ts__table-row(v-for="(item, index) in splitTableHeading")
            td.product-ts__table-heading.h7 {{ item }} 
            td.product-ts__table-data.body-sm {{ splitTableData[index] }}
        div.product-ts__links
          v-link.product-ts__text-link(secondary v-if="customFields['5050_link_url'] && customFields['5050_link_text']" :href="customFields['5050_link_url']") {{ customFields['5050_link_text'] }}
</template>

<script>
import VLink from 'scripts/components/buttons/VLink.vue'
import { imageSize, imageCrop } from '../../../helpers/util';
import SplitWrapper from '../../basic/SplitWrapper.vue';

export default {
  name: "ProductTechSpecs",
  components: {
    VLink,
    SplitWrapper
  },
  props: {
    customFields: {
      type: Object,
      default: {}
    }
  },
  methods: {
    imageSize,
    imageCrop,
  },
  computed : {
    splitTableHeading() {
      return this.customFields['tech_details_category'].split('|###|');
    },
    splitTableData() {
      return this.customFields['tech_specification'].split('|###|');
    }
  }
}
</script>

<style lang="scss" scoped>
  .product-ts {
    padding-top: 0;
    padding-bottom: 0;
    min-height: initial !important;
    
    /deep/ .sw__image {
      height: auto;
    }

    /deep/ .sw__main-wrap {
      width: 100%;
    }


    @include tablet-up {
      /deep/ .sw__main {
        padding-top: 0;
        padding-bottom: 0;
        padding-right: 1%;
      }
    }

    &__text-link {
      margin-right: 16px;
    }

    &__text-copy {
      margin-bottom: 16px;
      @include tablet-up {
        margin-bottom: 24px;
      }
    }
    
    &__header {
      margin-bottom: 24px;
      @include mobile-only {
        margin-bottom: 16px;
        padding-top: 8px;
      }
    }
    &__image {
      width: 100%;
      max-height:480px;
    }
    &__table {
      border-top: 1px solid #E1E1E1;
      margin-bottom: 24px;
      width: 100%;
      border-collapse: collapse;
      @include mobile-only {
        margin-bottom: 16px;
      }
    }
    &__table-row {
      border-bottom: 1px solid #E1E1E1;
      width: 100%;
    }
    &__table-heading,
    &__table-data {
      width: 50%;
    }
    &__table-data {
      text-align: left;
      padding-bottom: 16px;
      padding-top: 16px;
      @include mobile-only {
        text-align: right;
      }
    }
    &__image-container {
      margin: 0 auto;
      max-width: 640px;
      @include tablet-up {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    @include mobile-only {
      &__links {
        text-align: center;
      }
    }
  }
</style>