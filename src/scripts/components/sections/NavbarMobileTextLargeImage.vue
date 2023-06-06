<template lang="pug">
  .header__dropdown-container-inner
    .header__dropdown-container-links-large-image-container(v-if="block.link_list_active")
      .header__dropdown-container-inner-featured-menu-links-container
        .header__dropdown-side-list(v-if="block.featured_link_list_active")
          ul.header__dropdown-list(v-for="(link, index) in block.featured_link_list")
            li(v-if="block.title")
              a.header__dropdown-featured-link(:href="link.url") {{ link.title }}
                icon.mobile-header-menu-image-link-arrow(name="arrow_long_right", size="24px")
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
      .header__dropdown-images--large-image-inner-container
        .header__dropdown-images-large-image.clip-transition
          img.header__dropdown-large-image(:src="block.large_image", :alt="block.large_image_title")
        .header__dropdown-images--large-image-description-container
          p.header__dropdown-images--large-image-title(v-if="block.large_image_title") {{ block.large_image_title}}
          div.header__dropdown-images--large-image-description(v-if="block.large_image_description", v-html="block.large_image_description") {{ block.large_image_description }}
          a.header__dropdown-images--large-image-link(v-if="block.large_image_link", :href="block.large_image_link") {{ block.large_image_link_text }}
            icon.menu-image-link-arrow.fill-brand-primary(name="arrow_long_right" size="24px")
    .header__dropdown-images--large-image-container(v-else)
      .header__dropdown-images--large-image-inner-container
        .header__dropdown-images-large-image.clip-transition
          img.header__dropdown-large-image(:src="block.large_image", :alt="block.large_image_title")
        .header__dropdown-images--large-image-description-container
          p.header__dropdown-images--large-image-title(v-if="block.large_image_title") {{ block.large_image_title}}
          div.header__dropdown-images--large-image-description(v-if="block.large_image_description", v-html="block.large_image_description") {{ block.large_image_description }}
          a.header__dropdown-images--large-image-link(v-if="block.large_image_link", :href="block.large_image_link") {{ block.large_image_link_text }}
            icon.menu-image-link-arrow.fill-brand-primary(name="arrow_long_right" size="24px")
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
    name: 'NavbarMobileTextLargeImage',
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

    @include desktop-up {
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }
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

  .header__dropdown-list,
  .header__dropdown-list ul {
    padding-left: 0;
    list-style: none;
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
    font-family: $font-family-secondary;
  }

  .header__dropdown-container-inner-featured-menu-links-container {

    @include desktop-up {
      width: 50%;
      display: flex;
    }
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

  .header__dropdown-list,
  .header__dropdown-list ul {
    padding-left: 0;
    list-style: none;
  }

  .header__dropdown-list-title {
    display: block;
    margin-bottom: 16px;
    color: $color-black-900;
    font-family: $font-family-primary;
    font-weight: 900;
  }

  .header__dropdown-link {
    display: block;
    margin-bottom: 12px;
    color: $color-black-900;
  }

  .header__dropdown-image {
    width: 100%;
    display: block;
  }

  .mobile-header-dropdown-list-image-container {
    display: block;
  }

  .mobile-header-dropdown-list-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 32px;
  }

  .header__dropdown-images--large-image-inner-container {
    max-width: 304px;
  }

  .header__dropdown-large-image {
    display: block;
    width: 100%;
  }

  .header__dropdown-images--large-image-title {
    margin: 0;
    padding-top: 24px;
    padding-bottom: 16px;
    font-size: 18px;
    font-family: $font-family-primary;
    font-weight: 700;
  }

  .header__dropdown-images-large-image {
    max-width: 224px;
  }

  .header__dropdown-images--large-image-description {
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 16px;
  }

  .header__dropdown-images--large-image-description a {
    color: $color-brand-primary;
  }

  .header__dropdown-images--large-image-description p {
    font-size: 16px;
    line-height: 22px;
    padding: 0;
    margin: 0;
  }

  .header__dropdown-images--large-image-link {
    display: flex;
    cursor: pointer;
    align-items: center;
    color: $color-brand-primary;
    font-weight: 400;
  }

  .header__dropdown-images--large-image-link .menu-image-link-arrow {
    margin-left: 8px;
  }

  .header__dropdown-images--large-image-description-container {
    max-width: 304px;
  }

  .menu-image-link-arrow {
    margin-left: 4px;
    fill: $color-brand-primary;
  }

  .header__menu-main-inner-link {
    margin-top: 32px;
  }

</style>
