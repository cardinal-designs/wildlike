<template lang="pug">
  .container
    .featured-categories(:style="paddingStyles")
      .featured-categories__header-container
        h4.preheader.featured-categories__preheading(v-if="featuredCategories.preHeading" :class="featuredCategories.textColor") {{ featuredCategories.preHeading }}
        h2.h3.featured-categories__heading(v-if="featuredCategories.heading" :class="featuredCategories.headingColor") {{ featuredCategories.heading }}
        h3.subheader.featured-categories__subheading(v-if="featuredCategories.subHeading" :class="featuredCategories.textColor") {{ featuredCategories.subHeading }}
        .controls-container(v-if="$mq !== 'mobile'")
          .arrows
            .arrow.arrow-prev(@click="slidePrev")
              icon(:fill-class="featuredCategories.arrowColor" name="chevron-left" size="14px")
            .arrow.arrow-next(@click="slideNext")
              icon(:fill-class="featuredCategories.arrowColor" name="chevron-right" size="14px")
        v-button.featured-categories__view-all-button(v-if="featuredCategories.enableCta && $mq !== 'mobile'" :class="featuredCategories.ctaLayout" href="/blogs/all" tag="a") View All
      swiper.featured-categories__categories(v-if="$mq !== 'mobile'" :options="desktopOptions" ref="blogSectionCategoryDesktop")
        swiper-slide(v-for="(category, index) in featuredCategories.categories" :key="index")
          a.featured-categories__category.clip-transition(:href="category.categoryUrl" :key="index" :class="featuredCategories.textColor")
            .featured-categories__image(data-clip-img, :style="{backgroundImage: `url('${category.featuredImg}')`}")
            h5.h5.featured-categories__title {{category.categoryName}}
            p.body-sm-mobile.body-md-tablet-up.featured-categories__description {{category.categoryDescription}}
            v-link.featured-articles__read-more.link.link--primary Read More
      swiper.featured-categories__categories--mobile(:options="mobileOptions" ref="blogSectionCategoryMobile")
        swiper-slide(v-for="(category, index) in featuredCategories.categories" :key="index")
          a.featured-categories__category.clip-transition(:href="category.categoryUrl" :class="featuredCategories.textColor")
            .featured-categories__image(data-clip-img, :style="{backgroundImage: `url('${category.featuredImg}')`}")
            h5.h5.featured-categories__title {{category.categoryName}}
            p.body-sm-mobile.body-md-tablet-up.featured-categories__description {{category.categoryDescription}}
            v-link.featured-articles__read-more.link.link--primary Read More
      //- THESE SHOULD BE MADE COMPONENTS
      .controls-container(v-if="$mq === 'mobile'")
        .pagination-dots
          .dot(v-for="(category, index) in featuredCategories.categories" :key="`dot-${index}`" @click="slidePagination(index)" :class="[dotActive(index), `dot-${index}`]")
      v-button.featured-categories__view-all-button(v-if="featuredCategories.enableCta && $mq === 'mobile'" :class="featuredCategories.ctaLayout" href="/blogs/all" tag="a") View All
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
    name: 'BlogSectioncategoriesCarousel',
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
        desktopOptions: {
          slidesPerView: 'auto',
          loop: true
        },
        mobileOptions: {
          slidesPerView: 1,
          initialSlide: 0,
          loop: true
        },
        currentMobileIndex: 0
      }
    },
    computed: {
      swiperDesktop() {
        return this.$refs.blogSectionCategoryDesktop.swiper
      },
      swiperMobile() {
        return this.$refs.blogSectionCategoryMobile.swiper
      },
      paddingStyles() {
        return {
          'padding-top': px(checkUndefined(this.featuredCategories.marginTop, 56)), 
          'padding-bottom': px(checkUndefined(this.featuredCategories.marginBottom, 56))
        };
      }
    },
    methods: {
      slidePrev() {
        this.swiperDesktop.slidePrev()
      },
      slideNext() {
        this.swiperDesktop.slideNext()
      },
      slidePagination(index) {
        this.swiperMobile.slideToLoop(index)
      },
      dotActive(index) {
        if (this.currentMobileIndex === index) {
          return 'active'
        }
      }
    },
    mounted() {
      // this should eventually become some sort of function within a custom BVA swiper wrapper
      this.$watch(() => {
        const index = this.$refs.blogSectionCategoryMobile.swiper.realIndex
        if (index > (this.featuredCategories.categories.length - 1)) {
          return 0
        } else {
          return index
        }
      },
      (val) => {
        this.currentMobileIndex = val
      })
    }
  }
</script>

<style scoped lang="scss">
  .container {
    padding-right: 0;
    margin-right: 0;
    @include mobile-only {
      padding-right: $grid-gutter-sm;
      padding-left: $grid-gutter-sm;
    }

    @media screen and (min-width: $container-max-width) {
      padding: 0;
    }
  }
  .featured-categories {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    overflow-clip-box: padding-box;
    @include mobile-only {
      flex-direction: column;
    }
    &__header-container {
      text-align: left;
      width: 50%;
      @include tablet-only {
        width: 33%
      }
      @include mobile-only {
        text-align: center;
        width: 100%;
      }
    }
    &__preheading {
      @include mobile-only {
        margin-bottom: 4px;
      }
    }
    &__heading {
      max-width: 327px;
      @include mobile-only {
        margin: 0 auto;
      }
      @include tablet-up {
        max-width: 762px;
      }
    }
    &__subheading {
      margin: 0 auto;
      @include mobile-only {
        margin-top: 4px;
      }
    }
    &__categories {
      width: 50%;
      margin-top: 32px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      @include mobile-only {
        display: none;
      }
      @include tablet-only {
        width: 66%;
      }
      &--mobile {
        margin-top: 15px;
        width: 100%;
        @include tablet-up {
          display: none;
        }
      }
    }
    &__category {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      p {
        margin-top: 0;
      }
    }
    &__image {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      margin-bottom: 10px;
      width: 90%;
      @include mobile-only {
        width: 100%;
        height: 200px;
      }
      @include tablet-only {
        height: 130px;
      }
      @include desktop-up {
        height: 150px;
      }
      @include hd-up {
        height: 200px;
      }
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
    &__header-container {
      @include tablet-up {
        padding-right: 32px;
      }
    }
    &__description {
      margin-top: 0;
      margin-bottom: 16px;
    }
  }
  h5 {
    margin: 0 0 8px 0;
  }
  .controls-container {
    display: flex;
    width: 100%;
    z-index: 5;
    @include mobile-only {
      position: absolute;
      bottom: 124px;
      justify-content: center;
    }
    .arrows {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 24px 0;
    }
    .arrow {
      cursor: pointer;
    }
    .arrow-prev {
      padding-right: 15px;
    }
    .arrow-next {
      padding-left: 15px;
    }
    .pagination-dots {
      display: flex;
      align-items: center;
      cursor: pointer;
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
  }
  /deep/ .swiper-slide {
    width: 47%;
    @include mobile-only {
      width: 100%;
      margin-right: 16px;
    }
  }
  .swiper-container p {
    width: 90%;
    @include mobile-only {
      width: 95%;
    }
  }
</style>