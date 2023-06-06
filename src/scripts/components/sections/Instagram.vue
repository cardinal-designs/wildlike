<template lang="pug">
  section.insta.text-center(
    v-if="!hidden"
    :style="paddingStyles"
  )
    header.insta__header
      h3.insta__title(
        :class="[schema.settings.sectionHeaderColor]"
      ) {{ schema.settings.sectionHeader }}
      v-link(
        target="_blank"
        :href="schema.settings.linkUrl"
        primary
      ) {{ schema.settings.linkText }}
    .insta__slider
      swiper#insta-swiper(
        v-if="images.length"
        :options="swiperOptions"
        ref="swiper"
      )
        swiper-slide(
          v-for="image in images"
          :key="image.thumbnail.url"
        )
          div.insta__img(:style="`background-image: url(${image.standard_resolution.url})`", alt="")
      button.insta__prev(
        aria-label="Go to previous slide"
        aria-controls="insta-swiper"
        @click="function () {$refs.swiper.swiper.slidePrev()}"
      )
        icon(name="arrow_left" size="32px")
      button.insta__next(
        aria-label="Go to next slide"
        aria-controls="insta-swiper"
        @click="function () {$refs.swiper.swiper.slideNext()}"
      )
        icon(name="arrow_right" size="32px")
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import axios from 'axios';
import Icon from '../basic/Icon.vue';
import VLink from '../buttons/VLink.vue';
import { px } from 'scripts/filters/string.js'
import { checkUndefined } from 'scripts/helpers/util.js';

export default {
  name: 'Instagram',
  props: {
    schema: Object
  },
  components: {
    swiper,
    swiperSlide,
    Icon,
    VLink
  },
  data() {
    return {
      hidden: false,
      images: [],
      swiperOptions: {
        initialSlide: 4,
        slidesPerView: 'auto',
        spaceBetween: 5,
        centeredSlides: true,
        breakpoints: {
          '768': {
            slidesPerView: 'auto',
            initialSlide: 4,
            spaceBetween: 10,
          }
        }
      },
    }
  },
  computed: {
    paddingStyles() {
      return {
        'padding-top': px(checkUndefined(this.schema.settings.marginTop, 56)), 
        'margin-bottom': px(checkUndefined(this.schema.settings.marginBottom, 56))
      }
    }
  },
  created () {
    const hash = [
      Math.random().toString(16).substring(2),
      Math.random().toString(16).substring(2),
      Math.random().toString(16).substring(2),
    ].join('').slice(0,32) // random 32 char hash


    axios.get(`https://instafeed.nfcube.com/facebook/v4?charge=0&fu=0&limit=15&filter=0&account=${this.schema.settings.domain}&fid=0&tags=&public=0&hash=${hash}`)
      .then(res => res.data.replace(/^\s+?\(|\);$/g, '')) // strip parenthesis and trailing semi-colon
      .then(JSON.parse)
      .then((res) => {
        if(!res || res.meta && res.meta.error_message)
          throw new Error(res.meta.error_message);
        this.images = res.data.map(d => ({ ...d.images }));
      })
      .catch((e) => {
        console.error(e);
        this.hidden = true;
      })
  },
}
</script>

<style lang="scss">
  .insta {
    &__img {
      width: 154px;
      height: 154px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      z-index: 1;
    }

    &__header {
      margin-bottom: 32px;
    }

    &__title {
      margin-bottom: 8px;
    }

    &__slider {
      position: relative;
    }

    .swiper-slide {
      width: auto;
    }

    button {
      position: absolute;
      top: 0;
      height: 154px;
      width: 50px;
      background-color: rgba(255, 255, 255, .5);
      z-index: 2;
      transition: background-color .2s ease-in;
    }

    button:hover,
    button:focus {
      background-color: rgba(255, 255, 255, .75);
    }

    &__prev {
      left: 0;
    }

    &__next {
      right: 0;
    }

    @include tablet-up {
      &__img {
        width: 304px;
        height: 304px;
      }

      button {
        position: absolute;
        top: 0;
        height: 304px;
      }
    }
  }
</style>