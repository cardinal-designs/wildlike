<template lang="pug">
  .blog-section(:class="bgColor")
    .blog-section-articles(v-if="blogSectionType === 'articles'")
      blog-section-articles-static(v-if="featuredArticles.articles.length <= 4" :featured-articles="featuredArticles")
      blog-section-articles-carousel(v-if="featuredArticles.articles.length > 4" :featured-articles="featuredArticles")
    .blog-section-categories(v-if="blogSectionType === 'categories'")
      blog-section-categories-static(v-if="featuredCategories.layout === 'static'" :featured-categories="featuredCategories")
      blog-section-categories-carousel(v-if="featuredCategories.layout === 'carousel'" :featured-categories="featuredCategories")
</template>

<script>
  import BlogSectionArticlesStatic from 'scripts/components/sections/BlogSectionArticlesStatic.vue'
  import BlogSectionArticlesCarousel from 'scripts/components/sections/BlogSectionArticlesCarousel.vue'
  import BlogSectionCategoriesStatic from 'scripts/components/sections/BlogSectionCategoriesStatic.vue'
  import BlogSectionCategoriesCarousel from 'scripts/components/sections/BlogSectionCategoriesCarousel.vue'

  export default {
    name: 'BlogSection',
    components: {
      BlogSectionArticlesStatic,
      BlogSectionArticlesCarousel,
      BlogSectionCategoriesStatic,
      BlogSectionCategoriesCarousel
    },
    props: {
      blogSectionType: String,
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
            default: () => ([{
              blogName: String,
              articleTitle: String,
              articleUrl: String,
              articleImg: String
            }])
          }
        })
      },
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
      return {}
    },
    computed: {
      bgColor() {
        if (this.blogSectionType === 'articles') {
          return this.featuredArticles.bgColor
        } else {
          return this.featuredCategories.bgColor
        }
      }
    },
    methods: {},
    mounted() {}
  }
</script>

<style scoped lang="scss">

</style>