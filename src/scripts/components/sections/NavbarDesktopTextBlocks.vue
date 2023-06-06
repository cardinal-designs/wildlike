<template lang="pug">
  .header__dropdown-container
    .header__dropdown-container-inner
      .header__dropdown-container-inner-text-blocks-links-container
        .header__dropdown-side-list(v-if="block.featured_link_list_active")
          ul.header__dropdown-list(v-for="(link, index) in block.featured_link_list")
            li(v-if="block.title")
              a.header__dropdown-list-title.header__dropdown-featured-link.link.link--primary.h5(:href="link.url") {{ link.title }}
        .header__dropdown-lists-outer-container
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
</template>

<script>
  export default {
    name: 'NavbarDesktopTextBlocks',
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
      background-color: $color-white;
      z-index: 1;
      padding-top: 40px;
      padding-bottom: 80px;
      display: none;
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
      padding-left: 30px;
      padding-right: 30px;
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

  .header__dropdown-featured-link {
    display: flex;
    margin-bottom: 24px;
    font-size: 16px;
    line-height: 22px;
  }

  .header__dropdown-list {

    @include desktop-up {
      max-width: 192px;
      margin-right: 32px;
      width: 100%;
    }
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

    &:hover {

      &::before {
        background-color: $color-black-900;
      }
    }

    &::before {
      background-color: $color-black-900;
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
    transform: translateY(-1px);

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

  .header__dropdown-container-inner-text-blocks-links-container {
    width: 100%;
    display: flex;
  }

</style>
