<template lang="pug">
  div
    .mobile-menu-main-link-button
      div.mobile-menu-main-link-button-container(@click="OpenSubMenuMobile")
        a.h5.mobile-menu-main-link-button-text(v-if="!block.show_mega_menu", :href="block.url") {{ block.title }}
        h5.mobile-menu-main-link-button-text(v-else) {{ block.title }}
        icon(name="chevron-right" size="16px", v-if="block.show_mega_menu")
      hr.mobile-menu-main-link-button-line
      div.mobile-panel(:class="{ open: showSubMenuMobile }", v-if="block.show_mega_menu")
        div.mobile-panel-title(@click="closeSubMenuMobile")
          icon.mobile-panel-title-icon(name="chevron-left" size="16px")
          h4.mobile-panel-title-icon-text {{ block.title }}
          .mobile-panel-title-icon-invisible-item
        accordion-group.navbar__mobile__linklist
          navbar-mobile-accordion.navbar__mobile__category.nav-main-links-container(v-for="(link, index) in links", :blockType="blockType" :key="index", :heading="link.title", :headinglink="link.url", class="accordionClass", :selected="expandDefault")
            .header__dropdown-list-item(v-for="(subMenuItems, i) in link.children" :key="i")
              a.header__dropdown-link.link.link--primary(:href="subMenuItems.url") {{ subMenuItems.title }}
        .mobile-panel__link-container
          a(v-if="block.large_image_link_text", :href="block.large_image_link").mobile-panel__link {{ block.large_image_link_text }}
          a(v-if="block.image_1_text", :href="block.image_1_url").mobile-panel__link {{ block.image_1_text }}
          a(v-if="block.image_2_text", :href="block.image_2_url").mobile-panel__link {{ block.image_2_text }}
          a(v-if="block.image_3_text", :href="block.image_3_url").mobile-panel__link {{ block.image_3_text }}

</template>

<script>
import AccordionGroup from 'scripts/components/basic/AccordionGroup.vue'
import NavbarMobileAccordion from './NavbarMobileAccordion.vue'

import Icon from 'scripts/components/basic/Icon.vue'

import NavbarMobileTextBlocks from 'scripts/components/sections/NavbarMobileTextBlocks.vue'
import NavbarMobileTextLargeImage from 'scripts/components/sections/NavbarMobileTextLargeImage.vue'
import NavbarMobileTextSmallImageBlocks from 'scripts/components/sections/NavbarMobileTextSmallImageBlocks.vue'
import NavbarMobileSmallImageBlocks from 'scripts/components/sections/NavbarMobileSmallImageBlocks.vue'
import NavbarDesktopTextBlocks from 'scripts/components/sections/NavbarDesktopTextBlocks.vue'
import NavbarDesktopTextLargeImage from 'scripts/components/sections/NavbarDesktopTextLargeImage.vue'
import NavbarDesktopTextSmallImageBlocks from 'scripts/components/sections/NavbarDesktopTextSmallImageBlocks.vue'
import NavbarDesktopSmallImageBlocks from 'scripts/components/sections/NavbarDesktopSmallImageBlocks.vue'

export default {
  name: "MenuMobileSection",
  components: {
    AccordionGroup,
    Icon,
    NavbarMobileAccordion,
    NavbarMobileTextBlocks,
    NavbarMobileTextLargeImage,
    NavbarMobileTextSmallImageBlocks,
    NavbarMobileSmallImageBlocks,
    NavbarDesktopTextBlocks,
    NavbarDesktopTextLargeImage,
    NavbarDesktopTextSmallImageBlocks,
    NavbarDesktopSmallImageBlocks,
  },
  data () {
    return {
      showSubMenuMobile: false,
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
        }
    }
  },
  computed: {
    links: function() {
      return this.block.link_list
    },
    blockType: function() {
      return this.block.type
    },
    expandDefault: function() {
      return this.block.expand_mobile;
    },
  },
  props: [
    'block'
  ],
  methods: {
    OpenSubMenuMobile() {
      this.showSubMenuMobile = true;
    },
    closeSubMenuMobile() {
      this.showSubMenuMobile = false;
    },
    isValidBlockType(blockType) {
      return Object.keys(this.blockTypes).indexOf(blockType) >= 0;
    }
  }
}
</script>

<style scoped lang="scss">

button.mobile-menu-main-link-button {
  width: 100%;
}

.mobile-menu-main-link-button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 56px;
  width: 100%;
  padding: 16px 27px 16px 16px;
  background-color: $color-black-100;
}

h5.mobile-menu-main-link-button-text {
  size: 20px;
  text-align: left;
  line-height: 20px;
  letter-spacing: 1px;
}

h4.mobile-panel-title-icon-text {
  size: 24px;
  letter-spacing: 1px;
}

hr.mobile-menu-main-link-button-line {
  background-color: $color-black-300;
  margin: 0 17px;
}

.mobile-panel {
  position: fixed;
  left: 0;
  top: 0px;
  height: calc(100vh - 174px);
  width: 100vw;
  z-index: 1;
  transform: translate3d(100%,0,0);
  background-color: $color-black-100;
  transition: transform .15s ease-in-out;
  overflow: scroll;
}

.open {
  transform: translateZ(0);
}

.mobile-panel-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  min-height: 56px;
  width: 100%;
  padding: 16px 27px 16px 16px;
  background-color: $color-black-100;
}

.mobile-panel-title-icon-text {
  margin: auto;
}

.mobile-panel-title-icon-invisible-item{
  width: 16px;
}

.header__dropdown-list-item {
  padding: 8px 16px;
  line-height: 100%;
}

.mobile-panel__link-container{
  display: flex;
  flex-direction: column;
  padding: 6px 16px;
  margin-top: 16px;
}

.mobile-panel__link{
  color: $color-text-dark;
  margin-bottom: 20px;
  font-family: $font-family-secondary;
}

.header__dropdown-link {
  font-family: $font-family-secondary;
  font-weight: 600;
}
</style>
