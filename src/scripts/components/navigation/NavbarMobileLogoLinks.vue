<template lang="pug">
  .mobile-nav-logo-links(:class="logoTabs.tabBorderColorClass")
    a.mobile-nav-logo-links__link(
      v-if="logoTabs.logo1.url && logoTabs.logo1.url.length && logoTabs.logo1.imgUrl.length"
      :href="logoTabs.logo1.url"
      )
      img.mobile-nav-logo-links__image(:src="logoTabs.logo1.imgUrl")
    a.mobile-nav-logo-links__link(
      v-if="logoTabs.logo2.url && logoTabs.logo2.url.length && logoTabs.logo2.imgUrl.length"
      :href="logoTabs.logo2.url"
      )
      img.mobile-nav-logo-links__image(:src="logoTabs.logo2.imgUrl")
    a.mobile-nav-logo-links__link(
      v-if="logoTabs.logo3.url && logoTabs.logo3.url.length && logoTabs.logo3.imgUrl.length"
      :href="logoTabs.logo3.url"
      )
      img.mobile-nav-logo-links__image(:src="logoTabs.logo3.imgUrl")
</template>

<script>
  export default {
    name: 'NavbarMobileLogoLinks',
    props: {
      logoTabs: {
        type: Object,
        default: () => ({
          enabled: Boolean,
          tabBorderColorClass: String,
          logo1: {
            type: Object,
            default: () => ({
              imgUrl: String,
              url: String
            })
          },
          logo2: {
            type: Object,
            default: () => ({
              imgUrl: String,
              url: String
            })
          },
          logo3: {
            type: Object,
            default: () => ({
              imgUrl: String,
              url: String
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mobile-nav-logo-links {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 108px;
    border-top: 1px solid $color-grey;
    border-bottom: 1px solid $color-grey;
    &__link {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 32px;
      height: 100%;
    }
  }
</style>