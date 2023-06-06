<template>
  <div>
    <label v-if="label" :for="id">{{ label }}</label> 
    <div class="input input--text" :class="stateClasses">
      <textarea :maxlength="charLimit ? charLimit : 10000" :aria-labelledby="id" :disabled="disabled" :id="id" :placeholder="disabled ? 'Disabled' : placeholder" @keydown="keydownEvent" :style="{resize: resizeToggle}" v-model="currentValue" />
      <span class="input__underline" aria-hidden="true"></span>
      <div class="input__error" v-if="!valid" role="alert">
        <icon name="error" size="16px" ></icon><slot name="error"></slot>
      </div>
      <div class="input__info"><slot name="info"></slot></div>
    </div>
  </div>
</template>

<script>
import { withId } from '../../helpers/props';

export default {
  name: "TextAreaInput",
  props: {
    value: [String, Number],
    label: String,
    secondary: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    validator: {
      type: Function,
      default: () => true,
    },
    resizeable: {
      type: Boolean,
      default: true
    },
    charLimit: {
      type: Number,
      required: false
    },
    keydownEvent: {
      type: Function,
      default: e => e
    },
    ...withId()
  },
  data() {
    return {
      initialized: false,
      currentValue: this.value || ''
    };
  },
  computed: {
    stateClasses () {
      const dirty = this.currentValue.length >= 1 && this.currentValue !== '';
      const disabled = this.disabled;
      const valid = this.valid;

      return {
        'input--dirty': dirty,
        'input--disabled': disabled,
        'input--valid': valid,
        'input--invalid': !valid,
        'input--secondary': this.secondary,
      }
    },
    valid () {
      const v = this.validator(this.currentValue);
      return v;
    },
    resizeToggle() {
      return this.resizeable ? 'both' : 'none'
    }
  },
  watch: {
    currentValue(p, c) {
      this.$emit("input", this.currentValue);
    }
  },
  methods: {
    set(val) {
      this.currentValue = val;
    }
  }
};
</script>

<style scoped lang="scss"></style>
