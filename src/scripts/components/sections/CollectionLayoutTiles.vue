<template lang="pug">
  div(
      :style="{ 'background-color': schema.settings.backgroundColor }"
    )
    section.hpc-tiles(:style="paddingStyles")  
      div.hpc__main.container.row
        div.col-12-sm.col-7(
          v-if="tileCount !== 2"
        )
          collection-layout-tiles-tile(
            v-for="(block, i) in filteredBlocks.slice(0, slicePoint)"
            :key="block.id",
            :block="block"
            :settings="schema.settings"
            :class="[`hpc-tile--config-${tileCount}`, `hpc-tile--number-${i + 1}`]"
          )
        div.col-12-sm.col-5(
          v-if="filteredBlocks.slice(slicePoint, 5).length && tileCount !== 2"
        )
          collection-layout-tiles-tile(
            v-for="(block, i) in filteredBlocks.slice(slicePoint, 5)"
            :key="block.id",
            :block="block"
            :settings="schema.settings"
            :class="[`hpc-tile--config-${tileCount}`, `hpc-tile--number-${i + slicePoint + 1}`]"
          )
        collection-layout-tiles-tile(
          v-for="(block, i) in filteredBlocks"
          v-if="tileCount === 2"
          :key="block.id",
          :block="block"
          :settings="schema.settings"
          :class="[`hpc-tile--config-${tileCount}`, `hpc-tile--number-${i + 1}`, 'col-12-sm', 'col-6']"
        )
</template>

<script>
import CollectionLayoutTilesTile from './CollectionLayoutTilesTile.vue';
import { px } from 'scripts/filters/string.js'
import { checkUndefined } from 'scripts/helpers/util.js';

export default {
  name: "CollectionLayoutTiles",
  components: {
    CollectionLayoutTilesTile
  },
  props: {
    schema: Object,
  },
  computed: {
    tileCount () {
      if(this.schema.blocks.length === 4) {
        return 3
      }
      return window.parseInt(this.schema.settings.numberOfTiles);
    },
    filteredBlocks () {
      if(this.schema.blocks.length === 4) {
        return this.schema.blocks.slice(0, 3);
      }
      
      return this.schema.blocks.slice(0, this.tileCount);
    },
    slicePoint () {
      return this.tileCount === 3 ? 1 : 2;
    },
    paddingStyles() {
      return {
        'padding-top': px(checkUndefined(this.schema.settings.marginTop, 56)), 
        'padding-bottom': px(checkUndefined(this.schema.settings.marginBottom, 56))
      }
    }
  }
}
</script>

<style lang="scss">
  .hpc-tiles {
    [class*="col-"] {
      padding: 0;
      margin: 0;
    }

    &__section-header {
      margin-bottom: 24px;
    }

    .hpc-tile--config-2.hpc-tile--number-1 {
      padding-bottom: 16px;
    }

    // heights ---------------------------------
    .hpc-tile .hpc-tile__inner {
      height: 180px;
      max-height: 180px;
      @include mobile-only {
        height: 240px;
        max-height: 240px;
      }
    }

    .hpc-tile--config-5.hpc-tile--number-2 .hpc-tile__inner,
    .hpc-tile--config-5.hpc-tile--number-1 .hpc-tile__inner,
    .hpc-tile--config-3.hpc-tile--number-1 .hpc-tile__inner,
    .hpc-tile--config-2.hpc-tile--number-1 .hpc-tile__inner,
    .hpc-tile--config-2.hpc-tile--number-2 .hpc-tile__inner {
      height: 320px;
      max-height: 320px;
      @include mobile-only {
        height: 240px;
        max-height: 240px;
      }
    }

    @include mobile-only {
      .col-12-sm:last-child .hpc-tile:last-child {
        padding-bottom: 0;
      }
    }

    @include desktop-up {
      &__section-header {
        margin-bottom: 56px;
      }

      // heights ---------------------------------
      .hpc-tile--config-5.hpc-tile--number-1 .hpc-tile__inner,
      .hpc-tile--config-5.hpc-tile--number-2 .hpc-tile__inner,
      .hpc-tile--config-3.hpc-tile--number-1 .hpc-tile__inner {
        height: 468px;
        max-height: 468px;
      }


      .hpc-tile--config-3.hpc-tile--number-2 .hpc-tile__inner,
      .hpc-tile--config-3.hpc-tile--number-3 .hpc-tile__inner {
        height: 314px;
        max-height: 314px;
      }

      .hpc-tile--config-5.hpc-tile--number-3 .hpc-tile__inner,
      .hpc-tile--config-5.hpc-tile--number-4 .hpc-tile__inner,
      .hpc-tile--config-5.hpc-tile--number-5 .hpc-tile__inner {
        height: 308px;
        max-height: 308px;
      }

      .hpc-tile--config-3.hpc-tile--number-1 .hpc-tile__inner {
        height: 640px;
        max-height: 640px;
      }

      .hpc-tile--config-2.hpc-tile--number-1 .hpc-tile__inner,
      .hpc-tile--config-2.hpc-tile--number-2 .hpc-tile__inner {
        height: 320px;
        max-height: 320px;
      }


      // padding ---------------------------------
      .hpc-tile--config-5.hpc-tile--number-2 {
        padding-bottom: 0;
      }

      .hpc-tile--config-2.hpc-tile--number-1,
      .hpc-tile--config-2.hpc-tile--number-2 {
        padding-bottom: 0;

        &:first-child {
          padding-right: 18px;
        }

        &:last-child {
          padding-left: 18px;
        }
      }
    }
    
    @include desktop-up {
      // height ---------------------------------
      // small tiles
      .hpc-tile--config-5.hpc-tile--number-3 .hpc-tile__inner,
      .hpc-tile--config-5.hpc-tile--number-4 .hpc-tile__inner,
      .hpc-tile--config-5.hpc-tile--number-5 .hpc-tile__inner,
      .hpc-tile--config-3.hpc-tile--number-2 .hpc-tile__inner,
      .hpc-tile--config-3.hpc-tile--number-3 .hpc-tile__inner {
        height: 304px;
        max-height: 304px;
      }

      .hpc-tile--config-3.hpc-tile--number-2 .hpc-tile__inner,
      .hpc-tile--config-3.hpc-tile--number-3 .hpc-tile__inner {
        height: 308px;
        max-height: 308px;
      }
    }
  }

  @include mobile-only {
    .hpc-tiles .hpc-tile--config-3.hpc-tile--number-1 .hpc-tile__inner,
    .hpc-tiles .hpc-tile--config-5.hpc-tile--number-1 .hpc-tile__inner,
    .hpc-tiles .hpc-tile--config-5.hpc-tile--number-2 .hpc-tile__inner {
      max-height: 343px;
      height: 343px;
    }
  }

</style>