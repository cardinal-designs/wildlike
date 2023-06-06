<template lang="pug">
  fieldset.input.input--checkbox-group(:class="inputClass", :group="group")
    legend(v-if="label") {{ label }}

    label(v-for="option in options") {{ option.label }}
      input(
        :id="option.value"
        :value="option.value"
        type="checkbox"
        v-model="selected"
        :disabled="option.disabled"
        :name="group"
        @change.prevent="onChange"
      )
      span(class="checkbox-toggle")
        icon.checkbox-checkmark(name="checkmark_small" size="10px")
</template>

<script>
  import CustomerTextInput from 'scripts/components/forms/CustomerTextInput.vue'
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'CheckboxInputGroup',
    extends: CustomerTextInput,
    prop: 'selected',
    event: 'input',
    components: {
      Icon
    },
    props: {
      options: {
        type: Array,
        required: true,
        default: () => []
      },
      group: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        inputClass: 'input input--checkbox-group'
      }
    },
    created () {
      let selected = [];
      this.options.forEach(opt => {
        if (opt.checked) {
          selected.push(opt.value);
        }
      })
      this.selected = selected;
    },
    methods: {
      onChange () {
        this.options.forEach((opt, i) => {
          this.options[i].checked = this.selected.indexOf(opt.value) != -1
        });
        this.$emit('input', this.options);
      }
    }
  }
</script>

<style scoped lang="scss">
  fieldset {
    border: none;
  }
</style>
