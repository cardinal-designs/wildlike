<template lang="pug">
  .input.input--select
    icon.fill-black(v-if="showIcon" name="chevron-down" size="12px")
    v-select(
      :options="options"
      :clearable="false"
      :placeholder="defaultOption"
      :value="currentOption"
      @input="handleChange"
    )

    select(v-if="mobile" v-model="currentValue", :disabled="disabled")
      option(v-if="!required", value="") {{ defaultOption }}
      option(v-for="option in options", :value="option.value", :key="option.value") {{ option.label }}
</template>

<script>
  import CustomerTextInput from 'scripts/components/forms/CustomerTextInput.vue'
  import vSelect from 'vue-select';
  import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'CustomerSelectInput',
    extends: CustomerTextInput,
    components: {
      vSelect,
      Icon
    },
    props: {
      options: {
        type: Array
      },
      required: {
        type: Boolean,
        default: false
      },
      selected: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      showIcon: {
        type: Boolean,
        deafult: false
      }
    },
    computed: {
      defaultOption () {
        return (this.placeholder !== '') ? this.placeholder : 'Menu'
      },

      currentOption () {
        return this.options.filter(opt => opt.value === this.currentValue)[0] || null;
      },

      mobile () {
        return this.$mq === 'mobile';
      }
    },
    watch: {
      currentValue (p, c) {
        this.$emit('input', this.currentValue)
      }
    },
    created () {
      if (this.required && this.currentValue === '' && this.options.length > 0) {
        this.currentValue = this.options[0].value
        this.$emit('input', this.currentValue)
      }
      if ( this.selected !== '' ) {
        let selected = {value: this.selected}
        this.handleChange(selected)
      }
    },
    methods: {
      handleChange (e) {
        this.currentValue = e.value
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
