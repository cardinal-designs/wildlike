<template lang="pug">
  .about-three-columns-main-container(:class="block.section_bg_color")
    .about-three-columns-inner-container(:class="[block.desktop_layout, block.layoutHorizontal]")
      .about-three-columns-header-container
        .about-three-column-header.h2(v-if="block.header.length > 0", :class="block.section_heading_color") {{ block.header }}
        .about-three-column-subheader.subheader(v-if="block.subheader.length > 0", :class="block.section_sub_heading_color") {{ block.subheader }}
      .about-three-columns-content-container
        .about-three-column-single-container(v-if="block.block_image_1.length > 0")
          .about-outer-column-image-container
            .about-three-column-single-image-container(:style="{ 'background-image': `url(${block.block_image_1})` }")
          .about-three-column-single-text-container
            .h4.about-three-column-single-header(v-if="block.block_text_1.length > 0", :class="block.block_heading_color") {{ block.block_text_1 }}
            .body-md-mobile.body-md-tablet-up.about-three-column-single-copy(v-if="block.block_body_copy_1.length > 0", :class="block.block_text_color") {{ block.block_body_copy_1 }}
            v-button.hero-banner__cta.about-three-column-cta(v-if="block.cta_layout.includes('button') && block.block_cta_title_1.length > 0" :href='block.block_cta_link_1' :class="block.cta_layout" tag="a") {{block.block_cta_title_1}}
            v-link.hero-banner__cta.about-three-column-cta(v-if="block.cta_layout.includes('link') && block.block_cta_title_1.length > 0" :href='block.block_cta_link_1' :class="block.cta_layout") {{block.block_cta_title_1}}
        .about-three-column-single-container(v-if="block.block_image_2.length > 0")
          .about-outer-column-image-container
            .about-three-column-single-image-container(:style="{ 'background-image': `url(${block.block_image_2})` }")
          .about-three-column-single-text-container
            .h4.about-three-column-single-header(v-if="block.block_text_2.length > 0", :class="block.block_heading_color") {{ block.block_text_2 }}
            .body-md-mobile.body-md-tablet-up.about-three-column-single-copy(v-if="block.block_body_copy_2.length > 0", :class="block.block_text_color") {{ block.block_body_copy_2 }}
            v-button.hero-banner__cta.about-three-column-cta(v-if="block.cta_layout.includes('button') && block.block_cta_title_2.length > 0" :href='block.block_cta_link_2' :class="block.cta_layout" tag="a") {{block.block_cta_title_2}}
            v-link.hero-banner__cta.about-three-column-cta(v-if="block.cta_layout.includes('link') && block.block_cta_title_2.length > 0" :href='block.block_cta_link_2' :class="block.cta_layout") {{block.block_cta_title_2}}   
        .about-three-column-single-container(v-if="block.block_image_3.length > 0")
          .about-outer-column-image-container
            .about-three-column-single-image-container(:style="{ 'background-image': `url(${block.block_image_3})` }")
          .about-three-column-single-text-container
            h4.about-three-column-single-header(v-if="block.block_text_3.length > 0", :class="block.block_heading_color") {{ block.block_text_3 }}
            .body-md-mobile.body-md-tablet-up.about-three-column-single-copy(v-if="block.block_body_copy_3.length > 0", :class="block.block_text_color") {{ block.block_body_copy_3 }}
            v-button.hero-banner__cta.about-three-column-cta(v-if="block.cta_layout.includes('button') && block.block_cta_title_3.length > 0" :href='block.block_cta_link_3' :class="block.cta_layout" tag="a") {{block.block_cta_title_3}}
            v-link.hero-banner__cta.about-three-column-cta(v-if="block.cta_layout.includes('link') && block.block_cta_title_3.length > 0" :href='block.block_cta_link_3' :class="block.cta_layout") {{block.block_cta_title_3}}
</template>

<script>
  import VButton from 'scripts/components/buttons/VButton.vue'
  import VLink from 'scripts/components/buttons/VLink.vue'

  export default {
    name: 'AboutThreeColumnBlock',
    components: {
      VButton,
      VLink
    },
    props: {
      block: Object
    }
  }
</script>

<style scoped lang="scss">
  .about-three-columns-main-container {
    padding-top: 48px;
    padding-bottom: 48px;
  }

  .about-three-columns-inner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-right: 16px;
    padding-left: 16px;

    @include desktop-up {
      max-width: $container-max-width;
      margin-left: auto;
      margin-right: auto;
      padding-left: 30px;
      padding-right: 30px;
    }
  }

  .about-three-column-single-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    max-width: 416px;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 0;
    margin-bottom: 32px;

    @include desktop-up {
      max-width: 416px;
    }
  }

  .about-three-column-single-copy {
    font-size: 12px;
    line-height: 20px;
    max-width: 416px;

    @include desktop-up {
      font-size: 16px;
      line-height: 22px;  
      max-width: 290px;
    }

    @media screen and (min-width: 1200px) {
      max-width: 416px;
    }
  }

  .about-three-column-single-container:last-child {
    margin-bottom: 0;

    @include desktop-up {
      margin-bottom: 16px;
    }
  }

  .about-three-column-single-image-container {
    margin-bottom: 16px;
  }

  .left-aligned {

    @include desktop-up {
      align-items: flex-start;
      justify-content: flex-start;

      .about-three-column-single-text-container {
        max-width: 290px;
        padding-left: 32px;
        word-break: break-all;
      }
    }

    .about-three-columns-content-container {
      @include desktop-up {
        align-items: flex-start;
      }
    }

    .about-three-columns-header-container {

      @include desktop-up {
        text-align: left;
      }
    }

    .about-three-column-single-container {

      @include desktop-up {
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        text-align: left;
        margin-top: 0;
        margin-right: 16px;
        margin-bottom: 0;
      }
    }

    .about-three-column-single-image-container {

      @include desktop-up {
        width: 84px;
        height: 84px;
        flex-direction: row;
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    .about-three-column-single-copy {
      @include desktop-up {
        margin-bottom: 16px;
        max-width: 290px;
      }
    }

    .about-three-column-cta {

      @include desktop-up {
        margin-top: 0;
      }
    }
  }

  .stacked.left {
    
    @include desktop-up {
      align-items: flex-start;
      width: 100%;

      .about-three-column-single-image-container {
        margin-right: 32px;
      }

       .about-three-columns-header-container {
        text-align: left;
       }

      .about-three-column-single-container {
        margin-right: 32px;
        margin-left: 0;
        max-width: 416px;
        width: 33.3%;
        align-items: flex-start;
        justify-content: flex-start;
        text-align: left;
      }

      .about-three-columns-content-container {
        align-items: flex-start;
      }

      .about-three-column-single-image-container {
        margin-bottom: 16px;
        margin-right: 0;
      }
    }
  }

  .stacked.center {
    
    @include desktop-up {
      .about-three-column-single-container {
        padding-right: 16px;
        padding-left: 16px;
      }
    }
  }

  .about-three-columns-content-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;

    @include desktop-up {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
  }

  .about-three-column-single-image-container {
    width: 140px;
    height: 140px;
    background-size: cover;

    @include desktop-up {
      width: 200px;
      height: 200px;
    }
  }

  .about-three-columns-header-container {
    margin-bottom: 32px;
    text-align: center;

    @include desktop-up {
      margin-bottom: 40px;
    }
  }

  .about-three-column-header {
    margin-bottom: 16px;
  }

  .about-three-column-single-header {
    margin-bottom: 8px;
  }

  .about-three-column-cta {
    margin-top: 16px;
    text-align: center;
    padding: 0;
  }
  
</style>