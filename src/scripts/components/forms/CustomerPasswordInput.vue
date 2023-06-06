
<template lang="pug">
  .input
    label(for="CreatePassword" class="label-hidden" v-html="label")
    input(
      required type="password"
      name="customer[password]"
      class="customer-register-input"
      id="CreatePassword"
      @focus="message = true"
      @blur="message = false"
      v-model="password"
      autocomplete="off"
      @input="disableBtn"
      :placeholder="placeholder") 
    .message(v-if="message") 
     icon(name="checkmark_small" size="12px" color="#058019" v-if="password.length > 4") 
     icon(name="close-red" size="12px" v-else) 
     span.message__text(:style="{color: messageColor}") Be at least 5 characters
</template>

<script>
import Icon from 'scripts/components/basic/Icon.vue';

  export default {
    name: 'CustomerPasswordInput',
    components: { Icon },
    props: {
      label: String,
      placeholder: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        message: false,
        password: ''
      }
    },
    computed: {
      messageColor () {
        return this.password.length > 4 ? "#058019" : "#f20202";
      }
    },
    methods: {
      disableBtn () {
        const submitBtn = document.getElementById('create_user');
        if (this.password.length > 4) {
          submitBtn.removeAttribute('disabled');
        } else {
          submitBtn.setAttribute('disabled', 'disabled');
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .input {
    position: relative;
  }

  .message {
    position: absolute;
    bottom: -45px;
    width: 90%;
    transform: translateX(5%);
    border: 1px solid $color-grey;
    background: $color-white;
    z-index: 2;
    border-radius: 5px;
    padding: 15px 10px;
    display: flex;
    align-items: center;

    .message__text {
      margin-left: 5px;
    }
    
    &::after {
      content: ''; 
      position: absolute; 
      left: 50%;
      transform: translateX(-50%);
      top: -20px; 
      border: 10px solid transparent; 
      border-bottom: 10px solid $color-grey; 
    }
  }
</style>