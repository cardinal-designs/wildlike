<template lang="pug">
  .accordion(:class="accordionClass")
    a.accordion__header(href="#", :class="headerClass", @click.prevent="activate")
      span.accordion__menu-title
        slot(name="heading") {{ heading }}
      icon.accordion-icon(:name="currentIcon" size="10px")
    transition(:name="transition")
      .accordion__content(v-if="active", ref="content", :style="contentStyle")
        slot
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'CollectionAccordion',
    components: { Icon },
    props: {
      expandMaxHeight: {
        type: Number
      },
      heading: {
        type: String
      },
      selected: {
        type: Boolean,
        default: false
      },
      activeIcon: {
        type: String,
        default: 'chevron-up'
      },
      inactiveIcon: {
        type: String,
        default: 'chevron-down'
      },
      iconSize: {
        type: String,
        default: '12px'
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
        let height = this.$refs.content.scrollHeight
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
      },
      addMaxHeight() {
        this.$nextTick(() => this.setContentHeight())
      }
    }
  }
</script>

<style scoped lang="scss">
  .accordion {
    &.accordion--footer-ramsay,
    &.accordion--product-details {
      border-top: 1px solid $color-grey;
      background-color: transparent;

      &:last-child {
        border-bottom: 1px solid $color-grey;
      }
    }

    &.accordion--footer-bourdain {
      border-bottom: 1px solid $color-black-100;
    }

    &.accordion--faq {
      margin-bottom: 0;
      border-top: 1px solid $color-black-100;
      background-color: transparent;
      transition: background-color 300ms ease-in-out;

      &:last-child {
        border-bottom: 1px solid $color-black-100;
      }

      &.is-open {
        border-top-color: $color-grey;
        background-color: $color-black-100;
      }

      &.is-open:last-child {
        border-bottom-color: $color-grey;
      }

      &.is-open + .accordion--faq {
        border-top-color: $color-grey;
      }
    }

    &__header {
      width: 100%;
      padding: 16px 7px 16px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;

      .accordion--footer-bourdain & {
        padding-right: 0;
        padding-left: 0;
      }
    }

    &__menu-title {
      font-family: $font-family-primary;
      font-style: italic;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 1px;

      .accordion--faq & {
        @include h5();

        line-height: 1.29;
        letter-spacing: 0;

        @include tablet-up {
          font-size: rem(16);
          line-height: 1.5;
          letter-spacing: 1px;
        }
      }

      .accordion--footer-bourdain & {
        margin-right: 8px;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1.5;
      }
    }

    &__content {
      overflow: hidden;
      margin-bottom: 0px;

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

      .footer--center .accordion--footer-bourdain & {
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

        @include tablet-up {
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

        @include tablet-up {
          padding: 24px 24px;
        }
      }

      .accordion--faq.is-open & {
        border-top-color: $color-grey;
      }
    }

    &__icon {
      .accordion--footer-ramsay & {
        fill: $color-black-900;
      }
    }
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
    flex-shrink: 0;
    margin-right: 8px;
    .footer-main-color-light & {
      fill: $color-white;
    }

    .footer-main-color-dark & {
      fill: $color-black-900;
    }
  }

</style>
