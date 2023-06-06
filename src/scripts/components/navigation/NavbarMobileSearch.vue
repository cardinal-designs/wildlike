<template lang="pug">
  v-button.navbar-mobile-search__open(
    label="Toggle Search", 
    @click="toggleSearch" 
    v-if="showSearch === false || $mq === 'mobile' || $mq === 'tablet'")
    icon.navbar-mobile-search-icon(
      v-if="!showSearch"
      name="search", 
      size="30px")
    icon.navbar-mobile-search-icon(
      v-if="showSearch"
      name="close", 
      size="30px")
  transition(name="slide-fade-down" v-else)
    .navbar-mobile-search
      search-form(@close-search="closeSearch")
</template>

<script>
  import SearchForm from 'scripts/components/forms/SearchForm.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'NavbarMobileSearch',
    components: { SearchForm, VButton, Icon },
    data () {
      return {
        showSearch: false
      }
    },
    methods: {
      openSearch () {
        this.showSearch = true
        this.$emit("open-search")
      },
      closeSearch () {
        this.showSearch = false
        this.$emit("close-search")
      },
      toggleSearch () {
        if (this.showSearch) {
          this.closeSearch()
        } else {
          this.openSearch()
        }
        this.$emit("toggle-search")
      }
    }
  }
</script>

<style scoped lang="scss">
  .navbar-mobile-search {
    position: absolute;
    top: 54px;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100px;
    padding: 24px 13px;
    z-index: 999;
    &__open {
      margin-left: auto;

      &:focus {
        background-color: transparent;
      }
    }
  }
  
  .navbar-mobile-search-icon {
    margin-right: 10px;
  }

</style>
