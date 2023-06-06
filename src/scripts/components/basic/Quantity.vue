<template lang="pug">
  div.quantity(id="Quantity")
    button.quantity__change.quantity__change-minus(label="Decrement Count", @click="decrement", :disabled="value === 1" aria-label="Decrease count")
      icon(class="fill-black" name="minus" size="14px")
    input.quantity__label.text-center(type="number", name="quantity", :value="value", @change="change" @input="input" aria-labelledby="Quantity" :autocomplete="autocomplete")
    button.quantity__change.quantity__change-plus(label="Increment Count", @click="increment" aria-label="Increase count")
      icon(class="fill-black"  name="plus" size="14px")
</template>

<script>
import Icon from 'scripts/components/basic/Icon.vue'

export default {
  name: 'Quantity',
  components: { Icon },
  props: {
    value: Number,
    autocomplete: String,
    max: {
      type: Number,
      default: 99,
    },
    isValidQuantity: {
      type: Function,
      default: (num) =>  parseInt(num) <= this.max
    },
    forceValidQuantity: {
      type: Boolean,
      default: true,
    }
  },
  methods: {
    change(e) {
      const num = parseInt(e.target.value);
      if(!isNaN(num) && num !== this.value && this.isValidQuantity(num)) {
        this.$emit('input', num);
        this.$emit('valid', true);
      } else if(this.forceValidQuantity){
        e.target.value = '';
        e.target.value = this.value
        this.$emit('valid', true);
      } else {
        this.$emit('input', e.target.value);
        this.$emit('valid', false);
      }
    },
    input(e) {
      const num = parseInt(e.target.value);
      if(isNaN(num) || !this.isValidQuantity(num)) {
        this.$emit('valid', false);
      } else {
        e.target.value = '';
        e.target.value = num;
        this.$emit('valid', true);
      }
    },
    decrement() {
      const num = parseInt(this.value);
      if(!isNaN(num) && num > 1) this.$emit('input', num - 1);
    },
    increment() {
      const num = parseInt(this.value);
      if(!isNaN(num) && num <= this.max - 1 && num >= 1) this.$emit('input', num + 1);
    }
  }
}
</script>

<style lang="scss" scoped>
  .quantity {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: nowrap;
    border: none;
    padding: 0;
    margin: 0;

    &__label {
      width: 27px;
      font-size: rem(15);
      line-height: 28px;
      color: $color-black-900;
      text-align: center;
      margin: 0;
      border: none;
      outline: none;
      appearance: textfield;
      -moz-appearance:textfield;

      &::-webkit-inner-spin-button {
        display: none;
        appearance: none;
        -webkit-appearance: none;
      }

      &:focus {
        outline: none;
      }
    }

    &__change {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 100%;

      &-plus {
        &:hover {
          background-color: $color-primary-200;
        }
      }

      &-minus {
        &:hover {
          background-color: $color-primary-200;
        }
      }

      &[disabled] {
        background-color: transparent;
      }
    }

    &__change {
      z-index: 2;
    }
  }
</style>
