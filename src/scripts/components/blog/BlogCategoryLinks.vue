<template lang="pug">
  .blog__categories-wrapper
    .blog__categories
      swiper.blog__categories-carousel(ref="blogCategoriesCarousel" :options="swiperOptionsBlog" :class="{ 'no-swiping' : $mq !== 'mobile' }")
        swiper-slide(v-for="blog in categoryLinks.blogs", :key="blog.blogTitle")
          //- The name of the menu item in the naviguation (currentBlog) needs to be the same as the blog's name (blogTitle) to render the "button--active" class.
          a.button.button--primary(:href="blog.blogUrl" :class="{ 'button--active' : categoryLinks.currentBlog === blog.blogTitle }") 
            span.button__content {{ blog.blogTitle }}
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import { elementAtTop } from 'scripts/helpers/elementAtTop.js';

  export default {
    name: 'BlogCategoryLinks',
    components: {
      swiper, 
      swiperSlide,
    },
    props: {
      categoryLinks: {
        type: Object
      }
    },
    mounted() {
        window.addEventListener('scroll', function(e) {
          elementAtTop(".blog__categories");
      });
    },
    data() {
      return {
        swiperOptionsBlog: {
          slidesPerView: 'auto',
          spaceBetween: 32,
          initialSlide: 0,
          centerMode: false,
          breakpoints: {
            765: {
              spaceBetween: 16
            }
          },
          noSwipingClass: 'no-swiping',
          noSwiping: true
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .swiper-slide {
    width: 160px !important;
  }
</style>