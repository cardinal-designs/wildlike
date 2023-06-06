<template lang="pug">
  .container
    .featured-articles(:style="paddingStyles")
      .featured-articles__header-container
        h4.preheader.featured-articles__preheading(v-if="featuredArticles.preHeading" :class="featuredArticles.textColor") {{ featuredArticles.preHeading }}
        h2.h3.featured-articles__heading(v-if="featuredArticles.heading" :class="featuredArticles.headingColor") {{ featuredArticles.heading }}
        h3.subheader.featured-articles__subheading(v-if="featuredArticles.subHeading" :class="featuredArticles.textColor") {{ featuredArticles.subHeading }}
      .featured-articles__articles(v-if="$mq === 'hd'")
        a.featured-articles__article.clip-transition( v-for="(article, index) in featuredArticles.articles" :href="article.articleUrl" :key="index" :class="featuredArticles.textColor")
          div
            .featured-articles__image(data-clip-img, :style="{backgroundImage: `url('${article.articleImg}')`}")
            span.preheader.featured-articles__preheading {{ article.blogName }}
            h5.h5.featured-articles__title {{ article.articleTitle }}
            v-link.featured-articles__read-more.link.link--primary Read More
      swiper.featured-articles__articles--mobile(:options="mobileOptions" ref="blogSectionMobile")
        swiper-slide(v-for="(article, index) in featuredArticles.articles" :key="index")
          a.featured-articles__slide.clip-transition(:href="article.articleUrl" :class="featuredArticles.textColor")
            .featured-articles__image(data-clip-img, :style="{backgroundImage: `url('${article.articleImg}')`}")
            span.preheader.featured-articles__preheading {{ article.blogName }}
            h5.h5 {{ article.articleTitle }}
            v-link.featured-articles__read-more.link.link--primary Read More
      //- THESE SHOULD BE MADE COMPONENTS
      .controls-container(v-if="$mq !== 'hd'" :class="{ 'controls-no-cta': !featuredArticles.enableCta}")
        .pagination-dots
          .dot(v-for="(article, index) in featuredArticles.articles" :key="`dot-${index}`" @click="slidePagination(index)" :class="[dotActive(index), `dot-${index}`]")
      v-button.featured-articles__view-all-button(v-if="featuredArticles.enableCta" :class="featuredArticles.ctaLayout" href="/blogs/all" tag="a") View All
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
    name: 'BlogSectionArticlesStatic',
    components: {
      swiper,
      swiperSlide,
      Icon,
      VButton,
      VLink
    },
    props: {
      featuredArticles: {
        type: Object,
        default: () => ({
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
          articles: {
            type: Array,
            default: () => ([
              {
                blogName: String,
                articleTitle: String,
                articleUrl: String,
                articleImg: String
              }
            ])
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
              slidesPerView: 2
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
          'padding-top': px(checkUndefined(this.featuredArticles.marginTop, 56)), 
          'padding-bottom': px(checkUndefined(this.featuredArticles.marginBottom, 56))
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
  .featured-articles {
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
    &__title {
      margin-bottom: 24px;
    }
    &__articles {
      width: 100%;
      margin-top: 32px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      @include hd-up {
        flex-wrap: nowrap;
      }
      justify-content: center;
      &--mobile {
        margin-top: 15px;
        margin-bottom: 24px;
        width: auto;
      }
    }
    &__article {
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
    }
    &__image {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      margin-bottom: 24px;
      @include mobile-only {
        min-width: 181px;
        height: 200px;
        width: 100%;
      }
      @include tablet-up {
        margin-bottom: 16px;
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
    &__articles-mobile {
      width: 100%;
      margin: 0 auto;
      display: flex;
      overflow: scroll;
    }
    &__slide {
      h5 {
        margin-bottom: 24px;
      }
    }
    &__view-all-button {
      margin: 40px 0 0;
    }
    &__read-more {
      overflow: inherit;
      .icon--arrow-right {
        margin-left: 6.5px;
      }
    }
  }
  h5 {
    margin: 0 0 16px 0;
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
    margin-bottom: 24px;
    display: block;
    @include mobile-only{
      width: 96%;
    }
    @include hd-up {
      display: none;
    }
    h5 {
      @include mobile-only {
        min-width: 181px
      }
    }
  }
</style>