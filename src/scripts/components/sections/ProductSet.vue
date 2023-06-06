<template lang="pug">
  .product-set(:class="[schema.sectionBgColor, schema.layout]" :style="sectionPaddingStyle" :id="`product-set-${schema.collection}`")
    h3.product-set__section-title.container(:class="schema.sectionTitleColor") {{ schema.sectionTitle}}
    .product-set__container.container
      .product-set__collection-container
        .product-set__collection.product-set__collection--mobile-full(v-if="schema.layout === 'full'" :class="schema.textBgColorMobile")
          .product-set__collection-content
            h5.product-set__collection-title(:class="schema.textColor") {{ schema.collectionTitle }}
            p.product-set__collection-description(:class="schema.textColor") {{ schema.collectionDescription }}
            .product-set__collection-cta-container
              v-button.product-set__collection-cta(v-if="schema.ctaLayout.includes('button')" :href='schema.collectionUrl' :class="schema.ctaLayout" tag="a") {{schema.ctaText}}
              v-link.product-set__collection-cta(v-if="schema.ctaLayout.includes('link')" :href='schema.collectionUrl' :class="schema.ctaLayout") {{schema.ctaText}}
        .product-set__collection(:style="collectionStyle($mq)")
          .product-set__overlay(v-if="schema.enableOverlay" :class="schema.imageOverlayColor" :style="collectionOverlayStyle")
          .product-set__collection-content
            h5.product-set__collection-title(:class="schema.textColor") {{ schema.collectionTitle }}
            p.product-set__collection-description(:class="schema.textColor") {{ schema.collectionDescription }}
            .product-set__collection-cta-container
              v-button.product-set__collection-cta(v-if="schema.ctaLayout.includes('button')" :href='schema.collectionUrl' :class="schema.ctaLayout" tag="a") {{schema.ctaText}}
              v-link.product-set__collection-cta(v-if="schema.ctaLayout.includes('link')" :href='schema.collectionUrl' :class="schema.ctaLayout") {{schema.ctaText}}
      .product-set__carousel-container
        swiper(:options="swiperOptions" ref="carousel")
          swiper-slide.product-set__slide(v-for="(product, idx) in schema.products" :key="product.id")
            product-tile-widget(:product="product")
        .product-set__carousel-controls-container
          .product-set__carousel-control.product-set__carousel-control--next
            v-arrow-button.product-set__nav-button.next(:primary="true")
              icon(name="arrow-right" size="24px")
          .product-set__carousel-control.product-set__carousel-control--prev
            v-arrow-button.product-set__nav-button.prev(:primary="true")
              icon(name="arrow-right" size="24px")
        .product-set__pagination

</template>

<script>
import ProductTileWidget from 'scripts/components/product/ProductTileWidget.vue';
import VButton from 'scripts/components/buttons/VButton.vue';
import VLink from 'scripts/components/buttons/VLink.vue';
import VArrowButton from 'scripts/components/buttons/VArrowButton.vue';
import Icon from 'scripts/components/basic/Icon.vue';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

import { px } from 'scripts/filters/string.js';

export default {
  name: 'ProductSet',
  props: {
    schema: Object
  },
  components: {
    ProductTileWidget,
    VButton,
    VLink,
    VArrowButton,
    Icon,
    swiper,
    swiperSlide
  },
  computed: {
    collectionOverlayStyle() {
      return {
        opacity: this.schema.overlayOpacity / 100
      };
    },
    sectionPaddingStyle() {
      const {
        schema: { topPadding, bottomPadding }
      } = this;
      return {
        padding: `${px(topPadding)} 0 ${px(bottomPadding)} 0`
      };
    },
    swiperOptions() {
      return {
        slidesPerView: this.schema.layout === 'full' ? 4 : 2,
        pagination: {
          el: `.product-set#product-set-${this.schema.collection} .product-set__pagination`,
          clickable: true
        },
        loop: true,
        spaceBetween: this.schema.layout === 'full' ? 16 : 40,
        navigation: {
          nextEl: `.product-set#product-set-${this.schema.collection} .next`,
          prevEl: `.product-set#product-set-${this.schema.collection} .prev`
        },
        breakpoints: {
          1199: {
            spaceBetween: 16,
            slidesPerView: this.schema.layout === 'full' ? 4 : 2,
          },
          1023: {
            spaceBetween: 16,
            slidesPerView: 4
          },
          767: {
            spaceBetween: 16,
            slidesPerView: 3
          },
          580: {
            spaceBetween: 16,
            slidesPerView: 2
          }
        }
      };
    }
  },
  methods: {
    collectionStyle(mq) {
      return {
        backgroundImage: `url(${
          mq === 'mobile'
            ? this.schema.collectionImageMobile
            : this.schema.collectionImage
        })`
      };
    }
  }
};
</script>

