<template lang="pug">
  .header__dropdown-container
    .header__dropdown-container-inner
      .header__dropdown-container-links-large-image-container
        .header__dropdown-container-inner-featured-menu-links-container
          .header__dropdown-side-list(v-if="block.featured_link_list_active")
            ul.header__dropdown-list(v-for="(link, index) in block.featured_link_list")
              li(v-if="block.title")
                a.header__dropdown-list-title.header__dropdown-featured-link.link.link--primary.h5(:href="link.url") {{ link.title }}
          .header__dropdown-lists-container.header__dropdown-list-menu-links-main-container
            ul.header__dropdown-list.header__dropdown-list-menu-links-container(v-for="(link, index) in block.link_list")
              li.header__dropdown-list-links-image-container
                .header-dropdown-list-links-container
                  a.header__dropdown-list-title.link.link--primary.h5(:href="link.url" :class="{'header__dropdown-list-title--margin-bottom-none': !(link.children && link.children.length > 0)}") {{ link.title }}
                  ul(
                    v-for="(child_link, index) in link.children",
                  )
                    li.header__dropdown-list-item
                      a.header__dropdown-link.link.link--primary(:href="child_link.url") {{ child_link.title }}
        .header__dropdown-image-outer-container
          a(:href="block.large_image_link" @mouseover="hover = true" @mouseleave="hover = false")
            .header__dropdown-images-large-image.zoom-transition
              img.header__dropdown-large-image(:src="block.large_image", :alt="block.large_image_title")
          .header-menu-image-title-container
            a.header-menu-image-title.link.link--primary(v-if="block.large_image_link", :href="block.large_image_link" :class="{ hoverimage: hover }") {{ block.large_image_link_text }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'NavbarDesktopTextLargeImage',
    data() {
      return {
        hover: false,
      };
    },
    components: {
      Icon
    },
    props: {
      block: Object
    }
  }
</script>
<style scoped lang="scss">
  .header__dropdown-container {
    background-color: $color-white;

    @include desktop-up {
      position: absolute;
      width: 100%;
      left: 0;
      top: 99%;
      border-bottom: 1px solid #ecece1;
      background-color: #FAFAFA;
      z-index: 1;
      padding-top: 54px;
      padding-bottom: 57px;
      display: none;
    }
  }

  .header__dropdown-featured-link {
    display: flex;
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 22px;

    &:before {
      background: $color-black-900;
    }
  }

  .header__dropdown-lists-container {

    @include desktop-up {
      display: flex;
      flex-flow: row;
      height: 264px;

    }
  }

  .header__dropdown-list-menu-links-container {
    @include desktop-up {
      margin-bottom: 12px;
    }
  }

  .nav-links-dropdown-content-container {

    @include desktop-up {
      display: block;
    }
  }

  .header__dropdown-container-inner {
    display: flex;
    flex-direction: column;
    width: 100%;

    @include desktop-up {
      flex-direction: row;
      justify-content: space-between;
      max-width: $container-max-width;
      margin-left: auto;
      margin-right: auto;
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  .header__dropdown-side-list {
    border-right: 1px solid $color-grey;
    padding-left: 0;
    padding-right: 16px;
    list-style: none;
    margin-right: 31px;
    margin-bottom: 0;
    width: 192px;
  }

  .header__dropdown-side-list .header__dropdown-list {
    margin-bottom: 0;
  }

  .header__dropdown-list {

    @include desktop-up {
      width: 192px;
      margin-right: 25px;
    }
  }

  .header__dropdown-list,
  .header__dropdown-list ul {
    padding-left: 0;
    list-style: none;
    font-size: 16px;
    letter-spacing: 0;
    line-height: 20px;
    margin-bottom: 5px;
  }

  .header__dropdown-list-title {
    margin-bottom: 15px;
    color: $color-black-900;
    font-family: $font-family-primary;
    font-weight: 900;
    font-size: 18px;
    line-height: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;

    &:before {
      background: $color-black-900;
    }
  }

  .header__dropdown-list-title--margin-bottom-none {
    margin-bottom: 0;
  }

  .header__dropdown-link {
    margin-bottom: 8px;
    color: $color-black-900;
    font-weight: 400;
    font-family: $font-family-secondary;

    &:hover {

      &::before {
        background-color: $color-black-900;
      }
    }

    &::before {
      background-color: $color-black-900;
      transform: translateY(-1px);
    }
  }

  .header__dropdown-container-links-large-image-container {
    display: flex;
    flex-direction: column;

    @include desktop-up {
      flex-direction: row;
      justify-content: space-evenly;
      width: 100%;
    }
  }

  .header__dropdown-container-links-large-image-container .header__dropdown-container-inner-featured-menu-links-container {

    @include desktop-up {
      display: flex;
      min-width: 650px;
    }
  }

  .header__dropdown-container-links-large-image-container .header__dropdown-images--large-image-inner-container {
    display: flex;
    flex-direction: column;

    @include desktop-up {
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  .header__dropdown-images-large-image {
    max-width: 224px;
    flex-grow: 2;

    @include desktop-up {
      width: 429px;
      max-width: 100%;
      max-height: 260px;
    }
  }

  .header__dropdown-images-large-image img {
    display: block;
    width: 100%;
  }

  .header__dropdown-image-outer-container {
    margin-right: 32px;
  }

  .header__dropdown-image-outer-container:last-child {
    margin-right: 0;
    width: 30%;
  }

  .header__dropdown-images--large-image-container,
  .header__dropdown-images--large-image-inner-container {

    @include desktop-up {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }

  .header__dropdown-images--large-image-inner-container {

    @include desktop-up {
      display: flex;
    }
  }

  .header__dropdown-images--large-image-title {

    @include desktop-up {
      padding-top: 8px;
      padding-bottom: 16px;
      font-size: 20px;
      margin: 0;
      font-size: 18px;
      font-family: $font-family-primary;
      font-weight: 500;
    }
  }

  .header__dropdown-images--large-image-description {
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 16px;
  }

  .header__dropdown-images--large-image-description a {
    color: $color-brand-primary;
  }

  .header__dropdown-images--large-image-link {
    display: flex;
    cursor: pointer;

    &:hover {

      &::before {
        background-color: $color-brand-primary;
      }

      .menu-image-link-arrow svg {
        fill: $color-brand-primary;
      }
    }

    &:visited {

      .menu-image-link-arrow {
        fill: $color-brand-primary;
      }
    }

    &::before {
      background-color: $color-brand-primary;
    }
  }

  .header__dropdown-images--large-image-link .button--icon,
  .header-menu-image-title .button--icon {
    margin-left: 8px;
  }

  .header__dropdown-images--large-image-description-container {

    @include desktop-up {
      margin-left: 32px;
      max-width: 290px;
    }
  }

  .header-menu-image-title {
    margin-top: 16px;
  }

  .header-menu-image-title,
  .header__dropdown-images--large-image-link {
    margin: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: $color-brand-primary;
    display: inline-block;
    font-weight: 400;
  }

  .menu-image-link-arrow,
  .header-menu-image-title svg {
    fill: $color-brand-primary
  }

  .header-menu-image-title-container {
    text-align: center;
  }

  .header-menu-image-title {
    color: $color-black-900;
    margin: 0;
    margin-top: 4px;
    text-align: center;

    &:before {
      background-color: $color-black-900;
    }
  }

  .hoverimage {
    &::before {
      width: 100%;
    }
  }
</style>
