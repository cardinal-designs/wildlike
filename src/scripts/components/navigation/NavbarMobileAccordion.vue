<template lang="pug">
  div
    .accordion(:class="accordionClass")
      .accordion__header.header__menu-main-link(v-if="headinglink", :class="headerClass", @click.prevent="activate", :aria-label="heading")
        a.accordion__title(:href="headinglink") {{ heading }}
        span.accordion__action(@click="onActionClicked()", v-show="active") {{ action }}
        icon(:name="currentIcon" size="22px", :class="iconClass")
      .accordion__header.header__menu-main-link(v-else, :class="headerClass", @click.prevent="activate", :aria-label="heading")
        span.accordion__title {{ heading }}
        span.accordion__action(@click="onActionClicked()", v-show="active") {{ action }}
        icon(:name="currentIcon" size="22px", :class="iconClass")
      transition(:name="transition")
        .accordion__content(v-show="active", ref="content", :style="contentStyle")
          slot
    hr.mobile-menu-main-link-button-line
</template>

<script>
  import Icon from 'scripts/components/basic/Icon.vue'

  export default {
    name: 'Accordion',
    components: { Icon },
    props: {
      heading: {
        type: String,
        required: true
      },
      headinglink: {
        type: String
      },
      action: {
        type: String,
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
      theme: {
        type: String,
        default: 'default',
        validator (value) {
          return [
            'default'
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

        this.active ? classes.push(`active-accordion`) : ''

        return classes
      },
      headerClass () {
        return {
          'is-open': this.active
        }
      },
      iconClass () {
        return {
          'fill-brand-secondary': this.active
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

      window.addEventListener('resize', () => this.setContentHeight())
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

        // Set max height for animation .
        this.contentStyle = {
          'max-height': `${ height + containerPadding }px`
        }
      },
      activate () {
        if (this.$parent.activate && !this.active) {
          this.$parent.activate(this)
          this.$emit("active")
        } else {
          this.active = !this.active
        }

        this.$nextTick(() => this.setContentHeight())
      },
      onActionClicked(){
        this.$emit('actionClicked');
      },
    }
  }
</script>

<style scoped lang="scss">
  .accordion__header {
    color: $color-black-900;
  }

  .accordion__header.header__menu-main-link {
    max-height: 56px;
  }

  hr.mobile-menu-main-link-button-line {
    background-color: $color-black-300;
    margin: 4px 17px 0px 17px;
  }

  .accordion {
    &.accordion--footer-ramsay {
      background-color: transparent;
    }

    &__title {
      font-size: 20px;
      letter-spacing: .5px;
      font-family: $font-family-secondary;
      font-weight: 700;
      color: $color-black-900;
    }

    &__action {
      font-size: 12px;
      line-height: 16px;
      text-decoration: underline;
      padding:0 10px;
    }

    &__header {
      width: 100%;
      padding: 17px 16px 16px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: lighter;
      color: $color-black-900;

      .navbar__mobile__nav & {
        letter-spacing: -0.1px;
        line-height: 36px;
        color: $color-black-900;
      }
    }

    &__content {
      overflow: hidden;
      color: $color-black-900;
      padding: 0;

      &--wrapper {
        overflow: hidden;
      }
    }

    .icon {
      transition: none;
    }
  }

  .active-accordion .accordion__title {
    size: $font-size-h4-mobile;
    font-family: $font-family-secondary;
    text-decoration: none;
    font-weight: $font-weight-h4-mobile;
  }

</style>
