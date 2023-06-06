<template lang="pug">
  .scrolling-text.container(
    ref="contentContainer"
  )
    .scrolling-text__text
      div(v-for="(block, index) in blockList" :key="index")
        .scrolling-text__mobile-image
          img(:src="block.settings.imageMobile" :alt="block.settings.imageAlt")
        .scrolling-text__block
          .h3.scrolling-text__header {{block.settings.title}}
          .client-generated.body-md.scrolling-text__content(v-html="block.settings.content")
    .scrolling-text__image-wrapper(
      v-if="!isMobile"
      :class="getContainerClass"
    )
      img.scrolling-text__image(
        :src="getContentImage"
      )
</template>

<script>
  export default {
    name: 'ScrollingText',
    props: {
      blockList: Array,
    },
    data() {
      return {
        images: [],
        imageToDisplay: 0,
        classes: '',
      };
    },
    computed: {
      /**
       * Gets the image to display as the contents sticky image
       *
       * @return {String}: URL of image source
       */
      getContentImage() {
        return this.images[this.imageToDisplay];
      },
      /**
       * Get the classes to add to the sticcky image wrapper based on
       * the position of the page
       *
       * @return {String}: class to use
       */
      getContainerClass() {
        return this.classes;
      },
      /**
       * Checks if the current screen size is either mobile or tablet
       *
       * @return {Boolean}: whether the screen is mobile
       */
      isMobile() {
        return ['mobile'].includes(this.$mq);
      },
      /**
       * Get images from each block
       *
       * @return {Array}: array of images
       */
      imageJson() {
        return this.blockList.map((block) => block.settings.image);
      }
    },
    mounted() {
      this.images = this.imageJson;
      document.addEventListener('scroll', this.setNewImage);
    },
    methods: {
      /**
       * Gets the image to display in the content's sticky image based
       * on how far through the page the customer has scrolled
       *
       * @param {Number} percentScrolled: how much the customer has scrolled past
       *
       * @return {Number}: the index of the image to display
       */
      getImageIndex(percentScrolled) {
        let index = Math.floor(percentScrolled * this.images.length);
        index = Math.max(0, index);
        index = Math.min(this.images.length - 1, index);
        return index;
      },
      /**
       * Calculates the percent of the section the user has scrolled through and
       * sets the image to display from that
       */
      setNewImage() {
        const visibleHeight = window.innerHeight;
        const sectionScrollPos = this.$refs.contentContainer.getBoundingClientRect();
        // use the inverted distance of the section from the top of the screen to calculate
        // the percentage of the section is scrolled through. Offset by half the screen height
        // to keep the images from switching as the relating content is just hitting the viewport
        const percentScrolled = (sectionScrollPos.top * -1 + visibleHeight * 0.5) / sectionScrollPos.height;
        this.imageToDisplay = this.getImageIndex(percentScrolled);
        // calculate if we've scrolled past the content section entirely.
        // can't use percent scrolled - it won't fix at 100%
        const scrolledPast = sectionScrollPos.top + sectionScrollPos.height - visibleHeight;
        // check if the image should be fixed, or stuck to one of the edges
        if (sectionScrollPos.top >= 0) {
          this.classes = '';
        } else if (scrolledPast < 0) {
          this.classes = 'fixed-bottom';
        } else if (sectionScrollPos.top < 0) {
          this.classes = 'fixed';
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .scrolling-text {
    position: relative;
    display: flex;
    overflow: hidden;

    &__text {
      width: 100%;
    }

    &__image {
      display: block;
    }

    &__image-wrapper {
      display: flex;
      position: absolute;
      left: 50%;
      top: 50vh;
      transform: translateY(-50%);
      width: calc(50vw - 30px);
      max-width: 700px;
      align-items: center;

      &.fixed {
        position: fixed;
        left: 50%;
      }

      &.fixed-bottom {
        top: auto;
        bottom: 50vh;
        transform: translateY(50%);
      }

      img {
        display: block;
      }
    }

    &__block {
      display: flex;
      flex-direction: column;
      justify-content: center;

      @include tablet-up() {
        min-height: 100vh;
        height: 1px; //IE flex column fix
        max-width: 40%;
      }
    }

    &__mobile-image {
      margin: 40px 0;

      @include tablet-up() {
        display: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }

    &__header {
      margin-bottom: 8px;
    }

    &__content {
      margin-bottom: 24px;
    }
  }
</style>
