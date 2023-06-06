
<template lang="pug">
  button.button(
    :disabled="!!stateClass"
    :class="stateClass"
    v-on="$listeners"
  )
    span.button__content
      slot
    span.button__progress
  </button>
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'AsyncButton',
    props: {
      promise: {
        type: Promise
      }
    },
    data() {
      return {
        stateClass: ''
      }
    },
    watch: {
      promise(n, o) {
        if(!(n instanceof Promise) || n === o) return;
        
        this.stateClass = 'button--state-loading';
        this.promise
          .then((r) => {
            this.stateClass = 'button--state-success';
            return r;
          })
          .catch((e) => {
            this.stateClass = 'button--state-error';
            return e;
          })
          .then((r) => { // finally()
            window.setTimeout(() => this.stateClass = '', 2100); // reset to original state
            return r;
          });
      }
    }
  }
</script>

<style scoped lang="scss">
  button.button {
    font-size: rem(20);
  }
</style>