<style lang="scss">
.product-set {
  &__collection {
    position: relative;
    min-height: 224px;
    padding: 16px;
    margin-bottom: 16px;
    background-size: cover;
    &--mobile-full {
      display: none;
    }
  }
  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    &.dark {
      background-color: $color-black-900;
    }
    &.light {
      background-color: $color-white;
    }
  }
  &__collection-content {
    position: relative;
  }
  &__section-title {
    text-align: center;
    margin-bottom: 32px;
  }
  &__collection-title {
    margin-bottom: 8px;
  }
  &__collection-description {
    margin-bottom: 16px;
  }
  &__carousel-controls-container {
    display: none;
  }
  &__carousel-container {
    position: relative;
    .product-tile {
      margin: 0 2px 2px 0;
      box-shadow: $drop-shadow--light;
      transition: box-shadow 150ms ease-in;

      &:hover {
        box-shadow: $drop-shadow;
      }

      &__static-text-content {
        height: 100px;
      }
    }
  }
  &__carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &--next {
      right: 20px;
    }

    &--prev {
      left: 20px;
    }
  }
  &__nav-button {
    background-color: $color-white;

    &.prev {
      transform: rotate(180deg);
    }
  }
  &__pagination {
    text-align: center;
    padding-top: 16px;

    @include desktop-up {
      display: none;
    }

    .swiper-pagination-bullet {
      margin: 0 4px;
      background: $color-white;
      border: 1px solid $color-primary-500;

      &-active {
        background: $color-brand-primary;
      }
    }
  }
  @include mobile-tablet {
    .product-set {
      &__container,
      &__section-title {
        max-width: $breakpoint-tablet;
      }
    }
  }
  @include desktop-up {
    &__carousel-controls-container {
      display: block;
    }
  }
  &.full {
    @include mobile-tablet {
      .product-set {
        &__overlay {
          display: none;
        }
        &__collection-content {
          display: none;
        }
        &__collection {
          &--mobile-full {
            display: flex;
            text-align: center;
            justify-content: center;
            align-items: center;
            .product-set {
              &__collection-content {
                display: block;
              }
            }
          }
        }
        &__container,
        &__section-title {
          max-width: $breakpoint-tablet;
        }
      }
    }
    @include desktop-up {
      .product-set {
        &__container {
          padding: 0 80px;
        }
        &__collection {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          min-height: 384px;
          padding: 40px 20px;
          &--mobile-full {
            display: none;
          }
        }
        &__carousel-control {
          &--next {
            right: -60px;
          }
          &--prev {
            left: -60px;
          }
        }
      }
    }
    @include hd-up {
      .product-set {
        &__container {
          padding: 0 128px;
        }
        &__carousel-control {
          &--next {
            right: -68px;
          }
          &--prev {
            left: -68px;
          }
        }
      }
    }
  }
  &.half {
    @include desktop-up {
      .product-set {
        &__container {
          display: flex;
        }
        &__carousel-container,
        &__collection-container {
          flex: 1;
        }
        &__carousel-container {
          max-width: 57%;
          padding: 0 64px;
          display: flex;
          align-items: stretch;
          .product-tile {
            height: calc(100% - 2px);
            &__static-text-content {
              height: 120px;
            }
          }
        }
        &__carousel-control {
          &--next {
            right: 12px;
          }
          &--prev {
            left: 12px;
          }
        }
        &__collection {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          width: 100%;
          min-height: 384px;
          padding: 40px 20px;
          margin: 0;
          background-size: cover;
        }
      }
    }
    @include desktop-up {
      .product-set {
        &__carousel-container {
          padding: 0 80px;
        }
        &__carousel-control {
          &--next {
            right: 20px;
          }
          &--prev {
            left: 20px;
          }
        }
      }
    }
    @include hd-up {
      .product-set {
        &__carousel-container {
          padding: 0 120px;
        }
        &__carousel-control {
          &--next {
            right: 40px;
          }
          &--prev {
            left: 40px;
          }
        }
      }
    }
  }
}
</style>
