<template lang="pug">
  div.quantity-select(id="Quantity")
    label.button-text(for="quantity-selector")
    select-input#quantity-selector(
      :required="true"
      :options="options" 
      :value="value"
      @input="$emit('input', $event)"
      :disableDefault="true"
    )
</template>

<script>
import Icon from 'scripts/components/basic/Icon.vue'
import SelectInput from 'scripts/components/forms/SelectInput.vue';
import range from 'lodash/range';

export default {
  name: 'QuantitySelect',
  components: { 
    Icon,
    SelectInput
  },
  props: {
    value: Number,
    autocomplete: String
  },
  data () {
    return {
      options: range(1, 11).map(qty => ({label: qty, value: qty}))
    }
  }
}
</script>

<style lang="scss" scoped>
  .quantity-select {
    position: relative;

    /deep/ .input.input--select {
      margin-bottom: 0;
    }

    /deep/ select {
      padding-left: calc(50% - 5px);
    }

    /deep/ .input--number {
      margin: 0;

      input {
        margin: 0;
      }
    }

    label {
      position: absolute;
      top: 50%;
      left: 16px;
      transform: translateY(-50%);
      font-size: rem(14);
    }
  }
</style>