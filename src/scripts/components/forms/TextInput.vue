<template>
  <div style="position: relative">
    <label v-if="label" :for="id">{{ label }}</label> 
    <div class="input input--text" :class="stateClasses">
      <input :type="type" :aria-labelledby="id" :disabled="disabled" :id="id" :placeholder="disabled ? 'Disabled' : placeholder" v-model="currentValue" v-bind="$attrs" :maxlength="maxlength"/>
      <icon :name="iconName"></icon>
      <span class="input__underline" aria-hidden="true"></span>
      <div class="input__error" v-if="!valid" role="alert">
        <slot name="error"></slot>
      </div>
      <div class="input__info"><slot name="info"></slot></div>
    </div>
  </div>
</template>

<script>
import { withId } from '../../helpers/props';
import Icon from '../basic/Icon.vue';

export default {
  name: "TextInput",
  props: {
    icon: String,
    value: [String, Number],
    label: String,
    maxlength: {
      type: String,
      required: false
    },
    secondary: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    validator: {
      type: Function,
      default: () => true,
    },
    ...withId()
  },
  components: {
    Icon
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
    iconName() {
        if (this.icon) {
          return this.icon;
        }
        return '';
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
