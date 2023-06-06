
<template lang="pug">
  .option-select.option-select--dropdown
    select-input(:label="label", :options="optionSet", v-model="currentValue",alwaysNotNative=true required)
</template>

<script>
  import SelectInput from 'scripts/components/forms/SelectInput.vue'

  export default {
    name: 'OptionSelectDropdown',
    components: { SelectInput },
    props: {
      value: String,
      product: Object,
      label: String,
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
    computed: {
      optionSet () {
        return [...new Set(this.product.variants.slice().map(variant => variant[this.option]))]
          .map(option => ({ label: option, value: option }))
      }
    },
    watch: {
      currentValue () {
        this.$emit('input', this.currentValue)
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
