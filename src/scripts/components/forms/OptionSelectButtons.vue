
<template lang="pug">
  fieldset.option-select.option-select--buttons
    legend.option-select__legend(v-if="label")
      span.option-select__legend--title {{ label }}
      span.option-select__legend--selection(v-if="label === 'Color'") {{ value }}
      a.option-select__legend--size-guide-link(v-if="label === 'Size'" href="#" title="Open Size Guide") Size Guide 

    label.option-select__label(v-for="option in optionSet" tabindex="0" :class="{ 'is-selected': option.value === value }") {{ option.label }}
      input.u-sr-only(
        type="radio"
        tabindex="-1"
        v-model="currentValue"
        :id="option.label"
        :value="value"
        :disabled="option.disabled"
        :name="option"
        @change.prevent="onChange(option.value)"
      )
</template>

<script>
  import TextInput from 'scripts/components/forms/TextInput.vue'

  export default {
    name: 'ProductOption',
    props: {
      product: Object,
      label: String,
      value: String,
      option: {
        type: String,
        default: 'option1',  
        validator (val) {
          return ['option1', 'option2', 'option3'].includes(val)
        }
      }
    },
    data () {
      return {
        currentValue: this.value
      }
    },
    mounted () {
      let initialValue = this.value && this.value !== '' ? this.value : this.optionSet[0].value
      this.$emit('input', initialValue)
    },
    computed: {
      optionSet () {
        return [...new Set(this.product.variants.slice().map(variant => variant[this.option]))]
          .map(option => ({ label: option, value: option }))
      }
    },
    methods: {
      onChange (value) {
        this.$emit('input', value)
      }
    }
  }
</script>

<style scoped lang="scss">
  .option-select {
    border: none;
    padding: 0;

    &__legend {
      margin-bottom: 10px;

      &--title {
        font-size: rem(14); 
        font-weight: 500;
        line-height: 18px;
        margin-right: 8px;
      }

      &--selection {
        font-family: $font-family-secondary; 
        font-size: rem(11); 
        font-style: italic;
        line-height: 14px;
      }

      &--size-guide-link {
        font-size: rem(12);
        line-height: 16px;
        text-decoration: underline;
      }
    }

    &__label {
      display: inline-block;
      padding: 11px 10px 9px 10px;
      min-width: 56px; 
      border: 1px solid transparent; 
      background-color: $color-brand-primary;
      cursor: pointer;
      font-size: rem(13); 
      font-weight: 500;
      line-height: 22px; 
      text-align: center;
      text-transform: uppercase;
      transition: 0.3s ease-in-out;

      &.is-selected {
        border-color: $color-black-900;
        background-color: $color-white;
      }

      &:hover {
        background-color: $color-white;
      }

      &:not(last-child) {
        margin-right: 10px;

        @include tablet-up {
          margin-right: 12px;
        }
      }
    }
  }
</style>
