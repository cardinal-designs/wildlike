<template lang="pug">
  .header__dropdown-container-inner
    .header__dropdown-container-inner-featured-menu-links-container
      .header__dropdown-side-list(v-if="block.featured_link_list_active")
        ul.header__dropdown-list(v-for="(link, index) in block.featured_link_list")
          li(v-if="block.title")
            a.header__dropdown-featured-link(:href="link.url") {{ link.title }}
              icon.mobile-header-menu-image-link-arrow.fill-brand-primary(name="arrow_long_right", size="24px")
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
    .header__dropdown-lists-images-container
      .header__dropdown-lists-images-inner-container
        a.header__dropdown-image-link-container(v-if="block.image_1_url", :href="block.image_1_url")
          .header__dropdown-image-link-inner-container
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_1", :alt="block.image_1_text")
            .header-menu-image-title(v-if="block.image_1_text") {{ block.image_1_text }}
              icon.menu-image-link-arrow.fill-brand-primary(name="arrow_long_right", size="24px")
        .header__dropdown-image-link-container(v-else)
          .header__dropdown-image-link-inner-container
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_1", :alt="block.image_1_text")
            .header-menu-image-title(v-if="block.image_1_text") {{ block.image_1_text }}
        a.header__dropdown-image-link-container(v-if="block.image_2_url", :href="block.image_2_url")
          .header__dropdown-image-link-inner-container
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_2", :alt="block.image_2_text")
            .header-menu-image-title(v-if="block.image_2_text") {{ block.image_2_text }}
              icon.menu-image-link-arrow.fill-brand-primary(name="arrow_long_right", size="24px")
        .header__dropdown-image-link-container(v-else)
          .header__dropdown-image-link-inner-container
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_2", :alt="block.image_2_text")
            .header-menu-image-title(v-if="block.image_2_text") {{ block.image_2_text }}
        a.header__dropdown-image-link-container(v-if="block.image_3_url", :href="block.image_3_url")
          .header__dropdown-image-link-inner-container
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_3", :alt="block.image_3_text")
            .header-menu-image-title(v-if="block.image_3_text") {{ block.image_3_text }}
              icon.menu-image-link-arrow.fill-brand-primary(name="arrow_long_right", size="24px")
        .header__dropdown-image-link-container(v-else)
          .header__dropdown-image-link-inner-container
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_3", :alt="block.image_3_text")
            .header-menu-image-title(v-if="block.image_3_text") {{ block.image_3_text }}
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
    name: 'NavbarMobileTextSmallImageBlocks',
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

  .header__dropdown-list {
    margin-top: 0;
    margin-bottom: 0;

    @include desktop-up {
      margin-right: 78px;
    }
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
    color: $color-brand-primary;
  }

  .header__dropdown-list,
  .header__dropdown-list ul {
    padding-left: 0;
    list-style: none;
    font-size: 16px;
    letter-spacing: 0;
    line-height: 20px;
    margin-bottom: 20px;
  }

  .header__dropdown-list-title {
    font-family: $font-family-secondary;
    color: $color-black-900;
    margin-bottom: 20px;
    font-weight: 900;
    font-size: 18px;
    line-height: 18px;
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

  .mobile-header-dropdown-list-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 32px;
  }

  .header__dropdown-list-links-image-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 32px;
  }

  .header__dropdown-image {
    width: 100%;
    display: block;
  }

  .mobile-header-dropdown-list-image-container {
    display: block;

    @include desktop-up {
      display: none;
    }
  }

  .header__dropdown-lists-images-inner-container {
    margin-bottom: 33px;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-y: hidden;
    position: relative;
    display: flex;
    margin: 0;
    padding-left: 0;
  }

  .header__dropdown-image-link-container {
    display: inline-block;
    list-style: none;
    width: 224px;
    vertical-align: top;
    margin-right: 16px;
  }

  .header__dropdown-image-link-inner-container {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    width: 224px;
  }

  .header__dropdown-image-container {
    margin-bottom: 16px;
  }

  .header-menu-image-title {
    display: flex;
    align-items: center;
    color: $color-brand-primary;
  }

  .menu-image-link-arrow {
    margin-left: 4px;
    fill: $color-brand-primary;
  }

   .header__menu-main-inner-link {
    margin-top: 32px;
  }

</style>
