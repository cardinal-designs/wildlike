<template lang="pug">
  .collection-category-images
    h5(:class="$mq === 'mobile' ? 'h4' : ''") {{ categoryImages.heading }}
    .collection-category-images__block-container
      a.collection-category-images__block.bg-white(v-for="(image, index) in categoryImages.images" :href="image.url" :key="index")
        img.collection-category-images__image(:src="image.imageUrl")
        span {{image.text}}
</template>

<script>
  export default {
    name: "CollectionCategoryImages",
    props: {
      categoryImages: {
        type: Object,
        default: () => ({
          heading: String,
          images: {
            type: Array,
            default: () => ({
              imageUrl: String,
              url: String,
              text: String
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .collection-category-images {
    margin-bottom: 16px;
    text-align: center;
    margin-top: 32px;
    h5 {
      margin-bottom: 16px;
    }

    &__block-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    &__block {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 4px;
      box-shadow: 1px 2px 2px -1px rgba(0,0,0,0.08);
      transition: transform 300ms ease, box-shadow 300ms ease;

      @include mobile-only {
        width: calc(100% - 40px);
        margin: 0 0 24px;
      }
      @include tablet-up {
        width: calc(20% - 40px);
        margin: 0 50px 0 0;
      }

      &:hover {
        transform: translate3d(0, -2px, 0);
        box-shadow: 1px 2px 2px 1px rgba(0,0,0,0.08);
      }

      &:last-of-type {
        margin-right: 0;
      }

      span {
        font-family: $font-family-secondary;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 1px;
        line-height: 22px;
        text-align: center;
        margin-top: 8px;
        color: $color-black-900;
      }
    }
    &__image {
      object-fit: cover;
      max-height: 70%;
      max-width: 200px;
      width: 100%;
      height: 100%;

      @include mobile-only {
        max-width: none;
        max-height: none;
        height: 160px;
        width: 340px;
      }
    }
  }
</style>