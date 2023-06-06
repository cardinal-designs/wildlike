<template lang="pug">
  customer-select-input(name="account-nav" :required="true" @input="handleRedirect" :selected="selected" :options="options" :showIcon="false")
</template>

<script>
  import CustomerSelectInput from 'scripts/components/forms/CustomerSelectInput.vue'

  export default {
    name: 'AccountSelectNav',
    components: { CustomerSelectInput },
    props: {
      options: Array,
      selected: String
    },
    data() {
      return {
        currentValue: String
      }
    },
    methods: {
      handleRedirect(e) {
        if ( e !== this.selected ) {
          window.location = e
        }
      }
    }
  }
</script>