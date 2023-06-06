<template lang="pug">
  .header__dropdown-container-inner
    .header__dropdown-inner-small-images-container
      .header__dropdown-small-images-container
        .header__dropdown-image-outer-container(v-if="block.image_1")
          a.header__dropdown-image-outer-content-container.clip-transition(v-if="block.image_1_url", :href="block.image_1_url")
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_1", :alt="block.image_1_text")
            .header-menu-image-title(v-if="block.image_1_text")
              p {{ block.image_1_text }}
              icon.menu-image-link-arrow.fill-brand-primary(name="arrow_long_right", size="24px")
          .header__dropdown-image-outer-content-container.clip-transition(v-else)
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_1", :alt="block.image_1_text")
            p.header-menu-image-title(v-if="block.image_1_text") {{ block.image_1_text }}
        .header__dropdown-image-outer-container(v-if="block.image_2")
          a.header__dropdown-image-outer-content-container.clip-transition(v-if="block.image_2_url", :href="block.image_2_url")
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_2", :alt="block.image_2_text")
            .header-menu-image-title(v-if="block.image_2_text")
              p {{ block.image_2_text }}
              icon.menu-image-link-arrow.fill-brand-primary(name="arrow_long_right", size="24px")
          .header__dropdown-image-outer-content-container.clip-transition(v-else)
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_2", :alt="block.image_2_text")
            p.header-menu-image-title(v-if="block.image_2_text") {{ block.image_2_text }}
        .header__dropdown-image-outer-container(v-if="block.image_3")
          a.header__dropdown-image-outer-content-container.clip-transition(v-if="block.image_3_url", :href="block.image_3_url")
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_3", :alt="block.image_3_text")
            .header-menu-image-title(v-if="block.image_3_text")
              p {{ block.image_3_text }}
              icon.menu-image-link-arrow.fill-brand-primary(name="arrow_long_right", size="24px")
          .header__dropdown-image-outer-content-container.clip-transition(v-else)
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_3", :alt="block.image_3_text")
            p.header-menu-image-title(v-if="block.image_3_text") {{ block.image_3_text }}
        .header__dropdown-image-outer-container(v-if="block.image_4")
          a.header__dropdown-image-outer-content-container.clip-transition(v-if="block.image_4_url", :href="block.image_4_url")
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_4", :alt="block.image_4_text")
            .header-menu-image-title(v-if="block.image_4_text")
              p {{ block.image_4_text }}
              icon.menu-image-link-arrow.fill-brand-primary(name="arrow_long_right", size="24px")
          .header__dropdown-image-outer-content-container.clip-transition(v-else)
            .header__dropdown-image-container
              img.header__dropdown-image(:src="block.image_4", :alt="block.image_4_text")
            p.header-menu-image-title(v-if="block.image_4_text") {{ block.image_4_text }}
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
    name: 'NavbarMobileSmallImageBlocks',
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

  .header__dropdown-link {
    display: block;
    margin-bottom: 12px;
    color: $color-black-900;
    font-family: $font-family-secondary;
  }

  .header__dropdown-image {
    width: 100%;
    display: block;
  }

  .header__dropdown-image-container {
    margin-bottom: 16px;
  }

  .header__dropdown-list-links-image-container {
    display: flex;
    flex-direction: row;
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

  .header-menu-image-title {
    display: flex;
    align-items: center;
    color: $color-brand-primary;
  }

  .header-menu-image-title p {
    width: 85%;
  }

  .menu-image-link-arrow {
    margin-left: 4px;
    fill: $color-brand-primary;
  }

  .header__dropdown-small-images-container{
    margin-bottom: 33px;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-y: hidden;
    position: relative;
    display: flex;
    margin: 0;
    padding-left: 0;
  }

  .header__dropdown-image-outer-content-container {
    display: inline-block;
    list-style: none;
    width: 224px;
    vertical-align: top;
    margin-right: 16px;
  }

  .header__dropdown-image-outer-container {
    display: inline-block;
    list-style: none;
    width: 224px;
    vertical-align: top;
    margin-right: 16px;
  }

  .header__menu-main-inner-link {
    margin-top: 32px;
  }

</style>
