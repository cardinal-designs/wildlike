
<template lang="pug">
  .bis-holder(v-if="variant && !variant.available")

    .bis-form(v-if="!subscribedTo.includes(variant.id)")
        label(for="notify_email") Email Address
        .input.input--text
          input#notify_email(v-model="bisEmail", type="email", placeholder="example@email.com")
        .bis-errors(
          :class="bisError"
        ) {{ bisMessage }}
        #notify_button.button.button--primary(@click="bisTrigger") Notify Me

    .bis-success(v-if="subscribedTo.includes(variant.id)")
      p.h3 Got it
      p.body-sm We'll send an email to {{ bisEmail }} when {{ product.title }} {{ variantTitle }}is back in stock.
    p.bis-message(v-if="!subscribedTo.includes(variant.id)") This item is out of stock. Submit your email address above and we'll let you know when it's back in stock.
</template>

<script>
  import { mapState } from 'vuex'

  import { SwymBIS } from '../../helpers/swym-bis';

  export default {
    name: 'SwymBackInStock',
    components: {},
    props: {
      product: Object,
      variant: Object,
      swym: Object
    },
    data () {
      return {
        bisMessage: "",
        bisError: "",
        bisEmail: "",
        swymBis: null,
        subscribedTo: []
      }
    },
    computed: {
      variantTitle () {
        return this.variant.title != 'Default Title' ? this.variant.title + ' ' : '';
      }
    },
    mounted: function() {
      this.swymBis = new SwymBIS(this.product, this.swym.settings);
    },
    methods: {
      bisTrigger() {
        this.swymBis.subscribe(this.bisEmail, this.variant, this.bisFeedback.bind(this));
      },
      bisFeedback(err) {
        if( !err ) {
          this.subscribedTo.push(this.variant.id);
        } else {
          this.bisError = "";
          this.bisMessage = err;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bis-holder {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    .input {
      width: 100%;
      overflow: hidden;
      margin-top: 0;
      label{
        padding-top: 17px;
        padding-bottom: 17px;
      }
    }
    .button {
      width: 100%;
      display: flex;
      letter-spacing: 1px;
      justify-content: center;
      align-items: center;
      text-transform: uppercase;
      font-size: 18px;
    }
  }

  .bis-success {
    padding: 13px 17px 28px;
    border: 1px solid $color-util-success;
    background: $color-util-notification;
    text-align: center;

    .h3 {
      margin-bottom: 8px;
    }
  }

  .bis-message {
    width: 100%;
    color: $color-util-error;
    font-family: $font-family-primary;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.4px;
    line-height: 20px;
    text-align: center;
    margin: 25px 0;
  }

  .bis-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;

    label {
      margin-bottom: 4px;
    }
  }

  .bis-errors {
    color: #e22f00;
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 0.5px;
    display: block;
    margin-top: -12px;
    &.success {
      color: green;
      width: 100%;
      text-align: center;
      padding: 20px 0;
      font-size: 1rem;
    }
  }

  #notify_email:not(:placeholder-shown) {
    padding-top: 17.5px;
    padding-bottom: 3.5px;
  }

  #notify_email:not(:placeholder-shown)+label {
    padding-top: 5.5px;
  }
</style>