<template lang="pug">
  .header__dropdown-container
    .header__dropdown-container-inner
      .header__dropdown-container-inner-links-small-images-container(:class="[{'header__dropdown-container-inner-links--single-column' : block.image_1 && block.image_2 && block.image_3 }]")
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
        .header__dropdown-small-images-container
          .header__dropdown-image-outer-container(v-if="block.image_1")
            a.header__dropdown-image-outer-content-container(v-if="block.image_1_url", :href="block.image_1_url" @mouseover="hover01 = true" @mouseleave="hover01 = false")
              .header__dropdown-image-container.zoom-transition
                img.header__dropdown-image(:src="block.image_1", :alt="block.image_1_text")
              div.header-menu-image-title-container
                p.header-menu-image-title.link.link--primary(v-if="block.image_1_text" :class="{ hoverimage: hover01 }") {{ block.image_1_text }}
            .header__dropdown-image-outer-content-container(v-else)
              .header__dropdown-image-container.zoom-transition
                img.header__dropdown-image(:src="block.image_1", :alt="block.image_1_text")
              p.header-menu-image-title(v-if="block.image_1_text") {{ block.image_1_text }}
          .header__dropdown-image-outer-container(v-if="block.image_2")
            a.header__dropdown-image-outer-content-container(v-if="block.image_2_url", :href="block.image_2_url" @mouseover="hover02 = true" @mouseleave="hover02 = false")
              .header__dropdown-image-container.zoom-transition
                img.header__dropdown-image(:src="block.image_2", :alt="block.image_2_text")
              div.header-menu-image-title-container
                p.header-menu-image-title.link.link--primary(v-if="block.image_2_text" :class="{ hoverimage: hover02 }") {{ block.image_2_text }}
            .header__dropdown-image-outer-content-container(v-else)
              .header__dropdown-image-container.zoom-transition
                img.header__dropdown-image(:src="block.image_2", :alt="block.image_2_text")
              p.header-menu-image-title(v-if="block.image_2_text") {{ block.image_2_text }}
          .header__dropdown-image-outer-container(v-if="block.image_3")
            a.header__dropdown-image-outer-content-container(v-if="block.image_3_url", :href="block.image_3_url" @mouseover="hover03 = true" @mouseleave="hover03 = false")
              .header__dropdown-image-container.zoom-transition
                img.header__dropdown-image(:src="block.image_3", :alt="block.image_3_text")
              div.header-menu-image-title-container
                p.header-menu-image-title.link.link--primary(v-if="block.image_3_text" :class="{ hoverimage: hover03 }") {{ block.image_3_text }}
            .header__dropdown-image-outer-content-container(v-else)
              .header__dropdown-image-container.zoom-transition
                img.header__dropdown-image(:src="block.image_3", :alt="block.image_3_text")
              p.header-menu-image-title(v-if="block.image_3_text") {{ block.image_3_text }}
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'NavbarDesktopSmallImageBlocks',
    components: { Icon },
    data() {
      return {
        hover01: false,
        hover02: false,
        hover03: false,
      };
    },
    props: {
      block: Object
    }
  }
</script>

<style scoped lang="scss">
  .header__dropdown-lists-container {

    @include desktop-up {
      display: flex;
      flex-flow: row;
      height: 264px;
      width: 100%;
      overflow: hidden;
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
      width: 192px;
      margin-right: 32px;
      margin-bottom: 12px;
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
      background-color: $color-black-900;
    }
  }

  .header__dropdown-list-title--margin-bottom-none {
    margin-bottom: 0;
  }

  .header__dropdown-link {
    font-size: 16px;
    margin-bottom: 5px;
    color: $color-black-900;
    font-family: $font-family-secondary;
    line-height: 20px !important;

    &:before {
      background-color: $color-black-900;
      transform: translateY(-1px);
    }
  }

  .header__dropdown-lists-images-inner-container {
    display: flex;
    padding-left: 16px;

    @media screen and (max-width: 1023px) {
      overflow-x: scroll;
      -webkit-overflow-scrolling: touch;
      overflow-y: hidden;
      position: relative;
      margin: 0;
    }
  }

  .header__dropdown-image-link-container {
    display: inline-block;
    list-style: none;
    width: 290px;
    vertical-align: top;
    margin-right: 32px;
  }

  .header-menu-image-title-container {
    text-align: center;
  }

  .header-menu-image-title {
    color: $color-black-900;
    margin: 0;
    margin-top: 4px;
    text-align: center;
    //width: 100%;

    &:before {
      background-color: $color-black-900;
    }
  }

  .header__dropdown-image-link-container:last-child {
    margin-right: 0;
  }

  .header__dropdown-container-inner-featured-menu-links-container {

    @include desktop-up {
      display: flex;
      min-width: 650px;
    }
  }

  .header__dropdown-container-inner-text-blocks-links-container {
    width: 100%;
    display: flex;
  }

  .header__dropdown-lists-outer-container {
    display: flex;
  }

  .header__dropdown-lists-images-container {

    @include desktop-up {
      display: flex;
      justify-content: flex-end;
    }
  }

  .header__dropdown-image-link-inner-container {
    display: flex;
    flex-direction: column;

    @include desktop-up {
      width: auto;
      display: inline-block;
    }
  }

  a .header__dropdown-image-link-inner-container {
    cursor: pointer;
  }

  .header__dropdown-container-inner-links-small-images-container {
    display: flex;
    flex-direction: column;

    @include desktop-up {
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }
  }

  .header__dropdown-container-inner-links--single-column .header__dropdown-container-inner-featured-menu-links-container,
  .header__dropdown-container-inner-links--single-column .header__dropdown-list {
    overflow: hidden;
  }

  .header__dropdown-container-inner-links--single-column .header__dropdown-side-list {
    border-right: 0;
  }

  .header__dropdown-container-inner-links-small-images-container .header__dropdown-container-inner-featured-menu-links-container {

    @include desktop-up {
      display: flex;
      width: 100%;
      max-width: 672px;
    }
  }

  .header__dropdown-container-inner-links-small-images-container .header__dropdown-small-images-container {

    @media screen and (min-width: 1200px) {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  .header__dropdown-inner-small-images-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .header__dropdown-small-images-container {
    display: flex;
    flex-direction: column;
    @include desktop-up {
      flex-direction: row;
      justify-content: center;
    }
  }

  .header__dropdown-small-images-container .header__dropdown-image-container {
    @include desktop-up {
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
  }

  .hoverimage {
    &::before {
      width: 100%;
    }
  }
</style>
