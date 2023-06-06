
<template lang="pug">
  .footer-value-props-container(:style="{ 'background-color': schema.settings.backgroundColor }")
    swiper.footer-value-prop-slider(:options="swiperOptions" :class="{ 'swiper-no-swiping' : !shouldSwipe }")
      swiperSlide.footer-value-prop(v-for="block in schema.blocks" :key="block.id" :class="schema.settings.dividerColor")
        .footer-value-prop__content
          .footer-value-prop__text(:class="schema.settings.textColor")
            h3.footer-value-prop__title(v-if="block.settings.title") {{ block.settings.title }}
            p.footer-value-prop__body.body-md.client-generated(v-if="block.settings.body" v-html="block.settings.body")
    .footer-value-prop__pagination(v-if="schema.blocks.length > 1")
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper';

  export default {
    name: 'FooterValueProps',
    components: {
      swiper,
      swiperSlide
    },
    props: {
      schema: Object,
        default: () => ({
          backgroundColor: '#F7F6F2'
        })
    },
    methods: {},
    data() {
      return {
        swiperOptions: {
          pagination: {
            el: '.footer-value-prop__pagination',
            clickable: true,
          },
          slidesPerView: 3,
          spaceBetween: 40,
          breakpoints: {
            1023: {
              slidesPerView: 1,
              spaceBetween: 0,
            }
          }
        }
      }
    },
    computed: {
      shouldSwipe() {
        const slidesInView = this.$mq === 'desktop' || this.$mq === 'hd' ? 3 : 1;
        return this.schema.blocks.length > slidesInView;
      },
    },
  }
</script>

<style scoped lang="scss">
  .footer-value-props-container {
    background-color: $color-black-100;
    padding: 56px 31px 48px 31px;

    @include desktop-up {
      padding: 90px 106px 98px 106px;
    }
  }

  .footer-value-prop-slider {
    @include desktop-up {
      max-width: #{$container-max-width - 40px};
    }

    /deep/ .swiper-wrapper {
      align-items: center;

      @include desktop-up {
        justify-content: center;
        align-items: stretch;
      }
    }
  }

  .footer-value-prop-heading {
    margin-bottom: 8px;

    @include desktop-up {
      margin-bottom: 48px;
    }
  }

  .footer-value-prop {
    @include desktop-up {
      width: 100% !important;
      height: auto;
      margin-right: 2.75vw !important;
      padding-right: 1.325vw;
      border-right: 1px solid $color-black-300;
      flex-shrink: 1;
    }

    &:last-child {
      margin-right: 0 !important; //Override swiper spacebetween
      border-right: 0;
    }

    &__pagination {
      font-size: rem(8);
      line-height: 1;
      text-align: center;
      margin-top: 24px;

      @include desktop-up {
        display: none;
      }

      /deep/ .swiper-pagination-bullet {
        margin: 0 4px;
        background: $color-white;
        border: 1px solid $color-primary-500;
        opacity: 1;
      }

      /deep/ .swiper-pagination-bullet-active {
        background-color: $color-primary-500;
      }
    }

    &__content {
      display: flex;
      height: 100%;
      flex-direction: column;
      align-items: center;

      @include desktop-up {
        justify-content: flex-start;
      }
    }

    &__title {
      margin-bottom: 8px;

      @include desktop-up {
        margin-bottom: 16px;
      }
    }

    &__text {
      text-align: center;

      @include desktop-up {
        width: 100%;
      }
    }

  }
</style>
