<template lang="pug">
  div(ref="main")
    nav.main-header-search-container-scrollable(:class="{ 'hideScrollableSearch': !desktopSearchIsOpen }")
      navbar-search(:enablePredictiveSearch="enablePredictiveSearch" :placeholder="placeholder")
      v-button.desktop-search-icon(@click="toggleSearchDesktop", v-if="desktopSearchIsOpen"  aria-label="Close Seach")
        icon(name="close" size="42px" viewBox="3 0 38 38")
    nav.navbar.main-header-nav-container
      .main-header-nav-inner-container.container
        //- Content Left of logo on Mobile
        .mobile-cart-menu-container(:class="mobileNavClass")
          .navbar__mobile
            navbar-hamburger(@open="toggleMenu", @close="toggleMenu" ref="hamburger" v-if="!showSearch")
            transition(name="off-canvas-top")
              .navbar__mobile__nav.navbar__mobile__nav--search(v-if="showSearch")
                search-form(:enable-predictive-search="enablePredictiveSearch")
                v-button.mobile-search-icon(@click="showSearch = false"  aria-label="Close Search")
                  icon(name="close" size="42px" viewBox="-6 0 38 38")
              .navbar__mobile__nav.nav-links-dropdown-content-container(v-else-if="isMenuOpen")
                //- Mobile Menu
                .menu-mobile
                  .menu-mobile__section
                    .menu-mobile__section-content
                      .mobile-menu-parent(v-for="(block, index) in blocks", v-if="isValidBlockType(block.type)", :key="index")
                        menu-mobile-section(:block="block")
                .mobile-dropdown__helper-links-main-container(v-for="(helper, index) in helperlinks")
                  .mobile-dropdown__helper-main-link-link-container(v-if="helper.helper_1_title")
                    a.mobile-dropdown__helper-main-link(:href="helper.helper_1_url" v-if="helper.helper_1_url.length > 0")
                      .mobile-help-icon-container(v-if="helper.mobile_helper_1_icon.length > 0")
                        img.mobile-helper-icon(:src="helper.mobile_mobile_helper_1_icon", :alt="helper.helper_1_title")
                      p.mobile-helper-title {{ helper.helper_1_title }}
                    .mobile-dropdown__helper-main-link(v-else)
                      .mobile-help-icon-container(v-if="helper.mobile_helper_1_icon.length > 0")
                        img.mobile-helper-icon(:src="helper.mobile_helper_1_icon", :alt="helper.helper_1_title")
                      p.mobile-helper-title {{ helper.helper_1_title }}
                    ul.mobile-dropdown__helper-links-container(v-for="(link, index) in helper.helper_1_link_list")
                      li
                        a.mobile-dropdown__helper-link(:href="link.url") {{ link.title }}
                        ul(
                          v-for="(child_link, index) in link.children",
                        )
                          li.header__dropdown-list-item
                            a.header__dropdown-link.link.link--primary(:href="child_link.url") {{ child_link.title }}
                  .mobile-dropdown__helper-main-link-link-container(v-if="helper.helper_2_title")
                    a.mobile-dropdown__helper-main-link(:href="helper.helper_2_url" v-if="helper.helper_2_url.length > 0")
                      .mobile-help-icon-container(v-if="helper.mobile_helper_2_icon.length > 0")
                        img.mobile-helper-icon(:src="helper.mobile_helper_2_icon", :alt="helper.helper_2_title")
                      p.mobile-helper-title {{ helper.helper_2_title }}
                    .mobile-dropdown__helper-main-link(v-else)
                      .mobile-help-icon-container(v-if="helper.mobile_helper_2_icon.length > 0")
                        img.mobile-helper-icon(:src="helper.mobile_helper_2_icon", :alt="helper.helper_2_title")
                      p.mobile-helper-title {{ helper.helper_2_title }}
                    ul.mobile-dropdown__helper-links-container(v-for="(link, index) in helper.helper_2_link_list")
                      li
                        a.mobile-dropdown__helper-link(:href="link.url") {{ link.title }}
                        ul(
                          v-for="(child_link, index) in link.children",
                        )
                          li.header__dropdown-list-item
                            a.header__dropdown-link.link.link--primary(:href="child_link.url") {{ child_link.title }}
        //- Logo
        .logo-nav-container
          navbar-logo(:image="logo", :large-image="logoLarge", :alt="shopName", :h1="h1")
          .nav-links-dropdown-content-container
            .nav-links-dropdown-inner-content-container
              ul.nav-main-links-container(
                v-for="(block, index) in blocks",
                :key="index"
              )
                template(v-if="block.show_mega_menu")
                  //- Comment here
                  li.header__menu-item(aria-haspopup="true" v-if="isValidBlockType(block.type)")
                    component.header__menu-main-link(:is="block.url ? 'a' : 'h4'" :href="block.url")
                      h4.header__menu-main-link-text {{ block.title }}
                    component(:is="blockTypes[block.type].desktop" :block="block")
                template(v-else)
                  li.header__menu-item(v-if="!block.show_mega_menu")
                    component.header__menu-main-link(:is="block.url ? 'a' : 'h4'" :class="{'header__menu-main-link--solo': block.url}" :href="block.url")
                      h4.header__menu-main-link-text {{ block.title }}
          //- Desktop Header Icons
          .desktop-header-cart-container
            .icon-container
              v-button.desktop-search-icon(@click="toggleSearchDesktop", v-if="!desktopSearchIsOpen"  aria-label="Site Search")
                icon(name="search" size="32px")
              v-button.desktop-search-icon(@click="toggleSearchDesktop", v-if="desktopSearchIsOpen" aria-label="Close Search")
                icon(name="close" size="32px")
              v-button.desktop-account-icon(aria-label="My Account Page")
                a(href="/account")
                  icon(name="account" size="32px")
                span.desktop-account-greet(v-if="customer && currentUrl" v-html="`Hi, ${customer}`")
              navbar-cart(:cartBubbleColors="cartBubbleColors")
        //- Content Right of logo on Mobile
        //- Mobile Search
        .mobile-search-icon-form-container(:class="mobileNavSearchClass")
          .mobile-search-icon-container
            v-button.mobile-search-icon(@click="showSearch = true" aria-label="Site Search")
              icon(name="search" size="32px")
            navbar-cart(:cartBubbleColors="cartBubbleColors")
        transition(name="fade")
          div.mobile-account-greet(v-if="customer && currentUrl && mobilePopup" :style="{backgroundColor: background, color: textColor}")
            p.mobile-account-greet__text(v-html="`${greet} ${customer}`")
