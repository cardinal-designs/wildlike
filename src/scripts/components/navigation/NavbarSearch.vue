
<template lang="pug">
  //- v-button.navbar-search__open(
  //-   label="Toggle Search", 
  //-   @click="toggleSearch" 
  //-   v-if="showSearch === false || $mq === 'mobile'"
  //-   aria-label="Open Search")
  //-   icon(
  //-     name="search", 
  //-     size="30px")
  //- transition(name="slide-fade-left" v-else)
  //- .navbar-search
  search-form(@close-search="closeSearch" :enablePredictiveSearch="enablePredictiveSearch" :placeholder="placeholder")
  
</template>

<script>
  import SearchForm from 'scripts/components/forms/SearchForm.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'NavbarSearch',
    components: { SearchForm, VButton, Icon },
    props: {
      enablePredictiveSearch: Boolean,
      placeholder: {
        type: String,
        default: "Search for Jewelry, Designers and More"
      }
    },
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

</style>