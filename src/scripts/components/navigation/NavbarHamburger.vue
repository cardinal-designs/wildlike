
<template lang="pug">
  button.hamburger(type="button", :class="hamburgerClass", @click="toggleActiveState")
    span.hamburger-box
      span.hamburger-inner
    span.u-sr-only {{ buttonLabel }}
</template>

<script>
  export default {
    name: 'NavbarHamburger',
    data () {
      return {
        isActive: false
      }
    },
    computed: {
      buttonLabel () {
        return (this.isActive) ? 'Close Menu' : 'Open Menu'
      },
      hamburgerClass () {
        return {
          'is-active': this.isActive === true
        }
      }
    },
    methods: {
      addActiveState () {
        this.isActive = true
        this.$emit('open')
      },
      removeActiveState () {
        this.isActive = false
        this.$emit('close')
      },
      toggleActiveState () {
        if (this.isActive) {
          this.removeActiveState()
        } else {
          this.addActiveState()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  $hamburger-layer-width: 20px;
  $hamburger-layer-height: 1px;
  $hamburger-layer-spacing: 6px;
  $hamburger-layer-color: $color-black-900;

  .hamburger {
    cursor: pointer;
    display: inline-block;
    padding: 4px;
    width: $hamburger-layer-width + 8px;
    height: 24px;
    margin-top: -3px;
    margin-left: 10px;

    transition-property: opacity, filter;
    transition-duration: 0.15s;
    transition-timing-function: linear;

    // Normalize (<button>)
    font: inherit;
    color: inherit;
    text-transform: none;
    background-color: transparent;
    border: 0;
    margin: 0;
    overflow: visible;

    &.is-active {
      .hamburger-inner,
      .hamburger-inner::before,
      .hamburger-inner::after {
        background-color: $hamburger-layer-color;
      }
    }
  }

  .hamburger-box {
    width: 100%;
    height: 100%;
    display: inline-block;
    position: relative;
  }

  .hamburger-inner {
    display: block;
    top: 50%;
    margin-top: $hamburger-layer-height / -2;

    &,
    &::before,
    &::after {
      height: $hamburger-layer-height;
      background-color: $hamburger-layer-color;
      border-radius: 0;
      position: absolute;
      transition-property: transform;
      transition-duration: 0.15s;
      transition-timing-function: ease;
    }

    &,
    &::after {
      width: 100%;
    }

    &::before {
      width: 100%;
    }

    &::before,
    &::after {
      content: "";
      display: block;
    }

    &::before {
      top: -8px;
    }
  }

  .hamburger {
    .hamburger-inner {
      top: auto;
      bottom: 0;
      transition-duration: 0.13s;
      transition-delay: 0.13s;
      transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);

      &::after {
        top: -15px;
        transition: top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1),
                    opacity 0.1s linear;
      }

      &::before {
        transition: top 0.12s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1),
                    transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19);
      }
    }

    &.is-active {
      .hamburger-inner {
        transform: translate3d(0, ($hamburger-layer-spacing + $hamburger-layer-height) * -1, 0) rotate(-45deg);
        transition-delay: 0.22s;
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);

        &::after {
          top: 0;
          opacity: 0;
          transition: top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
                      opacity 0.1s 0.22s linear;
        }

        &::before {
          width: 100%;
          top: 0;
          transform: rotate(-90deg);
          transition: top 0.1s 0.16s cubic-bezier(0.33333, 0, 0.66667, 0.33333),
                      transform 0.13s 0.25s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
      }
    }
  }
</style>
