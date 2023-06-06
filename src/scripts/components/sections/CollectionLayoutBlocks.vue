<template lang="pug">
  div(:class="[schema.settings.backgroundColor]" :style="paddingStyles")
    .hpc-blocks-container
      div.hpc-blocks(:class="[`hpc-blocks--block-count-${schema.blocks.length}`]")
        section.hpc-blocks__block.clip-transition(
          :class="[schema.settings.textAlignment]"
          v-for="block in schema.blocks"
        )
          a.hpc-blocks__image-wrapper(
            v-if="!$browserDetect.isIE"
            :href="block.settings.block_link_url"
            :aria-label="block.settings.block_link_text"
          )
            img(
              :src="block.settings.block_image"
              :srcset="`${imageCrop(imageSize(block.settings.block_image, '376x'), 'center')} 376w, ${imageCrop(imageSize(block.settings.block_image, '952x'), 'center')} 952w, ${imageCrop(imageSize(block.settings.block_image, '1312x'), 'center')} 1312w`"
              :alt="block.alt || block.settings.block_header"
              role="presentation"
            )
            span.badge(:class="$store.state.badgeColorMap[block.settings.block_badge]") {{ block.settings.block_badge }}
          a.hpc-blocks__image-wrapper.ie(
            v-if="$browserDetect.isIE"
            :href="block.settings.block_link_url"
            :aria-label="block.settings.block_link_text"
            :style="`backgroundImage: url(${block.settings.block_image})`"
            :alt="block.alt"
            role="presentation"
          )
            span.badge(:class="$store.state.badgeColorMap[block.settings.block_badge]") {{ block.settings.block_badge }}
          div.row.hpc-blocks__block-content
            h3.h3-mobile.col-12-sm.hpc-blocks__header(:class="[schema.settings.textColor, headingTagMap[schema.blocks.length]]") {{ block.settings.block_header }}
            div.col-12-sm.client-generated.body-sm-mobile.body-md-tablet-up(:class="[schema.settings.textColor]" v-html="block.settings.block_description")
            v-link(
              primary,
              :href="block.settings.block_link_url"
              v-if="block.settings.block_link_url && block.settings.block_link_text"
            ) {{ block.settings.block_link_text }}
</template>

<script>
import VLink from '../buttons/VLink.vue'
import { imageSize, imageCrop, checkUndefined } from '../../helpers/util';
import { px } from 'scripts/filters/string.js'

export default {
  name: "CollectionLayoutBlocks",
  components: {
    VLink
  },
  data() {
    return {
      // map how many blocks the client wants to the size of the header
      headingTagMap: {
        1: 'h3-tablet-up',
        2: 'h4-tablet-up',
        3: 'h5-tablet-up'
      }
    }
  },
  props: {
    schema: Object,
  },
  computed: {
    paddingStyles() {
      return {
        'padding-top': px(checkUndefined(this.schema.settings.marginTop, 56)), 
        'padding-bottom': px(checkUndefined(this.schema.settings.marginBottom, 56))
      }
    }
  },
  methods: {
    imageSize,
    imageCrop,
  },
}
</script>

<style lang="scss">
.hpc-blocks {
  display: flex;
  flex-direction: column;
  max-width: ($container-max-width + (16px * 2));
  margin: 0 auto;
  width: 100%;

  .badge {
    left: 12px;
    top: 0;
    transform: translateY(-50%);
  }

  &__block {
    position: relative;
    margin-bottom: 24px;
    width: 100%;
  }

  &__block-content {
    padding: 0 13px;
  }

  &__image-wrapper {
    display: inline-block;
    margin-bottom: 16px;
    width: 100%;
    &.ie {
      height: 400px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
  }

  &__block img {
    width: 100%;
    clip-path: inset(0%);
    transition: clip-path .2s ease-in;
    display: relative;
    object-fit: cover;
  }

  &__block:last-child {
    margin-bottom: 0;
  }

  // if object fit ISN'T supported(I'm looking at you IE11), let the the height of the image scale with the continer width
  @supports(object-fit: cover) {
    &__block img {
      min-height: 326px;
      max-height: 326px;
    }
  }

  &__header {
    margin-bottom: 4px !important;
  }
  
  @include tablet-up {
    flex-direction: row;
    flex-wrap: nowrap;
    padding-left: 4px;
    padding-right: 4px;

    .badge {
      left: 28px;
    }

    &__block-content {
      padding: 0;
    }

    &__block {
      margin: 0 12px;
      margin-bottom: 0;
    }

    @supports(object-fit: cover) {
      &__block img {
        min-height: 326px;
        max-height: 326px;
      }
    }
  }
    
  @include desktop-up {
    &__block {
      margin: 0 16px;
    }
  }

  @include max-width-up {
    padding-left: 0;
    padding-right: 0;

    @supports(object-fit: cover) {
      &__block img {
        min-height: 326px;
        max-height: 326px;
      }
    }
  }
}

@include tablet-up {
  .hpc-blocks--block-count-1 .hpc-blocks .hpc-blocks__block {
    margin: 0;
  }
}

.hpc-blocks-container {
  display: flex;
}
</style>