<template lang="pug">
  section.pdp-gallery(:class="{'pdp-gallery--zooming': zoomState}")
    .pdp-gallery__main-container
      div.pdp-gallery__main
        //- badges
        .pdp-gallery__badge-container
          .badge(v-for="badge in badges", :key="badge" v-if="variant", :class="[$store.state.badgeColorMap[badge]]")
        //- zoom-in/zoom-out icon indicators
        span.pdp-gallery__zoom-icon(@click="() => zoomState = false", v-if="zoomState")
          icon(
            name="zoom_out"
            size="30px"
          )
        span.pdp-gallery__zoom-icon(v-else, @click="zoomCenter")
          icon(
            name="zoom_in"
            size="30px"
          )
        swiper(:options="swiperOptionsMain", ref="swiper", :key="mainSwiperKey")
          div.text-center.pdp-gallery__pagination(slot="pagination", v-if="productMedia.length > 1")
          swiper-slide(v-for="(media, index) in productMedia", :key="media.id")
            div(@click="setZoom($event, !zoomState)", @mouseleave="() => zoomState = false")
              media(:media="media")
                zoom(
                  ref="zoom"
                  slot="image"
                  :img-normal-attrs="{ src: imageSize(media.src, '800x'), alt: getProductImageAlt(media) }"
                  :img-zoom-attrs="{ src: imageSize(media.src, '1500x'), alt: getProductImageAlt(media), loading: 'lazy' }"
                  :zooming="zoomState"
                  :disabled="!zoomState"
                )
      div.pdp-gallery__thumbs
        swiper(:options="swiperOptionThumbs", ref="thumbSwiper" class="pdp-gallery__thumbs-slider" :key="thumbSwiperKey")
          swiper-slide(
            v-for="(media, index) in productMedia",
            :key="media.src",
            :class="{'pdp-gallery__thumbs-slide--active': slideIndexMain === index, [settings.thumbnailColor]: slideIndexMain === index}")
            button(
              @click="thumbSlideTo(index)"
              :aria-label="`Go to Thumbnail ${index}`"
            )
              media-preview(:media="media", size="83x131")
</template>

<script>
import '../../../typedefs';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { imageSize, fileUrl, noImageMedia, swiperLoopInit, swiperLoopSlideChange, is3rdPartyProduct, badgeList, getProductImageAlt, badge, getVariantImages  } from '../../../helpers/util';
import Icon from '../../basic/Icon.vue';
import Zoom from '../../basic/Zoom.vue';
import Media from '../../basic/Media.vue';
import MediaPreview from '../../basic/MediaPreview.vue';

