<template lang="pug">
.container
  .collection-hero
    .collection-hero__with-image(v-if="defaultSettings.imageUrl")
      .collection-hero__text
        h1(:class="[$mq !== 'mobile' ? 'h2' : 'h3']") {{heroTitle}}
        .description-field.body-md(v-html="heroDescription")
      .collection-hero__with-image-image(
        :style="`backgroundImage: url(${imageUrl})`")
    .collection-hero__no-image(v-else)
      .collection-hero__text
        h1(:class="[$mq !== 'mobile' ? 'h2' : 'h3']") {{heroTitle}}
        .description-field.body-md(v-html="heroDescription")
</template>

<script>
  export default {
    name: 'CollectionHero',
    props: {
      defaultSettings: {
        type: Object,
        required: true,
        default: () => ({
          title: String,
          description: String,
          imageUrl: String
        })
      },
    },
    computed: {
      heroTitle() {
        return this.defaultSettings.title
      },
      heroDescription() {
        return this.defaultSettings.description
      },
      imageUrl() {
        return this.defaultSettings.imageUrl
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    background-color: $color-white;
    @include mobile-only {
      padding: 0;
    }
  }
  .collection-hero {
    width: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    @include mobile-only {
      min-height: 0;
    }
    &__with-image, &__no-image {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include mobile-only {
        flex-direction: column-reverse;
      }
      &-image {
        width: 60%;
        height: 288px;
        background-size: cover;
        background-position: center;
        @include mobile-only {
          width: 100%;
          height: 176px;
        }
      }
    }

    &__text {
      width: 40%;
      display: flex;
      flex-direction: column;

      @include mobile-only {
        padding: 24px 13px;
        width: 100%;
        text-align: center;
        min-height: 0;
      }
      h1 {
        margin: 0;
      }
      .description-field {
        margin: 16px 0 0;
        @include mobile-only {
          margin: 8px 0 0;
        }
      }
    }

    &__with-image {
      .collection-hero__text {
        text-align: left;

        @include desktop-up {
          padding-top: 0;
          padding-bottom: 0;
        }
      }
      &.overlaid {
        .collection-hero__text {
          box-shadow: 1px 2px 4px -1px rgba(0,0,0,0.2);
          border-radius: 4px;

          @include mobile-only {
            padding: 24px 13px;
            width: 90%;
            text-align: center;
            margin-top: -64px;
            margin-bottom: 32px;
            z-index: 5;
            box-shadow: 1px 1px 2px -1px rgba(0,0,0,0.2);
          }
        }
        .collection-hero__with-image-image {
          width: 80%;
          @include mobile-only {
            width: 100%;
          }
        }
        .collection-hero__text {
          @include desktop-up {
            padding: 32px;
            margin: 16px 0;
            z-index: 5;
          }
        }
      }
    }
    &__no-image {
      justify-content: center;

      .collection-hero {
        &__text {
          text-align: center;
        }
      }
    }
  }
</style>