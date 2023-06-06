<template lang="pug">
.featured-designer.featured-designer__container
  .container(
    :class="featuredDesigner.bgColor"
    :style="paddingStyles"
  )
    .featured-designer__details
      h2(:class="featuredDesigner.designerDetails.nameColor") {{ featuredDesigner.designerDetails.name }}
      p.featured-designer__details-excerpt.u-hidden-mobile-only(:class="featuredDesigner.designerDetails.excerptColor") {{ featuredDesigner.designerDetails.excerpt }}
      .featured-designer__view-all-button-container(
      v-if="featuredDesigner.enableCta"
      )
        v-button.featured-designer__view-all-button(
          v-if="featuredDesigner.enableCta",
          :class="featuredDesigner.ctaLayout",
          :href="featuredDesigner.ctaLink",
          :style="{ 'color': `${featuredDesigner.ctaColor}` }",
          tag="a"
        ) {{ featuredDesigner.ctaText }} 
          icon(
            :fill-class="featuredDesigner.ctaIconColor",
            name="arrow-right",
            size="14px"
          )
      .featured-designer__inner-image(
        :style="{ 'background-image': `url(${featuredDesigner.designerDetails.image})` }"
        :class="{'featured-designer__inner-image-desktop': featuredDesigner.designerDetails.imageMobile != null}"
      )
      .featured-designer__inner-image.featured-designer__inner-image-mobile(
        v-if="featuredDesigner.designerDetails.imageMobile != null"
        :style="{ 'background-image': `url(${featuredDesigner.designerDetails.imageMobile})` }"
      )
    .featured-designer__products-container
      .featured-designer__products
        .featured-designer__header
          h3(:class="featuredDesigner.headingColor") {{ featuredDesigner.heading }}
          .controls-container
            .arrows
              .arrow.arrow-prev(@click="slidePrev")
                icon(
                  :fill-class="featuredDesigner.arrowColor",
                  name="chevron-left",
                  size="14px"
                )
              .arrow.arrow-next(@click="slideNext")
                icon(
                  :fill-class="featuredDesigner.arrowColor",
                  name="chevron-right",
                  size="14px"
                )
        .featured-designer__carousel(
          :class="{ 'featured-collection__carousel--hover': hovered }"
        )
          swiper(
            :options="carouselOptions",
            ref="productImageCarousel",
            :class="{ 'swiper-no-swiping': !shouldSwipe }"
          )
            swiper-slide(
              v-for="(product, index) in filterProducts(featuredDesigner.products)",
              :key="`product-${index}`"
            )
              div(@mouseover="hovered = true", @mouseleave="hovered = false")
                product-tile(
                  :simple="isSimpleProductTile",
                  :product="product",
                  :onAddToCart="addToCart",
                  :showMobileATC="showMobileATC",
                  :collection-template="collectionTemplate",
                  :text-alignment="productTileTextAlignment",
                  :enable-simple-tile-cta="enableSimpleTileCta"
                )
</template>

<script>
import Icon from "scripts/components/basic/Icon.vue";
import ProductTile from "scripts/components/product/ProductTile.vue";
import css from "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import VButton from "scripts/components/buttons/VButton.vue";
import VLink from "scripts/components/buttons/VLink.vue";
import { isHiddenProduct, checkUndefined } from "scripts/helpers/util";
import { px } from "scripts/filters/string.js";

const cssVars = require("styles/variables.scss");

export default {
  name: "FeaturedDesigner",
  components: {
    ProductTile,
    swiper,
    swiperSlide,
    Icon,
    VButton,
    VLink
  },
  props: {
    collectionTemplate: String,
    productTileTextAlignment: String,
    showMobileATC: ProductTile.props.showMobileATC,
    featuredDesigner: {
      type: Object,
      default: () => ({
        heading: {
          type: String,
          required: true
        },
        products: {
          type: Array,
          required: true
        }
      })
    },
    enableSimpleTile: {
      type: Boolean,
      required: true
    },
    enableSimpleTileCta: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      slidesPerView: {
        hd: "2",
        desktop: "2",
        tablet: "2",
        mobile: "2"
      },
      hovered: false
    };
  },
  computed: {
    swiperDesktop() {
      return this.$refs.productImageCarousel.swiper;
    },
    carouselOptions() {
      return {
        slidesPerView: this.slidesPerView.desktop,
        threshold: 5,
        loop: true,
        breakpoints: {
          [parseInt(cssVars.breakDesktop, 10)]: {
            slidesPerView: this.slidesPerView.tablet
          },
          [parseInt(cssVars.breakTablet, 10)]: {
            slidesPerView: this.slidesPerView.mobile,
            spaceBetween: 20
          }
        },
        on: {
          slideChange: function() {
            if (this.params.slidesPerView) {
              // Get array of non duplicate slides
              const nonDupSlides = [...this.slides].filter(
                el => !el.matches(".swiper-slide-duplicate")
              );
              // loop: true adds # of slides to equal slidesPerView to the front and end of swiper
              //// subtract the slidesPerView from the activeIndex to get the realActiveIndex
              const realActiveIndex =
                this.activeIndex - this.params.slidesPerView;

              // if active index exceeds last slide go to first slide
              if (
                realActiveIndex >
                nonDupSlides.length - this.params.slidesPerView
              ) {
                this.slideToLoop(0);
                // if active index is less than real index go to last slide
                //// only happens when swiper tries to go before first slide
              } else if (realActiveIndex < this.realIndex) {
                this.slideToLoop(
                  nonDupSlides.length - this.params.slidesPerView
                );
              }
            }
          }
        }
      };
    },
    shouldSwipe() {
      return (
        this.slidesPerView[this.$mq] <
        this.filterProducts(this.featuredDesigner.products).length
      );
    },
    isSimpleProductTile() {
      return this.collectionTemplate === "b" || this.enableSimpleTile;
    },
    paddingStyles() {
      return {
        "--padding-top": px(
          checkUndefined(this.featuredDesigner.marginTop, 56)
        ),
        "--padding-bottom": px(
          checkUndefined(this.featuredDesigner.marginBottom, 56)
        )
      };
    }
  },
  methods: {
    filterProducts(products) {
      return products.filter(prod => prod.available && !isHiddenProduct(prod));
    },
    slidePrev() {
      if (this.shouldSwipe) {
        this.swiperDesktop.slidePrev();
      }
    },
    slideNext() {
      if (this.shouldSwipe) {
        this.swiperDesktop.slideNext();
      }
    },
    addToCart(id) {
      let addProduct = {
        id: id,
        quantity: 1
      };
      this.$store
        .dispatch("cart/addItems", addProduct)
        .then(() => this.$store.dispatch("cart/afterAddToCart"))
        .catch(error =>
          this.$store.dispatch("toast/send", { text: error, type: "error" })
        )
        .then(() => (this.adding = false));
    }
  }
};
</script>