export default {
  components: {
    swiper,
    swiperSlide,
    Zoom,
    Icon,
    Media,
    MediaPreview
  },
  model: {
    prop: 'variant',
  },
  props: {
    collection: Object,
    product: Object,
    customFields: Object,
    settings: Object,
    variant: Object
  },
  data() {
    return {
      zoomState: false,
      initialSlide: 0,
      mainSwiperKey: 0,
      thumbSwiperKey: 0,
      thumbsShouldSlide: false,
      mounted: false,
    }
  },
  computed: {
    /** @returns {Boolean} */
    hasColorVariants() {
      return this.product.options.some(opt => /color|pattern|design/i.test(opt));
    },
    /** @returns {Number} */
    colorIndex() {
      if(!this.hasColorVariants) return 0;

      return this.product.options.reduce((acc, opt, i) => /color|pattern|design/i.test(opt) ? i : acc, 0);
    },
    /**
     * @desc
     *  - if the variant is not defined, look for product images and return them if they exist (YL23-298).
     *  - if the variant is not defined and no product images exist, return an array of one with src: no image
     *  - if the variant is defined but there are no images with alt text to filter to a smaller subset of images,
     *    show all product images with the image for the current variant selected.
     *  - if there are images with alt text that match the option set, show the subset that matches;
     */
    productMedia() {
      if (!this.variant) {
        if (this.product.media.length)
          return this.product.media
        else
          return [noImageMedia()]
      }

      const variantSpecificImages = getVariantImages(this.product.media, this.product.options[this.colorIndex], this.variant.option1)
      if(variantSpecificImages.length)
        return variantSpecificImages;

      return this.product.media;
    },
    onSale() {
      return this.variant && this.variant.price < this.variant.compare_at_price;
    },
    badges() {
      return badgeList(this.product, this.variant, this.onSale);
    },
    swiperOptionsMain() {
      const vue = this;
      let adjustedInitialSlide = this.initialSlide;
      const variantImageSrcs = this.productMedia.map(image => image.src ? image.src.split('?')[0].replace('http:','').replace('https:','') : '');

      if(window.location.href.includes('variant=') && this.variant && this.variant.image.src && variantImageSrcs.includes(this.variant.image.src.split('?')[0])) {
        adjustedInitialSlide = variantImageSrcs.indexOf(this.variant.image.src.split('?')[0]);
      }

      return {
        initialSlide: adjustedInitialSlide,
        centeredSlides: true,
        pagination: {
          el: '.pdp-gallery__pagination',
          clickable: true,
        },
        threshold: 50,
        iOSEdgeSwipeDetection: true,
        iOSEdgeSwipeThreshold: 100,
        loop: true,
        on: {
          slideChange: function () {
            swiperLoopSlideChange(this, this.params.slidesPerView, vue.thumbSlideTo);
          },
        }
      }
    },
    swiperOptionThumbs() {
      let adjustedInitialSlide = this.initialSlide;
      const variantImageSrcs = this.productMedia.map(image => image.src ? image.src.split('?')[0].replace('http:','').replace('https:','') : '');
      if(window.location.href.includes('variant=') && this.variant && this.variant.image.src && variantImageSrcs.includes(this.variant.image.src.split('?')[0])) {
        adjustedInitialSlide = variantImageSrcs.indexOf(this.variant.image.src.split('?')[0]);
      }

      return {
        initialSlide: adjustedInitialSlide > 0 ? adjustedInitialSlide - 1 : 0,
        spaceBetween: 8,
        height: 133,
        threshold: 15,
        direction: 'vertical',
        loop: true,
        on: {
          init: function () {
            // Get slides per view based on gallery height and slide height
            const $galleryContainer = document.querySelector('.pdp-gallery__main-container');
            if (!$galleryContainer) {
              return;
            }
            const slidesPerView = Math.floor($galleryContainer.getBoundingClientRect().height / (this.params.height + this.params.spaceBetween));

            swiperLoopInit(this, slidesPerView);
          },
          slideChange: function () {
            // Get slides per view based on gallery height and slide height
            const $galleryContainer = document.querySelector('.pdp-gallery__main-container');
            if (!$galleryContainer) {
              return;
            }
            const slidesPerView = Math.floor($galleryContainer.getBoundingClientRect().height / (this.params.height + this.params.spaceBetween));

            swiperLoopSlideChange(this, slidesPerView);
          }
        }
      }
    },
    /** @returns {Number} */
    slideIndexMain() {
      if(!this.mounted || !this.$refs.swiper) return 0;
      return this.$refs.swiper.swiper.activeIndex - 1;
    },
  },
  methods: {
    imageSize,
    getProductImageAlt,
    zoomCenter (event) {
      this.zoomState = true;
      this.$nextTick(() => {
        const zoomContainer = this.$refs.zoom[this.slideIndexMain];
        if(zoomContainer)
          zoomContainer.zoomCenter();
      })
    },
    setZoom(event, state) {
        this.zoomState = state;
      if (this.$mq !== 'mobile') {

        this.$nextTick(() => {
          const zoomContainer = this.$refs.zoom[this.slideIndexMain];
          if(zoomContainer)
          zoomContainer.move(event);
        })
      } else {
        this.zoomState = false
      }
    },
    slideNextMain() {
      this.$refs.swiper.swiper.slideNext();
      this.thumbSlideTo(this.slideIndexMain);
    },
    slidePrevMain() {
      this.$refs.swiper.swiper.slidePrev();
      this.thumbSlideTo(this.slideIndexMain);
    },
    slideNextThumb() {
      this.$refs.thumbSwiper.swiper.slideNext();
    },
    slidePrevThumb() {
      this.$refs.thumbSwiper.swiper.slidePrev();
    },
    /** @returns {Number} */
    slideIndexThumb() {
      if(!this.$refs.thumbSwiper) return 0;
      return this.$refs.thumbSwiper.swiper.activeIndex - 1;
    },
    thumbSlideTo(index) {
      // Get array of non duplicate slides
      const nonDupSlides = [...this.$refs.thumbSwiper.swiper.slides].filter((el) => !el.matches('.swiper-slide-duplicate'));
     
      // Slide main swiper to index
      this.$refs.swiper.swiper.slideToLoop(index);

      if (this.thumbsShouldSlide) {
        // Get slides per view based on gallery height and slide height
        const $galleryContainer = document.querySelector('.pdp-gallery__main-container');
        if (!$galleryContainer) {
          return;
        }
        const slidesPerView = Math.floor($galleryContainer.getBoundingClientRect().height / (this.$refs.thumbSwiper.swiper.params.height + this.$refs.thumbSwiper.swiper.params.spaceBetween));

        // if new index + slidesPerView is greather then the number of slides and (stops duplicates from showing)
        // if the new index is less than the number of slides (not a duplicate)
        //// slide to last set of slides
        if (index - 1 > nonDupSlides.length - slidesPerView && index - 1 < nonDupSlides.length) {
          this.$refs.thumbSwiper.swiper.slideToLoop(nonDupSlides.length - slidesPerView);
        } else {
          // otherwise slide to index
          this.$refs.thumbSwiper.swiper.slideToLoop(index > 0 ? index - 1 : index);
        }
      }
    },
    updateThumbsShouldSlide() {
      // Get slides per view based on gallery height and slide height
      const $galleryContainer = document.querySelector('.pdp-gallery__main-container');
      if (!$galleryContainer) {
        this.thumbsShouldSlide = false;
        return;
      }

      const slidesPerView = Math.floor($galleryContainer.getBoundingClientRect().height / (this.$refs.thumbSwiper.swiper.params.height + this.$refs.thumbSwiper.swiper.params.spaceBetween));
      this.thumbsShouldSlide = this.productMedia.length > slidesPerView;
    },
  },
  watch: {
    variant(newVariant) {
      if(!newVariant) return;

      // re-render swipers to make sure duplicate slides are in correct position
      this.mainSwiperKey += 1;
      this.thumbSwiperKey += 1;
    }
  },
  mounted() {
    this.updateThumbsShouldSlide();
    window.addEventListener('resize', this.updateThumbsShouldSlide);
    this.mounted = true;
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .swiper-wrapper {
    display: flex;
    align-items: normal;
  }

  /deep/ .swiper-pagination- {
    width: 8px;
    height: 8px;
    background: $color-grey;
  }

  /deep/ .swiper-pagination-bullet-active {
    background: $color-primary-500;
  }
  .swiper-slide.swiper-slide-duplicate{
    opacity: 0 ;
    visibility: hidden;
  }
  .pdp-gallery {
    margin: 0;
    width: 100%;
    @include mobile-only {
      margin-bottom: 15px;
    }
       &__main {
      position: relative;
      overflow: hidden;
      max-width: 100%;
      width: 100%;
      height: fit-content;
    }

    .zoom-on-hover {
      text-align: center;
    }

    &__badge-container {
      position: absolute;
      bottom: 10px;
      left: 10px;
      height: 100px;
      width: 100px;
      display: flex;
      z-index: 6;

      .badge {
        background-repeat: no-repeat;
        background-size: cover;
        height: 100px;
        width: 100px;
        @include mobile-only {
          height: 100px;
          width: 100px;
        }
        &.badge-bg-sale {
          background-image: url('https://cdn.shopify.com/s/files/1/0559/6456/5658/files/Wildlike-Badge-SALE.svg?v=1637586954');
        }
        &.badge-bg-new {
          background-image: url('https://cdn.shopify.com/s/files/1/0559/6456/5658/files/Wildlike-Badge-NEW.svg?v=1637586954');
        }
        &.badge-bg-wildiespick {
          background-image: url('https://cdn.shopify.com/s/files/1/0559/6456/5658/files/Wildlike-Badge-WILDIES-PICK.svg?v=1637586954');
        }
        &.badge-bg-preorder {
          background-image: url('https://cdn.shopify.com/s/files/1/0559/6456/5658/files/Wildlike-Badge-PRE-ORDER-NOW.svg?v=1637586954');
        }
        &.badge-bg-goingfast{
          background-image: url('https://cdn.shopify.com/s/files/1/0559/6456/5658/files/Wildlike-Badge-GOING-FAST.svg?v=1637586954');
        }
      }
      @include mobile-only {
        bottom: 22px;
        left: 17px;
      }
    }

    &__logo-badge {
      z-index: 4;
      height: 40px;
      margin-right: 16px;
      margin-left: 5%;
      img {
        height: 40px;
        width: auto;
      }
      @include mobile-only {
        height: 35px;
        img {
          height: 35px;
        }
      }
    }

    &__button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 5;
      font-size: 0;
      cursor: pointer;
    }

    &__pagination {
      position: relative;
      font-size: 0;
      z-index: 11;
    }

    &__button--next {
      right: 8px;
    }

    &__button--prev {
      left: 8px;
    }

    &__button--next svg {
      margin-right: -2px;
    }

    &__button--prev svg {
      margin-left: -2px;
    }

    &__zoom-icon {
      position: absolute;
      top: 18px;
      right: 18px;
      display: inline-block;
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 29;
      @include mobile-only {
        top: 8px;
        right: 8px;
      }
      &:hover {
        cursor: zoom-in;
      }
    }

    &__zoom-icon * {
      pointer-events: none;
    }

    &__thumbs-slider {
      display: none;
    }

    &__thumbs {
      display: none;
    }

    @include tablet-up {
      display: inline-block;
      min-width: 50%;
      flex-basis: 50%;
      width: 50%;

      &__main-container {
        display: flex;
        flex-direction: row;
        // justify-content: flex-end;
        max-width: 100%;
        // height: 40vw;
        // max-height: 727px;
        width: 100%;
        position: relative;
        overflow: hidden;
        padding-right: 36px;
      }

      &__main {
        display: inline-flex;
        align-items: normal;
        width: 548px;
        order: 1;
      }

      &__main .swiper-slide {
        width: 100% !important;
      }

      &__badge-container {
        position: absolute;
        left: 10px;
        bottom: 10px;
        height: 96px;
        width: 96px;
        display: flex;
        z-index: 6;
        @include mobile-only {
          left: 17px;
          bottom: 22px;
        }
      }

      &__main &__button {
        opacity: 0;
        transition: opacity .2s linear;
      }

      &:hover &__main &__button {
        opacity: 1;
      }

      &__pagination {
        display: none;
      }

      &__thumbs-slider {
        display: block;
        // max-height: 560px;
        max-height: 100%;
      }

      &__thumbs-slider .swiper-slide {
        border: 1px solid $color-black-300;
        max-height: 133px;
      }

      &__thumbs-slider .swiper-slide.pdp-gallery__thumbs-slide--active {
        border: 1px solid $color-black-900;
      }

      &__thumbs-slider .swiper-slide-duplicate {
        opacity: 0;
        visibility: hidden;
      }

      &__thumbs-slider button {
        height: 100%;
        width: 100%;
        overflow: hidden;
      }

      &__thumbs-slider img {
        // width: 153px;
        max-width: 100%;
      }

      .zoom-on-hover {
        cursor: zoom-in;
      }

      .zoom-on-hover .zoom {
        cursor: zoom-out;
      }

      &__zoom-icon {
        width: 30px;
        height: 30px;
      }

      &__zoom-icon svg {
        width: 25px !important;
        height: 25px !important;
      }

      &__button {
        width: 40px;
        height: 40px;
      }

      &__thumbs {
        // position: absolute;
        left: 0;
        display: flex;
        align-items: center;
        overflow: hidden;
        display: inline-block;
        max-width: 100px;
        padding-right: 15px;
      }

      &__button-thumb {
        position: absolute;
        left: 0;
        width: 80px;
        height: 32px;
        background: $color-black-900;
        opacity: .3;
        align-items: center;
        justify-content: center;
        z-index: 5;
        transition: right .2s .2s ease, left .2s .2s ease;
        @include tablet-up {
          display: flex;
        }
      }

      &__button-thumb svg {
        fill: $color-white;
      }

      &__button-thumb--next {
        bottom: 0;
      }

      &__button-thumb--prev {
        top: 0;
      }

      &__button-thumb--next:disabled {
        bottom: -33px;
      }

      &__button-thumb--prev:disabled {
        top: -33px;
      }
    }

    @include desktop-up {
      width: 650px;
    }
  }

  .pdp-gallery.pdp-gallery--zooming {
    .pdp-gallery__main .pdp-gallery__button {
      pointer-events: none;
      opacity: 0;
    }
  }

  .pdp-gallery__pagination.swiper-pagination-clickable.swiper-pagination-bullets {
    position: absolute;
    bottom: 24px;
}

// Hide the badge on image zoom
.pdp-gallery--zooming .badge {
  visibility: hidden;
  opacity: 0;
}

.media {
  border: 1px solid $color-black-300;
}

</style>
