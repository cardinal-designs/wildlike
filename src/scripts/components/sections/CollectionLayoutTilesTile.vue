<template lang="pug">
  div.hpc-tile(
      :class="settings.showTextOnHover ? 'hpc-tile--show-text-on-hover' : ''"
    )
    a.hpc-tile__inner(:href="block.settings.tile_cta_link")
      .hpc-tile__inner-image(:style="{ 'background-image': `url(${block.settings.tile_image})` }")
      .title-container.fade-in-up-group
        h3.hpc-tile__title.col-12-sm.col-8(
          :class="settings.headerColor"
          :style="{ 'color': settings.headerColor }"
        )
          | {{ block.settings.tile_header }}
</template>

<script>
import truncateHTML from 'truncate-html';
import VButton from '../buttons/VButton.vue';
import VLink from '../buttons/VLink.vue';
import { imageSize } from '../../helpers/util';

export default {
  name: "CollectionLayoutTilesTile",
  components: {
    VButton,
    VLink
  },
  props: {
    block: Object,
    settings: {
      type: Object,
      default: Object,
    },
  },
  methods: {
    truncateHTML
  }
}
</script>

<style lang="scss">
  .hpc-tile {
    padding: 0 0 16px 0;

    &__inner {
      display: block;
      height: 100%;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      position: relative;
    }

    &__description {
      display: none;
      margin-bottom: 12px !important;

      blockquote, dd, div, dl, dt, figcaption, figure, hr, li, main, ol, p, pre, ul, strong {
        color: inherit;
      }
    }

    .row {
      margin-bottom: 8px;
    }

    &__overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }


    // small tiles
  .hpc-tile--config-5.hpc-tile--number-3,
  .hpc-tile--config-5.hpc-tile--number-4,
  .hpc-tile--config-5.hpc-tile--number-5,
  .hpc-tile--config-3.hpc-tile--number-2,
  .hpc-tile--config-3.hpc-tile--number-3 {
    .hpc-tile__description {
      width: 100%;
    }

    .hpc-tile__title { // h4
      @include h4-mobile;
    }
  }


  // big tiles
  .hpc-tile--config-5.hpc-tile--number-2,
  .hpc-tile--config-5.hpc-tile--number-1,
  .hpc-tile--config-3.hpc-tile--number-1,
  .hpc-tile--config-2.hpc-tile--number-1,
  .hpc-tile--config-2.hpc-tile--number-2 {
    .hpc-tile__title { // h3
      @include h3-mobile;
    }
  }

  @include desktop-up {
    .hpc-tile {
      padding: 12px;
    }

    .hpc-tile__inner {
      overflow: hidden;
    }

    .hpc-tile__description {
      display: block;
    }

    .hpc-tile--show-text-on-hover {
      .fade-in-up-group {
        visibility: hidden;
        opacity: 0;
        transition: opacity .4s ease-in-out !important;
      }
    }

    .hpc-tile--show-text-on-hover:hover,
    .hpc-tile--show-text-on-hover:focus {
      .fade-in-up-group {
        visibility: visible;
        opacity: 1;
      }
    }

    // small tiles
    .hpc-tile--config-5.hpc-tile--number-3,
    .hpc-tile--config-5.hpc-tile--number-4,
    .hpc-tile--config-5.hpc-tile--number-5,
    .hpc-tile--config-3.hpc-tile--number-2,
    .hpc-tile--config-3.hpc-tile--number-3 {
      .hpc-tile__title { // h5
        @include h5-tablet;
      }
    }

    // big tiles
    .hpc-tile--config-5.hpc-tile--number-2,
    .hpc-tile--config-5.hpc-tile--number-1,
    .hpc-tile--config-3.hpc-tile--number-1,
    .hpc-tile--config-2.hpc-tile--number-1,
    .hpc-tile--config-2.hpc-tile--number-2 {
      .hpc-tile__title { // h4
        @include h4-tablet;
      }

      .button, .link {
        display: inline-block;
      }
    }

    .hpc-tile--config-5.hpc-tile--number-2,
    .hpc-tile--config-5.hpc-tile--number-1,
    .hpc-tile--config-3.hpc-tile--number-1 {
      padding-left: 0;
      padding-top: 0;
    }

    // small tiles
    .hpc-tile--config-5.hpc-tile--number-3,
    .hpc-tile--config-5.hpc-tile--number-4,
    .hpc-tile--config-5.hpc-tile--number-5,
    .hpc-tile--config-3.hpc-tile--number-2,
    .hpc-tile--config-3.hpc-tile--number-3 {
      padding-top: 0;
      padding-right: 0;
      padding-left: 0;
    }

    .hpc-tile--config-5.hpc-tile--number-5,
    .hpc-tile--config-3.hpc-tile--number-1,
    .hpc-tile--config-3.hpc-tile--number-3 {
      padding-bottom: 0;
    }

    .hpc-tile--config-5.hpc-tile--number-3,
    .hpc-tile--config-5.hpc-tile--number-4,
    .hpc-tile--config-5.hpc-tile--number-5,
    .hpc-tile--config-3.hpc-tile--number-2,
    .hpc-tile--config-3.hpc-tile--number-3 {
      .button, .link {
        display: inline-block;
      }
    }

    @include desktop-up {
      .hpc-tile {
        padding: 36px;
      }

      .hpc-tile__inner {
        //padding: 40px;
        position: relative;
      }
    }
  }
  .title-container {
    position: absolute;
    top: 32px;
    left: 0px;
    padding: 12px 24px 16px;
    background-color: rgba(250, 250, 250, 0.8);
  }
  
  .hpc-tile.hpc-tile--config-3.hpc-tile--number-2 {
    padding-bottom: 25px;
  }
  .hpc-tile.hpc-tile--config-5.hpc-tile--number-3,
  .hpc-tile.hpc-tile--config-5.hpc-tile--number-4 {
    padding-bottom: 30px;
  }

  .hpc-tile__inner {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  
  .hpc-tile__inner-image {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: all 0.8s;
    &:hover {
      @include desktop-only {
        transform: scale(1.2);
      }
    }
  }

  .hpc-tile--config-2 .hpc-tile__inner-image {
    &:hover {
      transform: scale(1);
    }
  }

</style>