<style scoped lang="scss">
.featured-designer__container {
  max-width: ($container-max-width + ($grid-gutter-sm * 2));
  margin-left: auto;
  margin-right: auto;

  @include tablet-up {
    padding-left: $grid-gutter;
    padding-right: $grid-gutter;
    &--tiny {
      max-width: (780px + ($grid-gutter * 2));
    }
    &--wide {
      max-width: (1400px + ($grid-gutter * 2));
    }
  }

  & > .container {
    padding: 0;
    display: flex;
    flex-wrap: wrap;

    @media (min-width: $breakpoint-tablet) {
      padding: 0 20px;
      padding-top: var(--padding-top);
      padding-bottom: var(--padding-bottom);
    }
  }

  .arrows:focus,
  .arrows:hover {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
  }
}

.featured-designer {
  overflow-clip-box: padding-box;

  .booking & {
    @media(max-width:749px){
      padding:0 16px;
      margin-top:28px;
    }
  }


  &__details {
    width: 100%;
    height: 240px;
    background: #eee;
    padding: 40px;
    position: relative;
    overflow: hidden;
    & > *:not(.featured-designer__inner-image) {
      position: relative;
      z-index: 1;
    }
    @include tablet-up {
      width: 50%;
      height: auto;
    }

    &-excerpt {
      margin-top: 10px;
    }
  }

  &__inner-image {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: all 0.8s;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    &:hover {
      @include desktop-only {
        transform: scale(1.2);
      }
    }

    &-desktop {
      display: none;
      @include tablet-up {
        display: block;
      }
    }
    &-mobile {
      display: block;
      @include tablet-up {
        display: none;
      }
    }
  }

  &__products-container {
    width: 100%;
    position: relative;
    padding: 16px;
    background: $color-white;
    @include tablet-up {
      width: 50%;
      padding: 40px 40px 40px 0;
      background: #f6f6f6;
    }
  }

  &__products {
    padding: 28px 0;
    background: #fff;
    @include tablet-up {
      padding: 35px;
      margin-left: -40px;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include mobile-only {
      margin-bottom: 16px;
    }
  }

  &__view-all-button-container {
    margin-top: 25px;
    .icon {
      margin-left: 15px;
    }
  }

  .controls-container {
    .arrows {
      display: flex;
      cursor: pointer;
      .arrow-prev {
        padding-right: 15px;
      }
      .arrow-next {
        padding-left: 15px;
      }
    }
  }
}

.featured-designer__carousel {
  position: relative;
  z-index: 3;

  @include tablet-up {
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

.featured-designer__carousel--hover {
  z-index: 5;
}

/deep/ .product-tile {
  max-width: 304px;
  padding: 0;
  background-color: transparent;
  transition: box-shadow 300ms ease;
  @include tablet-up {
    margin: 0 16px;
  }

  &:hover {
    @include mobile-only {
      box-shadow: none;
    }
    @include tablet-only {
      box-shadow: none;
    }
  }
}
.featured-designer__header {
  @include tablet-up {
    padding: 0 16px 24px 16px;
  }
}

/deep/ .swiper-container {
  z-index: auto;
}

/deep/ .swiper-wrapper {
  align-items: stretch;
}

/deep/ .swiper-slide {
  height: auto;

  @include tablet-up {
    margin: 16px 0;
  }
}

.swiper-slide-duplicate {
  opacity: 0;
  visibility: hidden;
}
</style>