</template>

<script>
  import { mapState } from 'vuex'

  import SearchForm from 'scripts/components/forms/SearchForm.vue'
  import Icon from 'scripts/components/basic/Icon.vue'
  import AccordionGroup from 'scripts/components/basic/AccordionGroup.vue'

  import NavbarCart from './NavbarCart.vue'
  import NavbarHamburger from './NavbarHamburger.vue'
  import NavbarLogo from './NavbarLogo.vue'
  import NavbarSearch from './NavbarSearch.vue'
  import NavbarMobileSearch from './NavbarMobileSearch.vue'
  import NavbarMobileAccordion from './NavbarMobileAccordion.vue'
  import NavbarMobileLogoLinks from './NavbarMobileLogoLinks.vue'

  import NavbarMobileTextBlocks from 'scripts/components/sections/NavbarMobileTextBlocks.vue'
  import NavbarMobileTextLargeImage from 'scripts/components/sections/NavbarMobileTextLargeImage.vue'
  import NavbarMobileTextSmallImageBlocks from 'scripts/components/sections/NavbarMobileTextSmallImageBlocks.vue'
  import NavbarMobileSmallImageBlocks from 'scripts/components/sections/NavbarMobileSmallImageBlocks.vue'
  import NavbarDesktopTextBlocks from 'scripts/components/sections/NavbarDesktopTextBlocks.vue'
  import NavbarDesktopTextLargeImage from 'scripts/components/sections/NavbarDesktopTextLargeImage.vue'
  import NavbarDesktopTextSmallImageBlocks from 'scripts/components/sections/NavbarDesktopTextSmallImageBlocks.vue'
  import NavbarDesktopSmallImageBlocks from 'scripts/components/sections/NavbarDesktopSmallImageBlocks.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'

  import MenuMobileSection from 'scripts/components/navigation/MenuMobileSection.vue'

  export default {
    name: 'Navbar',
    components: {
      NavbarCart,
      NavbarHamburger,
      NavbarLogo,
      Icon,
      NavbarSearch,
      NavbarMobileSearch,
      SearchForm,
      NavbarMobileTextBlocks,
      NavbarMobileTextLargeImage,
      NavbarMobileTextSmallImageBlocks,
      NavbarMobileSmallImageBlocks,
      NavbarDesktopTextBlocks,
      NavbarDesktopTextLargeImage,
      NavbarDesktopTextSmallImageBlocks,
      NavbarDesktopSmallImageBlocks,
      AccordionGroup,
      NavbarMobileAccordion,
      NavbarMobileLogoLinks,
      VButton,
      MenuMobileSection
    },
    props: {
      logo: String,
      logoLarge: String,
      shopName: String,
      title: String,
      url: String,
      greet: String,
      background: String,
      textColor: String,
      customer: String,
      h1: {
        type: Boolean,
        default: false
      },
      blocks: {
        type: Array,
        default: () => []
      },
      helperlinks: {
        type: Array,
        default: () => []
      },
      cartBubbleColors: Object,
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
      },
      enablePredictiveSearch: Boolean,
      placeholder: {
        type: String,
        default: "Search jewelry, designers and more"
      }
    },
    data () {
      return {
        desktopSearchIsOpen: false,
        mainOffset: null,
        mainOffsetMobile: null,
        isMenuOpen: false,
        showSearch: false,
        currentUrl: false,
        mobilePopup: true,
        blockTypes: {
          text_blocks: {
            mobile: 'navbar-mobile-text-blocks',
            desktop: 'navbar-desktop-text-blocks',
          },
          text_large_image: {
            mobile: 'navbar-mobile-text-large-image',
            desktop: 'navbar-desktop-text-large-image',
          },
          text_small_image_blocks: {
            mobile: 'navbar-mobile-text-small-image-blocks',
            desktop: 'navbar-desktop-text-small-image-blocks',
          },
          small_image_blocks: {
            mobile: 'navbar-mobile-small-image-blocks',
            desktop: 'navbar-desktop-small-image-blocks',
          },
        },
      }
    },
    computed: {
      mobileNavClass () {
        return {
          'is-open': this.isMenuOpen === true
        }
      },
      mobileNavSearchClass () {
        return {
          'is-open': this.isMenuOpen !== true
        }
      },
      isMobileOrTablet() {
        return ['tablet', 'mobile'].includes(this.$mq);
      }
    },
    methods: {
      openSearchDesktop () {
        this.desktopSearchIsOpen = true
      },
      closeSearchDesktop () {
        this.desktopSearchIsOpen = false
      },
      openMenu () {
        this.isMenuOpen = true
      },
      closeMenu () {
        this.isMenuOpen = false
      },
      openSearch () {
        this.showSearch = true
      },
      closeSearch () {
        this.showSearch = false
      },
      toggleSearch () {
        this.showSearch ? this.closeSearch() : this.openSearch()
      },
      toggleMenu () {
        this.isMenuOpen ? this.closeMenu() : this.openMenu()
      },
      toggleSearchDesktop () {
        this.desktopSearchIsOpen ? this.closeSearchDesktop() : this.openSearchDesktop()
      },
      isValidBlockType (blockType) {
        return Object.keys(this.blockTypes).indexOf(blockType) >= 0;
      }
    },
    watch: {
      $mq() {
        const $main = this.$refs.main;
        const $app = document.querySelector('#app');
        $main.className = $main.className.replace(/\bfixed\b/g, '');
        $app.className = $app.className.replace(/\header-fixed\b/g, '');
        const offset = window.scrollY + $main.getBoundingClientRect().y;
        if (this.isMobileOrTablet) {
          this.mainOffsetMobile = offset;
        } else {
          this.mainOffset = offset;
        }
      }
    },
    mounted() {
      if(window.location.href.includes('new_user')) {
        this.currentUrl = true;
        window.history.pushState('', '', '/');
        document.getElementById('shopify-section-top-header').style.display = 'none';
        setTimeout(() => {
          this.mobilePopup = false;
          document.getElementById('shopify-section-top-header').style.display = 'block';
        }, 3000);
      }
      this.mainOffset = window.scrollY + this.$refs.main.getBoundingClientRect().y;
      this.mainOffsetMobile = window.scrollY + this.$refs.main.getBoundingClientRect().y;
      window.addEventListener('scroll', ev => {
        const $main = this.$refs.main;
        const $app = document.querySelector('#app');
        const isFixed = $main.className.match(/fixed/);
        const offset = this.isMobileOrTablet
          ? this.mainOffsetMobile
          : this.mainOffset;
        if (window.scrollY > offset && !isFixed) {
          if ($main.className.split(' ').indexOf('fixed') === -1) {
            $main.className += ' fixed';
          }
          if ($app.className.split(' ').indexOf('fixed') === -1) {
            $app.className += ' header-fixed';
          }
        } else if (window.scrollY <= offset && isFixed) {
          $main.className = $main.className.replace(/\bfixed\b/g, '');
          $app.className = $app.className.replace(/\header-fixed\b/g, '');
        }
      });
    }
  }
