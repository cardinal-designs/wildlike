<template lang="pug">
  div.media(v-on="$listeners")
    placeholder
      svg(slot="placeholder" viewBox="0 0 300 300" width="100%" height="100%")
        rect(x="0" y="0" width="100%" height="100%")
      template(slot='main')
        slot(:name="media.media_type")
          img(
            v-if="media.media_type === 'image'"
            :src="media.src"
            :alt="media.alt"
          )
          video(
            v-else-if="media.media_type === 'video'"
            controls
          )
            source(
              v-for="source in media.sources"
              :src="source.url"
              :type="source.mime_type"
            )
</template>

<script>
import Placeholder from './Placeholder.vue';
/**
 * A image or video element representing the provided Shopify Media object
 * 
 * @module Media
 */
export default {
  name: 'Media',
  components: {
    Placeholder
  },
  props: {
    /** @type {ShopifyMedia} */
    media: Object
  }
}
</script>

<style lang="scss" scoped>
  .media,
  .media video {
    max-width: 100%;

    @media screen and (max-width: 500px) {
      min-height: 500px;
    }
  }

  .media svg {
    fill: $color-white;
    animation: fade 1s linear alternate infinite;
  }

  @keyframes fade {
    from {
      opacity: .3;
    }

    to {
      opacity: 1;
    }
  }
</style>