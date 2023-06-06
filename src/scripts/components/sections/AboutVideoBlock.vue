<template lang="pug">
  .about-video-outer-container(:class="block.section_bg_color")
    .about-inner-video-content-container
      .about-text-video-content-container
        .about-video-text-container
          .preheader.about-video-preheader(v-if="block.preheader.length > 0", :class="block.pre_heading_color") {{ block.preheader }}
          .about-video-header.h3(v-if="block.header.length > 0", :class="block.heading_color") {{ block.header }}
          .body-md.about-video-copy(v-if="block.body_copy.length > 0", , :class="block.body_copy_color") {{ block.body_copy }}
      .about-video-container
        iframe.about-video-frame( :src="`https://www.youtube.com/embed/${block.video_id}`" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen )
      v-button.hero-banner__cta(v-if="block.cta_layout.includes('button') && block.cta_title.length > 0" tag="a" :href='block.cta_link' :class="block.cta_layout") {{ block.cta_title }}
      v-link.hero-banner__cta(v-if="block.cta_layout.includes('link') && block.cta_title.length > 0" :href='block.cta_link' :class="block.cta_layout" tag="a") {{ block.cta_title }}
</template>

<script>
  import VButton from 'scripts/components/buttons/VButton.vue'
  import VLink from 'scripts/components/buttons/VLink.vue'

  export default {
    name: 'AboutVideoBlock',
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
  .video-callout-container,
  .about-inner-video-content-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-left: 0;
    padding-right: 0;
  }

  .video.responsive,
  .about-video-container {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;
    .vimeo-frame,
    .about-video-frame {
      position:absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
    }
  }

  .about-video-container {
    margin: 32px auto;
    width: 100%;
    height: 100%;
    min-height: 52vw;
    @include tablet-up {
      max-width: 1088px;
      min-height: 43vw;
    }
  }

  .about-video-outer-container {
    padding-top: 48px;
    padding-bottom: 48px;
  }

  .about-text-video-content-container {
    display: flex;
    flex-direction: column-reverse;

    @include desktop-up {
      flex-direction: column;
    }
  }

  .about-inner-video-content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
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
  .about-video-text-container {
    text-align: center;
    max-width: 1088px;
    margin: 0 auto;
  }

  .about-video-preheader {
    margin-bottom: 16px;
  }

  .about-video-header {
    margin-bottom: 16px;
  }

  .about-video-copy {
    margin-bottom: 16px;

    @include desktop-up {
      margin-bottom: 0;
    }
  }
  
</style>