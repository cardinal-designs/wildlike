
<template lang="pug">
  .input.input--number(:class="{'input--secondary': secondary}")
    label(v-if="label") {{ label }}
    input(type="number", :min="min", :max="max" :placeholder="placeholder", :value="currentValue" @input="input")
</template>

<script>
  import TextInput from 'scripts/components/forms/TextInput.vue'
  
  export default {
    name: 'NumberInput',
    extends: TextInput,
    props: {
      min: Number,
      max: Number,
      secondary: {
        type: Boolean,
        default: false,
      },
      wholeNumbers: {
        type: Boolean,
        default: false,
      }
    },
    methods: {
      input(e) {
        const num = this.wholeNumbers ? parseInt(e.target.value) : parseFloat(e.target.value);
        if(!isNaN(num) && num !== this.currentValue) {
          this.currentValue = num;
          this.$emit('input', num);
        } else {
          e.target.value = '';
          e.target.value = this.currentValue;
        }
      },
    }
  }
</script>

<style scoped lang="scss">
</style>