
<template lang="pug">
  .footer-back-to-top-container(@click="footerToTop" :class="{'footer-back-to-top-container--hidden': !showToTop}")
    Icon.footer-back-top-top-icon(name="chevron-up" size="12px")
    p.footer-back-to-top-text.body-sm {{text}}
</template>

<script>
  import { scrollToTopBottom } from 'scripts/helpers/scroll.js'

  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'FooterToTop',
    props: {
      text: {
        type: String,
        default: 'Back to Top',
      },
      dynamicallyHide: {
        type: Boolean,
        default: false,
      }
    },
    components: { Icon },
    methods: {
      footerToTop() {
        scrollToTopBottom('top')
      },
      toggleShowToTop() {
        const scrollPosition = window.scrollY + this.$el.offsetTop;

        if (this.$parent) {
          if (scrollPosition >= this.$parent.$el.offsetTop) {
            this.showToTop = true;
          } else {
            this.showToTop = false;
          }
        }
      }
    },
    data() {
      return {
        showToTop: true,
      };
    },
    mounted() {
      if (this.dynamicallyHide) {
        this.toggleShowToTop();
        window.addEventListener('scroll', this.toggleShowToTop);
        window.addEventListener('resize', this.toggleShowToTop);
      }
    }
  }
</script>

<style scoped lang="scss">
  .footer-back-to-top-container {
    position: absolute;
    bottom: 100px;
    left: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transform: translate(-50%, -50%);

    @media screen and (min-width: 700px) {
      bottom: 70px;
    }
    
    @include desktop-up {
      right: 70px;
      bottom: 100px;
      left: auto;
      transform: none;

      &:hover {
        .footer-back-top-top-icon {
          transform: translate(0, -2px);
        }
      }
    }

    @media screen and (max-width: 320px) {
      bottom: 132px;
    }

    .footer--bourdain & {
      display: inline-flex;
      position: fixed;
      right: 0;
      bottom: 122px;
      left: auto;
      z-index: 2;
      min-height: 50px;
      min-width: 50px;
      padding: 0 12px;
      border: 1px solid $color-brand-secondary;
      border-radius: 2px;
      background-color: $color-white;
      transform: none;
      opacity: 1;
      visibility: visible;
      transition: opacity 300ms ease-in-out, visibility 300ms ease-in-out;
    }
  }

  .footer-back-to-top-container--hidden {
    .footer--bourdain & {
      opacity: 0;
      visibility: hidden;
    }
  }

  .footer-back-to-top-text {
    text-align: center;
    margin-top: 8px;
  }

  .footer-main-color-light .footer-back-to-top-text {
    color: $color-white;
  }

  .footer-main-color-dark .footer-back-to-top-text {
    color: $color-black-900;
  }

  .footer-back-top-top-icon {
    transform: translate(0, 0);
    transition: translate .3;
  }

  .footer-main-color-light .footer-back-top-top-icon {
    fill: $color-white;
  }

  .footer-main-color-dark .footer-back-top-top-icon {
    fill: $color-black-900;
  }

</style>