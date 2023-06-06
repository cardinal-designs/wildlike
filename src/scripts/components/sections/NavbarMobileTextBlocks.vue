<template lang="pug">
  .header__dropdown-container-inner
    .header__dropdown-container-inner-featured-menu-links-container
      .header__dropdown-side-list(v-if="block.featured_link_list_active")
        ul.header__dropdown-list(v-for="(link, index) in block.featured_link_list")
          li(v-if="block.title")
            a.header__dropdown-featured-link(:href="link.url") {{ link.title }}
              icon.mobile-header-menu-image-link-arrow.fill-brand-primary(name="arrow-right", size="16px")
      .header__dropdown-lists-container.header__dropdown-list-menu-links-main-container
        ul.header__dropdown-list.header__dropdown-list-menu-links-container(v-for="(link, index) in block.link_list")
          li.header__dropdown-list-links-image-container
            .mobile-header-dropdown-list-image-container(v-if="link.image")
              img.mobile-header-dropdown-list-image(:src="link.image")
            .header-dropdown-list-links-container
              a.header__dropdown-list-title(:href="link.url") {{ link.title }}
              ul(
                v-for="(child_link, index) in link.children",
              )
                li.header__dropdown-list-item
                  a.header__dropdown-link(:href="child_link.url") {{ child_link.title }}
    v-link.header__menu-main-inner-link(
            v-if="block.url"
            secondary
            :href="block.url"
          )   Shop All
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'
  import VLink from '../buttons/VLink.vue';

  export default {
    name: 'NavbarMobileTextBlocks',
    components: { Icon, VLink },
    props: {
      block: Object
    }
  }
</script>
<style scoped lang="scss">
  .header__dropdown-container-inner {
    display: flex;
    flex-direction: column;
    padding: 24px 17px;
  }

  .header__dropdown-side-list {
    list-style: none;
    padding-left: 0;
    margin-bottom: 32px;
  }

  .mobile-header-dropdown-list-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 32px;
  }

  .header__dropdown-list-links-image-container {
    display: flex;
    flex-direction: row;
  }

  .header__dropdown-list {
    margin-top: 0;
    margin-bottom: 0;

    @include desktop-up {
      margin-right: 78px;
    }
  }

  .header__dropdown-list,
  .header__dropdown-list ul {
    padding-left: 0;
    list-style: none;
  }

  .header__dropdown-list-title {
    display: block;
    margin-bottom: 16px;
    color: $color-black-900;
    font-size: 18px;
    font-family: $font-family-primary;
    font-weight: 900;
  }

  .header__dropdown-featured-link {
    font-size: 20px;
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    color: $color-brand-primary;
  }

  .mobile-header-menu-image-link-arrow {
    margin-left: 4px;
    fill: $color-brand-primary;
  }

  .header__dropdown-link {
    display: block;
    margin-bottom: 12px;
    color: $color-black-900;
    font-size: 16px;
    font-family: $font-family-secondary;
  }

  .header__dropdown-container-inner-featured-menu-links-container {

    @include desktop-up {
      width: 50%;
      display: flex;
    }
  }

  .header__dropdown-list-menu-links-container {
    margin-bottom: 32px;
  }

</style>
