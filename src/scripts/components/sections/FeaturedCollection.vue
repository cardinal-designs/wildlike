<template lang="pug">
.featured-collection(
  :class="featuredCollection.bgColor",
  :style="paddingStyles"
)
  .container
    .featured-collection__header
      h3(:class="featuredCollection.headingColor") {{ featuredCollection.heading }}
      .controls-container
        .arrows
          .arrow.arrow-prev(@click="slidePrev")
            icon(
              :fill-class="featuredCollection.arrowColor",
              name="chevron-left",
              size="14px"
            )
          .arrow.arrow-next(@click="slideNext")
            icon(
              :fill-class="featuredCollection.arrowColor",
              name="chevron-right",
              size="14px"
            )
    .featured-collection__carousel(
      :class="{ 'featured-collection__carousel--hover': hovered }"
    )
      swiper(
        :options="carouselOptions",
        ref="productImageCarousel",
        :class="{ 'swiper-no-swiping': !shouldSwipe }"
      )
        swiper-slide(
          v-for="(product, index) in filterProducts(featuredCollection.products)",
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
    .featured-collection__view-all-button-container(
      v-if="featuredCollection.enableCta"
    )
      v-button.featured-collection__view-all-button(
        v-if="featuredCollection.enableCta",
        :class="featuredCollection.ctaLayout",
        :href="featuredCollection.ctaLink",
        tag="a"
      ) Shop All
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
  name: "FeaturedCollection",
  components: {
    ProductTile,
    swiper,
    swiperSlide,
    Icon,
    VButton,
    VLink,
  },
  props: {
    collectionTemplate: String,
    productTileTextAlignment: String,
    showMobileATC: ProductTile.props.showMobileATC,
    featuredCollection: {
      type: Object,
      default: () => ({
        heading: {
          type: String,
          required: true,
        },
        products: {
          type: Array,
          required: true,
        },
      }),
    },
    enableSimpleTile: {
      type: Boolean,
      required: true,
    },
    enableSimpleTileCta: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      slidesPerView: {
        hd: "4",
        desktop: "4",
        tablet: "3",
        mobile: "2",
      },
      hovered: false,
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
            slidesPerView: this.slidesPerView.tablet,
          },
          [parseInt(cssVars.breakTablet, 10)]: {
            slidesPerView: this.slidesPerView.mobile,
            spaceBetween: 20,
          },
        },
        on: {
          slideChange: function () {
            if (this.params.slidesPerView) {
              // Get array of non duplicate slides
              const nonDupSlides = [...this.slides].filter(
                (el) => !el.matches(".swiper-slide-duplicate")
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
          },
        },
      };
    },
    shouldSwipe() {
      return (
        this.slidesPerView[this.$mq] <
        this.filterProducts(this.featuredCollection.products).length
      );
    },
    isSimpleProductTile() {
      return this.collectionTemplate === "b" || this.enableSimpleTile;
    },
    paddingStyles() {
      return {
        "padding-top": px(
          checkUndefined(this.featuredCollection.marginTop, 56)
        ),
        "padding-bottom": px(
          checkUndefined(this.featuredCollection.marginBottom, 56)
        ),
      };
    },
  },
  methods: {
    filterProducts(products) {
      return products.filter(
        (prod) => prod.available && !isHiddenProduct(prod)
      );
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
        quantity: 1,
      };
      this.$store
        .dispatch("cart/addItems", addProduct)
        .then(() => this.$store.dispatch("cart/afterAddToCart"))
        .catch((error) =>
          this.$store.dispatch("toast/send", { text: error, type: "error" })
        )
        .then(() => (this.adding = false));
    },
  },
};
</script>

<style scoped lang="scss">
.featured-collection {
  overflow-clip-box: padding-box;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include mobile-only {
      margin-bottom: 16px;
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
  &__view-all-button-container {
    display: flex;
    position: relative;
    top: -20px;
    justify-content: flex-start;
    z-index: 4;

    @include mobile-only {
      top: 0;
      justify-content: center;
    }

    @include tablet-up {
      justify-content: center;
      top: -56px;
    }
  }
}
.featured-collection__carousel .swiper-container {
  padding-bottom: 10px;

  @include tablet-up {
    padding-bottom: 32px;
  }

  .template-index & {
    @include tablet-up {
      padding-bottom: 70px;
    }
  }
}

.featured-collection__carousel {
  position: relative;
  z-index: 3;

  @include tablet-up {
    margin-bottom: 0;
    padding-bottom: 0;
  }
}

.featured-collection__carousel--hover {
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
.featured-collection__header {
  @include tablet-up {
    padding: 0 16px 24px 16px;
  }
}
.arrows:focus,
.arrows:hover {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
}
.container {
  padding: 0 20px;
}
/deep/ .swiper-container {
  padding: 0 4px;
  z-index: auto;

  @include desktop-up {
    padding-bottom: 4px;
  }
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