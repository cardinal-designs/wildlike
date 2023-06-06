<template lang="pug">
  .container
    .featured-categories(:style="paddingStyles")
      .featured-categories__header-container
        h4.preheader.featured-categories__preheading(v-if="featuredCategories.preHeading" :class="featuredCategories.textColor") {{ featuredCategories.preHeading }}
        h2.h3.featured-categories__heading(v-if="featuredCategories.heading" :class="featuredCategories.headingColor") {{ featuredCategories.heading }}
        h3.subheader.featured-categories__subheading(v-if="featuredCategories.subHeading" :class="featuredCategories.textColor") {{ featuredCategories.subHeading }}
      .featured-categories__categories(v-if="$mq === 'hd'")
        a.featured-categories__category.clip-transition(v-for="(category, index) in featuredCategories.categories" :href="category.categoryUrl" :key="index" :class="featuredCategories.textColor")
          div
            .featured-categories__image(data-clip-img, :style="{backgroundImage: `url('${category.featuredImg}')`}")
            h5.h5.featured-categories__title {{category.categoryName}}
            p.body-sm-mobile.body-sm-tablet-up.featured-categories__description {{category.categoryDescription}}
            v-link.featured-articles__read-more.link.link--primary Read More
      //- Need to also build a swiper slider container component that is configurable
      swiper.featured-categories__categories--mobile(:options="mobileOptions" ref="blogSectionMobile")
        swiper-slide(v-for="(category, index) in featuredCategories.categories" :key="index")
          a.featured-categories__slide.clip-transition(:href="category.categoryUrl" :class="featuredCategories.textColor")
            .featured-categories__image(data-clip-img, :style="{backgroundImage: `url('${category.featuredImg}')`}")
            h5.h5.featured-categories__title {{category.categoryName}}
            p.body-sm-mobile.body-sm-tablet-up.featured-categories__description {{category.categoryDescription}}
            v-link.featured-articles__read-more.link.link--primary Read More
      //- THESE SHOULD BE MADE COMPONENTS
      .controls-container(v-if="$mq !== 'hd'" :class="{'controls-no-cta': !featuredCategories.enableCta}")
        .pagination-dots
          .dot(v-for="(category, index) in featuredCategories.categories" :key="`dot-${index}`" @click="slidePagination(index)" :class="[dotActive(index), `dot-${index}`]")
      v-button.featured-categories__view-all-button(v-if="featuredCategories.enableCta" :class="featuredCategories.ctaLayout" href="/blogs/all" tag="a") View All
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'
  import css from 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import VButton from 'scripts/components/buttons/VButton.vue'
  import VLink from 'scripts/components/buttons/VLink.vue'
  import { px } from 'scripts/filters/string.js'
  import { checkUndefined } from 'scripts/helpers/util.js';

  export default {
    name: 'BlogSectionCategoriesStatic',
    components: {
      swiper,
      swiperSlide,
      Icon,
      VButton,
      VLink
    },
    props: {
      featuredCategories: {
        type: Object,
        default: () => ({
          layout: String,
          bgColor: String,
          headingColor: String,
          textColor: String,
          preHeading: String,
          heading: String,
          subHeading: String,
          enableCta: Boolean,
          ctaLayout: String,
          marginTop: Number,
          marginBottom: Number,
          categories: {
            type: Array,
            default: () => ([{
              categoryName: String,
              categoryUrl: String,
              categoryDescription: String,
              featuredImg: String
            }])
          }
        })
      }
    },
    data() {
      return {
        mobileOptions: {
          slidesPerView: 3,
          spaceBetween: 60,
          loop: true,
          breakpoints: {
            767: {
              slidesPerView: 2,
              spaceBetween: 60
            },
            1280: {
              slidesPerView: 3
            }
          }
        },
        currentIndex: 0
      }
    },
    computed: {
      swiper() {
        return this.$refs.blogSectionMobile.swiper
      },
      paddingStyles() {
        return {
          'padding-top': px(checkUndefined(this.featuredCategories.marginTop, 56)), 
          'padding-bottom': px(checkUndefined(this.featuredCategories.marginBottom, 56))
        };
      }
    },
    methods: {
      slidePagination(index) {
        this.swiper.slideToLoop(index)
      },
      dotActive(index) {
        if (this.currentIndex === index) {
          return 'active'
        }
      }
    },
    mounted() {
      // this should eventually become some sort of function within a custom BVA swiper wrapper
      this.$watch(() => {
        return this.$refs.blogSectionMobile.swiper.realIndex
      },
      (val) => {
        this.currentIndex = val
      })
    }
  }
</script>

<style scoped lang="scss">
  .container {
    @include mobile-only {
      padding-right:0;
      padding-left: 12px;
    }
  }
  .featured-categories {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    &__preheading {
      text-align: center;
      @include mobile-only {
        margin-bottom: 4px;
      }
    }
    &__heading {
      text-align: center;
      max-width: 327px;
      @include tablet-up {
        max-width: 762px;
      }
    }
    &__subheading {
      margin: 0 auto;
      text-align: center;
      @include mobile-only {
        margin-top: 4px;
      }
    }
    &__categories {
      width: 100%;
      margin-top: 32px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      @include hd-up {
        flex-wrap: nowrap;
      }
      &--mobile {
        margin-top: 15px;
        margin-bottom: 24px;
        width: auto;
      }
    }
    &__category {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 50%;
      padding: 0 16px;
      span, h5, a, p {
        @include mobile-only {
          max-width: 181px;
        }
        @include tablet-only {
          max-width: 230px;
        }
        @include desktop-up {
          max-width: 300px;
        }
      }
      h5 {
        margin-bottom: 8px;
      }
      @media (min-width: 1400px) {
        width: 25%;
      }
      @media (max-width: 1400px) {
        width: 40%;
        padding: 0;
        margin-bottom: 20px;
      }
      @include mobile-only {
        max-width: 300px;
      }
      p {
        margin-top: 0;
      }
    }
    &__image {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      margin-bottom: 10px;
      @include mobile-only {
        min-width: 181px;
        height: 200px;
        width: 100%;
      }
      @include tablet-only {
        width: 230px;
        height: 140px;
      }
      @include desktop-up {
        width: 300px;
        height: 200px;
      }
    }
    &__cta-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      max-height: 250px;
    }
    &__categories-mobile {
      width: 100%;
      margin: 0 auto;
      display: flex;
      overflow: scroll;
    }
    &__view-all-button {
      margin: 55px 0 0;
    }
    &__read-more {
      overflow: inherit;
      .icon--arrow-right {
        margin-left: 6.5px;
      }
    }
    &__title {
      margin-bottom: 8px;
    }
    &__description {
      margin-top: 0;
      margin-bottom: 16px;
    }
  }
  h5 {
    margin: 0;
    @include tablet-up {
      margin: 0 0 24px 0;
    }
  }
  p {
    margin: 16px 0;
  }
  .controls-container {
    display: flex;
    position: absolute;
    bottom: 124px;
    width: 100%;
    z-index: 5;
    @include mobile-only {
      justify-content: center;
    }
    .pagination-dots {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin: 0 auto;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background-color: $color-black-300;
      margin: 8px;
    }
    .dot.active {
      background-color: $color-primary-700;
    }
    &.controls-no-cta {
      bottom: 48px;
    }
  }
  /deep/ .swiper-container {
    width: 100%;
    margin-right: 0;
    display: block;
    @include mobile-only{
      width: 96%;
    }
    @include hd-up {
      display: none;
    }
    p {
      @include mobile-only {
        min-width: 181px
      }
    }
  }
</style>