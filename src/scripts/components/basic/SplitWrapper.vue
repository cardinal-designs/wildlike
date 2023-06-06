<template lang="pug">
  .sw__main-image-content-container(:style="paddingStyles")
    section.sw(:class="[imageWidthClass, backgroundColorClass, reversedClass]")
      div.sw__image
        slot(name="image")
      article.sw__main(
        :class="[textAlignmentClass, backgroundColorClass]"
      )
        .sw__main-wrap
          slot(name="content")
</template>

<script>
import { px } from 'scripts/filters/string.js'
import { checkUndefined } from 'scripts/helpers/util.js';

const imageWidthClassOptions = ['', 'sw--40', 'sw--50', 'sw--60'];
const reversedClassOptions = ['', 'sw--reverse'];
const textAlignmentOptions = ['', 'text-center'];

export default {
  name: "SplitWrapper",
  props: {
    backgroundColorClass: {
      type: String,
      default: ''
    },
    imageWidthClass: {
      type: String,
      validator: p => imageWidthClassOptions.includes(p),
      default: 'sw--50'
    },
    textAlignmentClass: {
      type: String,
      validator: p => textAlignmentOptions.includes(p),
      default: ''
    },
    reversedClass: {
      type: String,
      validator: p => reversedClassOptions.includes(p),
      default: ''
    },
    marginTop: {
      type: Number,
      default: 48
    },
    marginBottom: {
      type: Number,
      default: 48
    },
  },
  computed: {
    paddingStyles() {
      return {
        'padding-top': this.$mq === 'mobile' || this.$mq === 'tablet' ? 0 : px(checkUndefined(this.marginTop, 56)), 
        'padding-bottom': this.$mq === 'mobile' || this.$mq === 'tablet' ? 0 : px(checkUndefined(this.marginBottom, 56))
      }
    }
  }
}
</script>

<style lang="scss">
  .sw {

    &__main-image-content-container {
      
      @include tablet-up {
        display: flex;
      }
    }

    display: flex;
    flex-direction: column;
    padding: 24px 12px 24px;
    width: 100%;
    max-width: $container-max-width;
    margin: 0 auto;
    min-height: 318px;

    &__image {
      flex: 1 1 50%;
      min-height: 100%;
    }

    &__image > * {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    &__main {
      width: 100%;
      flex: 0 0 50%;
    }

    &__main-wrap {
      padding-top: 8px;
    }

    .text-center {
      justify-content: center;
    }

    @include tablet-up {
      flex-direction: row;
      flex-wrap: nowrap;
      padding: 0;
      min-height: 444px;
      align-items: stretch;

      &__main {
        display: flex;
        align-items: center;
        padding: 5%;
      }
    }

    @include desktop-up {
      min-height: 544px;
    }
  }

  @include mobile-only {
    .sw {
      &__image {
        height: 296px;
      }
    }
  }

  .sw--reverse {
    @include tablet-up {
      .sw__image {
        order: 2;
      }
    }
  }

  .sw__main {
    padding: 24px 14px 24px;

    @include tablet-up {
      padding: 5%;
    }
  }

  .sw--50 .sw__main {
    padding: 24px 0 24px;

    @include tablet-up {
      padding: 5%;
    }
  }

  .sw--40 {
    @include tablet-up {
      .sw__image {
        flex: 0.8 0 40%;
      }

      .sw__main {
        padding: 3%;
        flex: 0 1.2 60%;
      }
    }
  }

  .sw--60 {
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
    max-width: 100vw;

    .sw__main {
      padding-left: 12px;
      padding-right: 12px;
    }

    @include tablet-up {
      .sw__image {
        flex: 1.2 0 60%;
      }

      .sw__main {
        padding: 5%;
        flex: 0 .8 40%;
      }

      .sw__main-wrap {
        padding: 0;
      }
    }
  }
</style>