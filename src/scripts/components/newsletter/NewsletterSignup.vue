<template lang="pug">
  div(:class="{'colorTransition': formSubmitted}")
    transition(name="fade")
      p.newsletter-form-success(v-if="formSubmitted") {{copyConfirm}}
</template>

<script>
  
  export default {
    name: 'NewsletterSignup',
    props: {
      copyConfirm: {
        type: String,
        default: 'We just sent you a confirmation email!'
      },
      submitText: {
        type: String,
        default: 'Submit'
      }
    },
    data() {
      return {
        formSubmitted: false
      }
    },
    methods: {
      onFormSuccess() {
        this.formSubmitted = true
      }
    }
  }
</script>

<style scoped lang="scss">
  .fade-enter-active {
    transition: opacity 1s; // slow fade-in on success state
  }
</style>