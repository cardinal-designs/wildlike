
<template lang="pug">
  .input.input--text(:class="inputClass")
    label(v-if="label") {{ label }}
    input(
      v-if="!textarea"
      type="text",
      :placeholder="placeholder",
      :disabled="disabled",
      v-model="currentValue"
    )
    textarea(
      v-if="textarea"
      :placeholder="placeholder",
      :disabled="disabled",
      v-model="currentValue"
    )
    span(v-if="error") {{ error }}
</template>

<script>
  export default {
    name: 'CustomerTextInput',
    props: {
      value: [String, Number, Object],
      label: String,
      placeholder: {
        type: String,
        default: ''
      },
      textarea: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'text'
      },
      required: {
        type: Boolean,
        default: false
      },
      error: {
        type: String,
        default: ""
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        initialized: false,
        currentValue: this.value
      }
    },
    watch: {
      currentValue (p, c) {
        this.$emit('input', this.currentValue)
      }
    },
    methods: {
      set (val) {
        this.currentValue = val
      }
    },
    computed: {
      inputClass () {
        return {
          'input--error': this.error.length > 0,
          'input--disabled': this.disabled == true
        }
      }
    }
  }
</script>

<style scoped lang="scss">
</style>