</script>

<style scoped lang="scss">
  // Desktop + Mobile Styles
  .navbar {
    display: flex;
    position: relative;

    &__search {
      display: flex;
      width: 100%;
      max-width: rem(240);
      @include desktop-up {
        max-width: unset;
      }
    }
  }

  .main-header-nav-container {
    position: fixed;
    width: 100%;
    background-color: $color-white;
    border-bottom: 1px solid $color-black-300;
    height: 64px;
    top: 40px;

    @include desktop-up {
      border-bottom: 1px solid $color-black-300;
      height: 108px;
      transition: height .15s ease-in;
      top: 48px;
      z-index: 1;
    }
  }

  .header-fixed .main-header-nav-container {
    @include desktop-up {
      height: 92px;
    }
  }

  .main-header-search-container {
    @include mobile-only {
      display: none;
    }
    width: 100%;
    background-color: $color-white;
    height: 65px;
    border-bottom: 1px solid $color-black-300;
    margin-top: 104px;

    @include desktop-up {
      min-height: 109px;
      border-bottom: 1px solid $color-black-300;
      z-index: 2;
    }
  }

  .main-header-nav-inner-container {
    display: flex;
    width: 100%;
    height: 64px;
    justify-content: space-between;
    align-items: center;

    @include desktop-up {
      height: 108px;
      transition: height .15s ease-in;
      flex-direction: row;
      justify-content: space-between;
    }
  }

    .header-fixed .main-header-nav-inner-container {
    @include desktop-up {
      height: 92px;
    }
  }

  .nav-links-dropdown-inner-content-container {
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: calc(100vh - 100px);

    @include desktop-up {
      flex-direction: row;
      position: static;
      min-height: 0;
    }
  }

  .nav-main-links-container {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    background-color: $color-black-100;

    a {
      &:hover {
        color: $color-black-900;
      }
    }

    @include desktop-up {
      flex-direction: row;
      background-color: transparent;
    }
  }

  // With the following, the menu open on hover as soon as the menu item is also underlined
  .nav-main-links-container:hover {
    .header__dropdown-container {
      display: block;
    }
  }

  .header__menu-item {
    list-style: none;
    margin-left: 23px;
    margin-right: 23px;

    &:hover .header__dropdown-container {
      display: block;
    }
  }

  .header__dropdown-container {
    background-color: $color-white;

    @include desktop-up {
      position: absolute;
      width: 100%;
      left: 0;
      top: 101%;
      border-bottom: 1px solid #ecece1;
      background-color: $color-white;
      z-index: 33;
      padding-top: 54px;
      padding-bottom: 57px;
      display: none;
    }
  }

  /deep/ .header__menu-main-link {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    line-height: 36px;
    font-size: 18px;
    padding: 0px 16px 0px 16px;
    letter-spacing: .5px;
    color: $color-black-900;
    font-family: $font-family-primary;
    font-style: italic;
    font-weight: 500;
    height: 80px;
    text-decoration: none;
    border-bottom: 1px solid transparent;

    @include desktop-up {
      background-color: transparent;
      padding: 54px 0px;
      font-size: 16px;
      letter-spacing: normal;
      line-height: 1.25;
      font-weight: 400;

      &:hover {
        color: $color-brand-primary;
      }

      .fixed & {
        padding: 46px 0px;
      }
    }

    .accordion__title {
      font-size: $font-size-h4-mobile;
      font-weight: $font-weight-h4-mobile;
      text-transform: uppercase;
      text-decoration: none;
      font-family: $font-family-primary;
    }
  }

  .header__menu-main-link-text {
    font-size: 20px;
    font-weight: $font-weight-h4-desktop;
    font-family: $font-family-primary;
    text-transform: uppercase;

    &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 24px;
        width: 0;
        height: 4px;
        transition: width 150ms linear;
        background: $color-accent-2-700;
        transform: translateY(-2px);
        z-index: 1;
      }

      &:hover::before,
      &:focus::before {
        width: 100%;
        background: $color-accent-2-700;
      }
  }
  .nav-main-links-container:hover,
  .nav-main-links-container:focus-within {
    .header__menu-main-link-text::before {
      width: 100%;
      background: $color-primary-700;
    }
  }

  .is-open .nav-links-dropdown-content-container {
    @media screen and (max-width: 992px) {
      display: block;
      position: fixed;
      top: 104px;
      left: 0;
      background-color: $color-black-100;
      width: 100%;
      height: calc(100% - 70px);
      overflow: scroll;
      transform: translateX(0);
      transition: transform 0.3s ease-in-out;
      z-index: 1;
      padding-bottom: 60px;
    }
  }

  .nav-links-dropdown-content-container {
    display: none;

    @media screen and (max-width: 992px) {
      display: none;
      position: fixed;
      top: 104px;
      left: -100%;
      background-color: $color-white;
      width: 100%;
      height: calc(100% - 70px);
      overflow: scroll;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      z-index: 1;
    }

    @include desktop-up {
      display: block;
    }
  }

  .logo-nav-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-basis: 0;
    flex-grow: 4;

    @include desktop-up {
      justify-content: space-between;
    }
  }

  .header-logo {
    max-width: 150px;
  }

  .desktop-header-search-container,
  .mobile-hamburger-container,
  .mobile-search-icon-form-container{
    cursor: pointer;
  }

  .icon-container {
    width: 146px;
    display: grid;
    grid-template-columns: 50px 50px 50px;
    min-height: 40px;
  }

  .icon-container > * {
    text-align: right;
  }

  .desktop-search-icon, .navbar-mobile-search__open {
    transition: all .15s ease-in;
  }

  .mobile-search-icon {
    margin-right: 12px;
  }

  .desktop-account-icon {
    grid-column-start: 2;
    position: relative;
  }

  .desktop-account-greet {
    position: absolute;
    bottom: -50%;
    left: 0;
    white-space: nowrap;
  }

  .header-fixed .desktop-search-icon, .header-fixed .navbar-mobile-search__open{
    visibility: visible;
    opacity: 1;
  }
  /* MOBILE */
  .mobile-cart-menu-container {
    display: flex;
    align-items: center;

    @include desktop-up {
      display: none;
    }
  }

  .mobile-search-icon-form-container,
  .mobile-cart-menu-container {
    display: flex;
    align-items: center;

    @include desktop-up {
      display: none;
    }
  }

  .mobile-search-icon-form-container {
    justify-content: flex-end;
    flex-grow: 3;
    flex-basis: 0;
    margin-bottom: 5px;
  }

  .mobile-cart-menu-container {
    justify-content: flex-start;
    flex-grow: 3;
    flex-basis: 0;
  }

  .navbar__mobile__linklist {
    display: flex;
    flex-direction: column;
  }

    .mobile-account-greet {
    @include desktop-up {
      display: none;
    }

    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    img {
      animation: pulse 2.1s;
    }

    .mobile-account-greet__text {
      font-size: 44px;
      font-family: $font-family-primary;
    }
  }

  @keyframes pulse {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }

  .mobile-dropdown__helper-links-main-container {
    display: flex;
    flex-direction: column;
    padding: 6px 16px;
    margin-top: 16px;

    @include desktop-up {
      display: none;
    }
  }

  .mobile-dropdown__helper-main-link-container {
    margin-bottom: 24px;
  }

  .mobile-dropdown__helper-links-container {
    list-style: none;
    padding-left: 0;
  }

  .mobile-help-icon-container {
    margin-right: 8px;
    display: flex;
  }

  .mobile-helper-icon {
    width: 20px;
    height: 20px;
  }

  .mobile-dropdown__helper-main-link {
    margin-bottom: 16px;
    color: $color-black-900;
  }

  .mobile-dropdown__helper-link {
    color: $color-black-900;
    margin-bottom: 16px;
    display: block;
  }

  .mobile-helper-title {
    margin: 0;
    font-size: 16px;
    font-family: $font-family-secondary;
  }

  .desktop-help-icon-container {

    @include desktop-up {
      margin-left: 4px;
    }
  }

  .mobile-dropdown__helper-main-link {
    display: flex;
    align-items: center;
  }

  .mobile-dropdown__helper-links-container {
    margin: 0;
    padding: 0;
  }

  /* SEARCH */
  .navbar__mobile__nav--search {
    background: $color-white;

    @media screen and (max-width: 1023px) {
      position: fixed;
      top: 40px;
      left: 0;
      width: 100%;
      display: flex;
      padding: 10px 0 10px 16px;
      border-bottom: 1px solid $color-black-300;
    }
  }

  .navbar__mobile__nav--search .button__content {
    display: flex;
  }

  .desktop-header-cart-container {
    display: none;

    @include desktop-up {
      display: flex;
      align-items: center;
      padding: 20px 0;
      position: relative;
    }
  }

  .header-search-container {
    display: flex;
    align-items: center;
    position: relative;
    border-right: 1px solid $color-black-300;
    padding-right: 24px;
    margin-right: 24px;
    height: 40px;
  }

  .header-search-form-container {
    position: absolute;
    top: 0;
    width: 280px;
    display: none;
    height: 100%;
    overflow: hidden;
    z-index: 60;
    transform: translateX(100%);
    border: 1px solid $color-white;
    background-color: $color-white;
  }

  .active-accordion .icon-plus-path {
    fill: $color-brand-primary !important;
  }

  .innersvg:hover {
    fill: #F9E6EE;
  }

  .main-header-search-container-scrollable {
    @include desktop-up {
      min-height: 108px;
      border-bottom: 1px solid #D4D3CF;
      margin-top: 48px;
      opacity: 1;
      visibility: visible;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 24px;
      position: fixed;
      width: 100%;
      background-color: $color-white;
    }

    @include mobile-only {
      display: none;
    }
  }

  .main-header-search-container {
    @include mobile-only {
      display: none;
    }
    @include desktop-up {
      position: fixed;
      display: none;
    }
    top: 0px;
    transition: all 0.1 ease-in-out;
  }

  .desktopSearchOpen {
    @include mobile-only {
      display: block;
    }
    position: fixed;
    top: 0px;
    opacity: 1;
  }

  .fixed .desktopSearchOpen {
    position: fixed;
    top: -16px;
    opacity: 1;
    display: block;
  }

  .main-header-search-container-scrollable.hideScrollableSearch {
    display: none;
    transition: all 0.15 ease-in;
  }
</style>
