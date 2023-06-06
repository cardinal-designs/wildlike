<template lang="pug">
  .super-collection-linear(
    v-if="validTiles.length > 0"
    :class="{ 'super-collection-linear--with-background' : settings.background, [settings.backgroundColor]: settings.backgroundColor }" 
    :style="{ backgroundImage: settings.background ? `url(${settings.background})` : '' }")
    .container
      .super-collection-linear__content
        header.super-collection-linear__heading(v-if="settings.heading")
          h4.text-center(:class="settings.headingColor") {{ settings.heading }}
        .super-collection-linear__tile-container
          a.super-collection-linear__tile(v-for="(tile, index) in settings.linearArray" :key="index" :href="tile.url")
            .super-collection-linear__tile-image-wrapper.bg-white
              img.super-collection-linear__tile-image(:src="tile.image" :alt="tile.title")
            .super-collection-linear__tile-title.text-center.color-off-black {{tile.title}}
</template>

<script>
  export default {
    name: 'SuperCollectionLinear',
    props: {
      settings: {
        type: Object,
        default: () => ({}),
      }
    },
    computed: {
      validTiles() {
        return this.settings.linearArray.filter((tile) => tile.title && tile.image && tile.url);
      },
      linearSlides() {
        const slideArray = [];
        
        for (let i = 0; i < this.validTiles.length; i+=2) {
          const innerSlideArray = [];

          innerSlideArray.push(this.validTiles[i]);
          if (this.validTiles[i + 1]) innerSlideArray.push(this.validTiles[i + 1]);

          slideArray.push(innerSlideArray);
        }

        return slideArray;
      }
    },
  }
</script>

<style lang="scss">
  .super-collection-linear {
    overflow: hidden;

    &.super-collection-linear--with-background {
      margin-bottom: 24px;

      @include tablet-up {
        margin-bottom: 72px;
      }
    }

    &[class*="bg"] {
      @include mobile-only {
        padding-top: 20px;
      }
    }

    &__heading {
      margin-bottom: 20px;

      @include tablet-up {
        margin-bottom: 16px;
      }
    }

    
    &__content {
      display: block;

      @include tablet-up {
        padding: 20px 0;
      }

      .super-collection-linear--with-background & {
        margin: 60px 0;
        padding: 40px 16px;
        background-color: $color-white;
        border-radius: $super-collection-border-radius;

        @include desktop-up {
          padding: 40px 24px;
        }
        @include hd-up {
          padding: 40px;
        }
      }
    }

    &__tile-container {
      display: flex;
      margin: 0 -8px;
      justify-content: center;
      flex-wrap: wrap;

      @include tablet-up {
        flex-wrap: nowrap;
      }
    }

    &__tile {
      margin: 0 8px 16px;
      max-width: 400px;
      width: calc(50% - 16px);
      flex-basis: calc(50% - 16px);

      @include tablet-up {
        margin: 0 8px;
        width: 100%;
        flex-basis: 100%;
      }
    }

    &__tile-image-wrapper {
      display: flex;
      margin-bottom: 8px;
      width: 100%;
      box-shadow: $drop-shadow--light;
      transition: transform 300ms ease, box-shadow 300ms ease;
      align-items: center;
      justify-content: center;

      @include tablet-up {
        max-height: none;
      }

      &:hover {
        transform: translate3d(0, -2px, 0);
        box-shadow: $drop-shadow-hover--light;
      }
    }

    &__tile-image {
      display: block;
    }

    &__tile-title {
      @include h7-tablet();
    }
  }
</style>