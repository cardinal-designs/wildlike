<template lang="pug">
  .container
    .featured-articles(:style="paddingStyles")
      .featured-articles__header-container
        h4.preheader.featured-articles__preheading(v-if="featuredArticles.preHeading" :class="featuredArticles.textColor") {{ featuredArticles.preHeading }}
        h2.h3.featured-articles__heading(v-if="featuredArticles.heading" :class="featuredArticles.headingColor") {{ featuredArticles.heading }}
        h3.subheader.featured-articles__subheading(v-if="featuredArticles.subHeading" :class="featuredArticles.textColor") {{ featuredArticles.subHeading }}
        .controls-container(v-if="$mq !== 'mobile'")
          .arrows
            .arrow.arrow-prev(@click="slidePrev")
              icon(:fill-class="featuredArticles.arrowColor" name="chevron-left" size="14px")
            .arrow.arrow-next(@click="slideNext")
              icon(:fill-class="featuredArticles.arrowColor" name="chevron-right" size="14px")
        v-button.featured-articles__view-all-button(v-if="featuredArticles.enableCta && $mq !== 'mobile'" :class="featuredArticles.ctaLayout" href="/blogs/all" tag="a") View All
      swiper.featured-articles__articles(v-if="$mq !== 'mobile'" :options="desktopOptions" ref="blogSectionArticlesDesktop")
        swiper-slide(v-for="(article, index) in featuredArticles.articles" :key="index")
          a.featured-articles__article.clip-transition(:href="article.articleUrl" :key="index" :class="featuredArticles.textColor")
            .featured-articles__image(data-clip-img, :style="{backgroundImage: `url('${article.articleImg}')`}")
            span.preheader.featured-articles__preheading {{ article.blogName }}
            h5.h5.featured-articles__title {{ article.articleTitle }}
            v-link.featured-articles__read-more.link.link--primary Read More
      swiper.featured-articles__articles--mobile(:options="mobileOptions" ref="blogSectionArticlesMobile")
        swiper-slide(v-for="(article, index) in featuredArticles.articles" :key="index")
          a.featured-articles__slide.clip-transition(:href="article.articleUrl" :class="featuredArticles.textColor")
            .featured-articles__image(data-clip-img, :style="{backgroundImage: `url('${article.articleImg}')`}")
            span.preheader.featured-articles__preheading {{ article.blogName }}
            h5.h5 {{ article.articleTitle }}
            v-link.featured-articles__read-more.link.link--primary Read More
      //- THESE SHOULD BE MADE COMPONENTS
      .controls-container(v-if="$mq === 'mobile'")
        .pagination-dots
          .dot(v-for="(article, index) in featuredArticles.articles" :key="`dot-${index}`" @click="slidePagination(index)" :class="[dotActive(index), `dot-${index}`]")
      v-button.featured-articles__view-all-button(v-if="featuredArticles.enableCta && $mq === 'mobile'" :class="featuredArticles.ctaLayout" href="/blogs/all" tag="a") View All
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
    name: 'BlogSectionArticlesCarousel',
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
        return this.$refs.blogSectionArticlesDesktop.swiper
      },
      swiperMobile() {
        return this.$refs.blogSectionArticlesMobile.swiper
      },
      paddingStyles() {
        return {
          'padding-top': px(checkUndefined(this.featuredArticles.marginTop, 56)), 
          'padding-bottom': px(checkUndefined(this.featuredArticles.marginBottom, 56))
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
        const index = this.$refs.blogSectionArticlesMobile.swiper.realIndex
        if (index > (this.featuredArticles.articles.length - 1)) {
          return 0
        } else {
          return index
        }
      },
      (val) => {
        this.currentMobileIndex = val
      })
      this.currentMobileIndex = 0
    }
  }
</script>

<style scoped lang="scss">
  .container {
    padding-right: 0;
    @include mobile-only {
      padding-right: $grid-gutter;
      padding-left: $grid-gutter;
    }
  }
  .featured-articles {
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
      @include tablet-up {
        padding-right: 32px;
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
    &__articles {
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
    &__article {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }
    &__image {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      margin-bottom: 24px;
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
      font-size: 24px;	
      line-height: 34px;
    }
  }
  h5 {
    margin: 0 0 16px 0;
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

  /deep/ .swiper-container {
    margin-bottom: 24px;
  }
</style>