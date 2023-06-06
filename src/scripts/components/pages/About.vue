<template lang="pug">
.about-main-container
  .about-sections-container(
     v-for="(block, index) in blocksWithoutScrollingText",
     :key="index + '_'"
  )
    div(v-if="block.type === 'video'")
      about-video-block(:block="block")
    div(v-if="block.type === 'image_banner'")
      about-image-banner-block(:block="block")
    div(v-if="block.type === 'three_column'")
      about-three-column-block(:block="block")
    div(v-if="block.type === 'press'")
      in-the-press(:schema="block")
    div(v-if="block.type === 'fifty_fifty'")
      fifty-fifty(:schema="block")
    div(v-if="block.type === 'text_only'")
      hero-banner-text(:heroSchema="block")
    div(v-if="block.type === 'scrolling_text'")
      scrolling-text(:blockList="scrollingTextBlocks[block.settings.group]")
</template>

<script>
  import AboutVideoBlock from 'scripts/components/sections/AboutVideoBlock.vue'
  import AboutImageBannerBlock from 'scripts/components/sections/AboutImageBannerBlock.vue'
  import AboutThreeColumnBlock from 'scripts/components/sections/AboutThreeColumnBlock.vue'  
  import InThePress from 'scripts/components/sections/InThePress.vue';
  import FiftyFifty from 'scripts/components/sections/FiftyFifty.vue';
  import HeroBannerText from 'scripts/components/sections/HeroBannerText.vue';
  import ScrollingText from 'scripts/components/basic/ScrollingText.vue';

  export default {
    name: 'About',
    components: { AboutVideoBlock, AboutImageBannerBlock, AboutThreeColumnBlock, InThePress, FiftyFifty, HeroBannerText, ScrollingText },
    computed: {
      blocksWithoutScrollingText() {
        const usedKeys = [];
        const filteredBlocks = [];

        this.blocks.forEach((block) => {
          // Filter out Scrolling Text blocks
          if (block.type === 'scrolling_text') {
            // Leave first block of a group for positioning
            if (usedKeys.indexOf(block.settings.group) >= 0) {
              return;
            }
            usedKeys.push(block.settings.group);
          }
          filteredBlocks.push(block);
        });

        return filteredBlocks;
      },
      scrollingTextBlocks() {
        const filteredBlocks = this.blocks.filter((block) => block.type === 'scrolling_text');
        const scrollingTextObj = {};

        filteredBlocks.forEach((block) => {
          const key = `${block.settings.group}`;

          // Group blocks by key
          scrollingTextObj[key] = scrollingTextObj[key] || [];
          scrollingTextObj[key].push(block);
        });

        return scrollingTextObj;
      }
    },
    props: {
      blocks: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style scoped lang="scss">


</style>