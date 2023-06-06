
<template lang="pug">
  input.search-input.input--text.searchbar(
    aria-label="Search",
    name="q",
    :placeholder="placeholder",
    v-model="currentValue",
    type="text"
    id="searchq"
    maxlength="50"
    content="width=device-width, initial-scale=1.0"
    :autocomplete="autocomplete"
    @keyup="$emit('keyup')"
    @focus="$emit('focus')"
  )
</template>

<script>
  export default {
    name: 'SearchInput',
    props: {
      value: [String, Number],
      placeholder: {
        type: String,
        default: 'Search:'
      },
      type: {
        type: String,
        default: 'text'
      },
      autocomplete: String,
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
      update (val) {
        this.currentValue = val
      },
      clearInput() {
        return (this.currentValue != '') ? this.update('') : ''
      }
    }
  }
</script>

<style scoped lang="scss">
  .search-input {
    padding: 8px;
    height: 45px;
    font-size: 16px;
    line-height: 18px;
    width: 100%;
    margin: 0;
    border-radius: 0;
    @include safari-ios {
      outline: none;
    }
    @include ie {
      margin-top: -2px;
    }
    @include desktop-up {
      padding: 0 rem(16) 0 rem(16);
      min-width: 545px;
    }

    &:focus {
      outline: none;
    }
  }

</style>