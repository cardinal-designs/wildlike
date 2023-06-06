<template lang="pug">
  a.upscard.color-black(:href="product.url" @mouseover="hovered = true" @mouseleave="hovered = false")
    .flex-row.space-between.align-start
      h3.strong-medium.body-md.upscard__title {{ heading || `Complete this Set: ${product.title}` }}
      span
        span.upscard__price.strong-medium.body-md(
          :class="{[$store.state.comparePriceColor]: product.price < product.compare_at_price }"
        ) {{ product.price | moneyWithoutDecimals }}
        s.body-md.color-grey(v-if="product.compare_at_price > product.price") {{ product.compare_at_price | moneyWithoutDecimals }}
    p.body-sm(v-html="truncate100(stripHtml(description || product.description))") 
    .flex-row.space-between.align-center
      span.body-md.strong-bold(
        :class="$store.state.comparePriceColor" 
      ) {{ callout || 'Special Value!'}}
      v-arrow-button(:primary="true" :class="{'button--hover': hovered}")
        icon(name="arrow-right", size="16px")
</template>

<script>
import Icon from '../../basic/Icon.vue';
import VArrowButton from 'scripts/components/buttons/VArrowButton.vue';
import { stripHtml, truncateEllipsis } from '../../../helpers/util';

export default {
  name: 'ProductUpsellCard',
  data() {
    return {
      hovered: false,
    }
  },
  props: {
    product: Object,
    heading: String,
    description: String,
    callout: String,
  },
  components: {
    Icon,
    VArrowButton
  },
  methods: {
    truncate100: truncateEllipsis(100),
    stripHtml,
  }
}
</script>

<style scoped lang="scss">
  .upscard {
    display: block;
    border: 1px solid $color-brand-primary;
    padding: 12px;
    box-shadow: $drop-shadow;
    border-radius: 2px;

    > * + * {
      margin-top: 4px;
    }

    &__price {
      margin-right: 4px;
    }

    &__title {
      max-width: 65%;
      font-family: $font-family-primary;
    }
  }
</style>