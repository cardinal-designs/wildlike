<template lang="pug">
  div.media-preview(v-on="$listeners")
    placeholder
      svg(slot="placeholder" viewBox="0 0 300 300" width="100%" height="100%")
        rect(x="0" y="0" width="100%" height="100%")
      template(slot='main')
        img(:src="imageCrop(imageSize(media.preview_image.src, size || '160x160'), 'center')", :alt="getProductImageAlt(media)")
</template>

<script>
import Placeholder from './Placeholder.vue';

/**
 * A image or video element representing the provided Shopify Media object
 * 
 * @module MediaPreview
 */
import { imageSize, imageCrop, getProductImageAlt } from '../../helpers/util';

export default {
  name: 'MediaPreview',
  components: {
    Placeholder
  },
  methods: {
    imageSize,
    imageCrop,
    getProductImageAlt
  },
  props: {
    /** @type {ShopifyMedia} */
    media: Object,

    /** @type {String} */
    size: String
  }
}
</script>

<style lang="scss">
  .media-preview img {
    max-width: 100%;
  }

  .media-preview svg {
    fill: $color-white;
    animation: fade .75s ease-in alternate infinite;
  }

  @keyframes fade {
    from {
      opacity: .5;
    }

    to {
      opacity: 1;
    }
  }
</style>