<template lang="pug">
  .accordion(:class="accordionClass")
    a.accordion__header(href="#", :class="headerClass", @click.prevent="activate")
      span.accordion__menu-title.h6(:class="titleClass")
        slot(name="heading") {{ heading }}
      icon.accordion-icon(:name="currentIcon", :size="iconSize", :class="iconClass")
    transition(:name="transition")
      .accordion__content(v-if="active", ref="content", :style="contentStyle")
        slot
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'Accordion',
    components: { Icon },
    props: {
      expandMaxHeight: {
        type: Number
      },
      heading: {
        type: String
      },
      titleClass: {
        type: Array,
        default: () => []
      },
      selected: {
        type: Boolean,
        default: false
      },
      activeIcon: {
        type: String,
        default: 'minus'
      },
      inactiveIcon: {
        type: String,
        default: 'plus'
      },
      iconSize: {
        type: String,
        deafult: '20px'
      },
      iconClass: {
        type: Array,
        default: () => []
      },
      /** prevent the accordion from closing when another is opened in the same accordion group */
      autoClose: {
        type: Boolean,
        default: true
      },
      theme: {
        type: String,
        default: 'default',
        validator (value) {
          return [
            'default',
            'footer-ramsay',
            'footer-bourdain',
            'product-details',
            'faq'
          ].includes(value)
        }
      }
    },
    data () {
      return {
        active: true,
        contentStyle: {},
        scrollHeight: 0,
        transition: 'none'
      }
    },
    computed: {
      accordionClass () {
        let classes = []

        if (this.theme !== 'default') {
          classes.push(`accordion--${this.theme}`)
        }

        if (this.active) {
          classes.push('is-open')
        }

        return classes
      },
      headerClass () {
        return {
          'is-open': this.active
        }
      },
      currentIcon () {
        return (this.active) ? this.activeIcon : this.inactiveIcon
      }
    },
    mounted () {
      this.setContentHeight()

      // NOTE: this has to be set to false after mount or scrollHeight will be 0
      this.active = this.selected
      this.transition = 'slide-vertical'

      if (this.$parent.addAccordion) {
        this.$parent.addAccordion(this)
      }
    },
    beforeDestroy () {
      this.active = false
      if (this.$parent.removeAccordion) {
        this.$parent.removeAccordion(this)
      }
    },
    methods: {
      setContentHeight () {
        let height = 0;
        // Checking if the accordion's content is loaded to prevent throwing an error
        if (typeof this.$refs.content !== undefined) {
          height = this.$refs.content.scrollHeight;
        }
        let containerPadding = 50

        // Set max height for animation
        this.contentStyle = {
          'max-height': `${ this.expandMaxHeight || (height + containerPadding) }px`
        }
      },
      activate () {
        if (this.$parent.activate && !this.active) {
          this.$parent.activate(this)
          this.$emit("active")
        } else {
          this.active = !this.active
        }

        if(this.active)
          this.$nextTick(() => this.setContentHeight())
      }
    }
  }
</script>

<style lang="scss">
  .accordion {
    &.accordion--footer-ramsay,
    &.accordion--product-details {
      border-top: 1px solid $color-black-300;
      background-color: transparent;

      &:last-child {
        border-bottom: 1px solid $color-black-300;
      }
    }

    &.accordion--footer-bourdain {
      border-bottom: 1px solid $color-black-300;
    }

    &.accordion--faq {
      margin-bottom: 0;
      border-top: 1px solid $color-black-100;
      background-color: transparent;
      transition: background-color 300ms ease-in-out;

      &:last-child {
        border-bottom: 1px solid $color-black-100;
      }
    }

    &__header {
      width: 100%;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .accordion--footer-bourdain & {
        padding-right: 0;
        padding-left: 0;
      }
    }

    &__menu-title {
      &:not([class*="color"]) {
        color: $color-black-900;
      }

      .accordion--footer-bourdain & {
        margin-right: 8px;
        font-weight: 700;
        line-height: 1.5;
      }

      .accordion--faq & {
        @include h5();

        line-height: 1.29;
        letter-spacing: 0;

        @include desktop-up {
          font-size: rem(16);
          line-height: 1.5;
          letter-spacing: 1px;
        }
      }
    }

    &__content {
      overflow: hidden;
      margin-bottom: 10px;

      &--wrapper {
        overflow: hidden;
      }
    }

    &__header {
      .accordion--footer-ramsay & {
        color: $color-white;
        font-weight: normal;

        &:hover {
          text-decoration: none;
        }
      }

      .footer-content--center .accordion--footer-bourdain & {
        @include mobile-only {
          justify-content: center;
        }
      }

      .accordion--product-details & {
        font-weight: 700;
      }

      .accordion--faq & {
        padding: 12px 8px;
        background-color: transparent;
        transition: background-color 300ms ease-in-out;

        @include desktop-up {
          padding: 16px 12px;
        }
      }

      .accordion--faq &:hover {
        background-color: $color-black-100;
      }
    }

    &__content {
      .accordion--footer-ramsay & {
        color: $color-black-900;
        font-weight: normal;
        padding: 0;

        &:hover {
          text-decoration: none;
        }
      }

      .accordion--product-details & {
        padding: 0 16px 24px;
      }

      .accordion--faq & {
        margin-bottom: 0;
        padding: 16px 10px 16px 14px;
        line-height: 1.43;
        border-top: 1px solid $color-black-100;

        @include desktop-up {
          padding: 24px 24px;
        }
      }
    }

    &__icon {
      .accordion--footer-ramsay & {
        fill: $color-black-900;
      }
    }
  }

  .accordion__menu-title {
    text-transform: uppercase;
    font-family: $font-family-primary;
    font-style: italic;
    font-size: rem(20);
    letter-spacing: rem(1);
  }

  .footer-main-color-light .accordion__menu-title {
    color: $color-white;
  }

  .footer-main-color-light .accordion__menu-title {

    &:hover {

      &::before {
        background-color: $color-white;
      }
    }

    &::before {
      background-color: $color-white;
    }
  }

  .footer-main-color-dark .accordion__menu-title {
    color: $color-black-900;
  }

  .footer-main-color-dark .accordion__menu-title {

    &:hover {

      &::before {
        background-color: $color-black-900;
      }
    }

    &::before {
      background-color: $color-black-900;
    }
  }

  .accordion-icon {
    min-width: 32px;

    .footer-main-color-light & {
      fill: $color-white;
    }

    .footer-main-color-dark & {
      fill: $color-black-900;
    }
  }

</style>
