<template lang="pug">
  form.search-form(action="/search")
    input(type="hidden" name="type" value="article,page,product")
    input(type="hidden" name="options[prefix]" value="last")
    .input
      label.u-sr-only(for="q") Search
      search-input(ref="searchInput" @keyup="showSearchResults" @focus="openSearchResults" :placeholder="placeholderText" v-model="searchValue" :autocomplete="enablePredictiveSearch ? 'off' : 'on'")
    v-button.search-form__submit(
    label="Search")
      v-button.desktop-search-icon
        icon(name="search" size="32px") 
    predictive-search-modal(v-if="enablePredictiveSearch" :searchTerm="searchValue" ref="predictiveSearchModal")
</template>

<script>
  import SearchInput from 'scripts/components/forms/SearchInput.vue'
  import PredictiveSearchModal from 'scripts/components/search/PredictiveSearchModal.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'
  import Icon from 'scripts/components/basic/Icon.vue'
  import {FadeTransition} from 'vue2-transitions'

  export default {
    name: 'SearchForm',
    components: {
      SearchInput,
      PredictiveSearchModal,
      VButton,
      Icon,
      FadeTransition
    },
    data() {
      return {
        searchValue: '',
        isMounted: false,
      };
    },
    props: {
      searchIconSize: {
        type: String,
        default: "38px"
      },
      enablePredictiveSearch: Boolean,
      placeholder: {
        type: String,
        default: "Search jewelry, designers and more"
      }
    },
    computed: {
      // cannot use default prop because empty strings
      // get passed from shopify.
      placeholderText() {
        return this.placeholder === "" ? 'Search jewelry, designers and more' : this.placeholder;
      },
      showSearchModal() {
        return this.isMounted ? this.$refs.predictiveSearchModal.showModal : false;
      }
    },
    methods: {
      closeClick() {
        if (this.enablePredictiveSearch) {
          this.$refs.predictiveSearchModal.close();
        }
        if (this.$mq === 'mobile') {
          this.$refs.searchInput.clearInput();
        } else {
          this.$emit("close-search");
        }
      },
      showSearchResults() {
        if (!this.$refs.predictiveSearchModal) return;
        this.$refs.predictiveSearchModal.getSearchResults();
      },
      closeSearchResults() {
        if (!this.$refs.predictiveSearchModal) return;
        this.$refs.predictiveSearchModal.close();
      },
      openSearchResults() {
        if (this.searchValue.length <= 0 || this.$refs.predictiveSearchModal) {
          return;
        }
        this.$refs.predictiveSearchModal.show();
      }
    },
    mounted() {
      this.isMounted = true;
    }
  }
</script>

<style scoped lang="scss">
  .search-form {
    width: 100%;
    height: 44px;
    position: relative;
    background-color: $color-white;
    padding: 19px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    @include desktop-up {
      background-color: $color-white;
      padding: 0;
      width: 545px;
      height: 71px;
      margin-right: 22px;
    }

    &__submit {
      position: absolute;
      top: 50%;
      right: 5px;
      left: auto;
      transform: translateY(-50%);

      @include desktop-up {
        left: auto;
        right: 12px;
      }
    }

    &__modal-close {
      position: absolute;
      top: 50%;
      right: 72px;
      z-index: 1;
      display: flex;
      padding: 8px;
      border-radius: 50%;
      box-shadow: $drop-shadow--light;
      transform: translateY(-50%);
      cursor: pointer;

      .navbar & {
        display: none;
      }
    }

    &__close {
      display: none;
      cursor: pointer;

      @include desktop-up {
        display: block;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        z-index: 1;
        padding-top: 9px;
        padding-right: 16px;
        padding-bottom: 9px;
        padding-left: 4px;
      }
    }

    .input {
      margin: 0;
      width: 100%;
    }
  }

  /deep/ .button__content {
    display: flex;
  }

  /deep/ .search-input::-webkit-input-placeholder, /* Chrome/Opera/Safari */
  /deep/ .search-input::-moz-placeholder, /* Chrome/Opera/Safari */
  /deep/ .search-input:-ms-input-placeholder,/* Chrome/Opera/Safari */
  /deep/ .search-input:-moz-placeholder { /* Chrome/Opera/Safari */
    color: $color-black-500;
  }

  /deep/ .search-input::placeholder {
    color: $color-black-500;
  }

  .innersvg:hover {
    fill: #FFADD8;
  }
</style>
