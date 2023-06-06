
<template lang="pug">
  .toast
    transition-group(name="slide-fade-right")
      .toast__message(
        v-for="message in messages", 
        :key="message.id",
        :class="{ 'error': message.type === 'error' }"
      )
        p.toast__message__copy(v-html="message.text")
        v-button.toast__message__cta(
          v-if="message.callback", 
          :small="true", 
          :secondary="true", 
          :label="message.label", 
          @click="message.callback"
        )
</template>

<script>
  import { mapState } from 'vuex'
  import VButton from 'scripts/components/buttons/VButton.vue'

  export default {
    name: 'Toast',
    components: { VButton },
    computed: {
      ...mapState({
        messages: state => state.toast.messages
      })
    }
  }
</script>

<style scoped lang="scss">
  .toast {
    position: fixed;
    bottom: 10px;
    left: 10px;
    max-width: calc(100% - 20px);
    color: $color-white;
    text-align: center;

    @include tablet-up {
      text-align: left;
    }

    &__message {
      padding: 10px 20px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: $color-black-900;
      border-radius: 4px;

      &.error {
        background-color: $color-util-error;
      }

      &__copy {
        line-height: 1.7;
      }

      &__cta {
        margin-left: 10px;
      }
    }
  }
</style>