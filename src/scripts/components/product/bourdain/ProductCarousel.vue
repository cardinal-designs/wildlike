
<template lang="pug">
  .product-carousel
    v-button.product-carousel__prev(
      v-if="multipleImages"
      label="Next Slide",
      icon="arrow-left",
      @click="$refs.productImageCarousel.slidePrev()"
    )
    v-button.product-carousel__next(
      v-if="multipleImages"
      label="Previous Slide",
      icon="arrow-right",
      @click="$refs.productImageCarousel.slideNext()"
    )
    carousel(
      ref="productImageCarousel", 
      :slides-to-show="1", 
      :infinite="multipleImages ? true : false",
      :dots="multipleImages ? true : false"
    )
      slide(v-for="(image, index) in images", :key="index")
        img.product-carousel__image(v-lazy="image.src", :alt="image.alt" draggable="false")
</template>

<script>
  import VButton from 'scripts/components/buttons/VButton.vue'
  import Carousel from 'scripts/components/basic/Carousel.vue'
  import Slide from 'scripts/components/basic/Slide.vue'

  export default {
    name: 'ProductSlider',
    components: { VButton, Carousel, Slide },
    props: {
      images: Array
    },
    data() {
      return {
        multipleImages: this.images.length > 1
      }
    }
  }
</script>

<style scoped lang="scss">
  .product-carousel {
    position: relative;
    padding: 0 #{24px + $grid-gutter * 2};

    @include mobile-only {
      padding: 0 #{$grid-gutter * 1.5};
      max-width: 550px;
      margin-left: auto;
      margin-right: auto;
    }

    &__next,
    &__prev {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    &__next {
      right: $grid-gutter;

      @include mobile-only {
        right: 4px;
      }
    }
    
    &__prev {
      left: $grid-gutter;

      @include mobile-only {
        left: 4px;
      }
    }

    &__image {
      align-self: center;
    }
  }
</style>
