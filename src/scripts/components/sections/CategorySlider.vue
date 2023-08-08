<template>
  <section class="category-slider">
    <div class="container">
      <div class="category-slider__title-wrapper" :class="{'w-full':!isSlider}">
        <h2 class="category-slider__title" >{{ schema.settings.title }}</h2>
        <div class="category-slider__btn" v-if="isSlider">
          <button class="category-slider__btn__previous-slide" @click="previousSlide">
            <icon name="chevron-left" size="14px" />
          </button>
          <button class="category-slider__btn__next-slide" @click="nextSlide">
            <icon name="chevron-right" size="14px" />
          </button>
        </div>
      </div>
      <swiper :options="desktopOptions" ref="categorySlider" v-if="isSlider">
        <swiper-slide v-for="block in schema.blocks" :key="block.id">
          <v-link :href="block.settings.slider_link_url" class="category-slider__slide">
            <div class="category-slider__slide__image" >
              <img :src="block.settings.slider_image.src" :alt="block.settings.slider_title" v-if="block.settings.slider_image.src"/>
              <img :src="block.settings.slider_image" :alt="block.settings.slider_title" v-if="block.settings.slider_image && typeof block.settings.slider_image == 'string'" />
            </div>
            <div class="category-slider__detail">
              <p>{{ block.settings.slider_title }}</p>
              <icon name="chevron-right" size="10px" />
            </div>
          </v-link>
        </swiper-slide>
      </swiper>
      <div class="category-slider__slide-container" v-if="!isSlider">
        <div class="category-slider__slide-single" v-for="block in schema.blocks" :key="block.id">
          <v-link :href="block.settings.slider_link_url" class="category-slider__slide">
            <div class="category-slider__slide__image">
              <img :src="block.settings.slider_image.src" :alt="block.settings.slider_title" v-if="block.settings.slider_image.src"/>
              <img :src="block.settings.slider_image" :alt="block.settings.slider_title" v-if="block.settings.slider_image && typeof block.settings.slider_image == 'string' " />
            </div>
            <div class="category-slider__detail">
              <p>{{ block.settings.slider_title }}</p>
              <icon name="chevron-right" size="10px" />
            </div>
          </v-link>
        </div>
        
      </div>
    </div>
  </section>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Icon from '../basic/Icon.vue';
import VLink from '../buttons/VLink.vue'
export default {
  name: "CategorySlider",
  components: {
    swiper,
    swiperSlide,
    Icon,
    VLink
  },
  props: {
    schema: {
      type: Object
    }
  },
  data() {
    return {
      desktopOptions: {
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
        breakpoints: {
          765: {
            spaceBetween: 15,
            slidesPerView: 2,
          }
        },
      },
      isSlider:this.schema.settings.enable_slider
    };
  },
  methods: {
    nextSlide() {
      this.$refs.categorySlider.swiper.slideNext();
    },
    previousSlide() {
      this.$refs.categorySlider.swiper.slidePrev()();
    }
  },
}
</script>
<style scoped lang="scss">
.category-slider {
  padding: 35px 0 35px 0;

  @media(max-width: 768px) {
    padding: 20px 0 20px 0;
  }
  
  &__detail {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;

    p {
      color: #000000;
    }
  }

  &__title-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 35px;

    @media(max-width: 768px) {
      text-align: left;
      margin-bottom: 18px;
    }
    &.w-full{
     .category-slider__title {
      width: 100%;
      margin: 0;
     }
     .category-slider__btn {
      width: 100%;
      margin: 0;
     }
    }
   
  }

  &__btn__previous-slide {
    padding-right: 15px;
  }

  &__btn__next-slide {
    padding-left: 15px;
  }

  &__title {
    width: 80%;
    margin-left: 20%;
  
    @media(max-width: 768px) {
      margin-left: 0%;
    }
  }

    &__btn {
      width: 20%;
      display: flex;
      align-items: center;
      justify-content: end;
    }
    .category-slider__slide-container {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      column-gap: 25px;
      justify-content: center;

    .category-slider__slide-single {
      width: calc(25% - 25px);
      margin-right: 0;
      margin-bottom: 25px;
      @media(max-width: 768px) {
        width: calc(50% - 15px);
        margin-bottom: 15px;
      }

    }
  }

  .category-slider__detail,
    .category-slider__detail p {
      margin: 0;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 100%;
      font-size: 1.25rem;
      font-family: korolev,sans-serif;
      letter-spacing: 1px;
      font-style: italic;
    }
}
.icon.icon--arrow_long_right {
  display: none !important;
}

</style>