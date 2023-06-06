<template lang="pug">
  a.collection-promo-tile(
    v-if="promoTile.enabled === 1"
    :href="promoTile.url ? promoTile.url : ''")
    img.collection-promo-tile__image(:src="promoTile.imageUrl")
    .collection-promo-tile__text
      h3(v-if="promoTile.title") {{promoTile.title}}
      a(v-if="promoTile.copy") {{promoTile.copy}}
</template>

<script>
  export default {
    name: "CollectionPromoTile",
    props: {
      promoTile: Object,
      default: () => ({
        enabled: Number,
        position: Number,
        url: String,
        textColor: String,
        imageUrl: String,
        title: String,
        copy: String
      })
    }
  }
</script>

<style lang="scss" scoped>
  .collection-promo-tile {
    display: flex;
    position: relative;
    max-width: (($container-max-width / 4) - (8px * 3));
    height: 343px;

    @include mobile-only {
      height: 233px;
    }

    &__image {
      object-fit: cover;
      object-position: center;
    }

    &__text {
      position: absolute;
      top: 0;
      left: 0;
      margin-top: 12px;
      background-color: rgba(255, 255, 255, 0.8);
      width: 160px;
      padding: 8px 8px 16px 17px;
      color: $color-text-dark;

      @include mobile-only {
        margin-top: 8px;
        padding: 8px 8px 16px 8px;
        max-width: 153px;
      }

      h3 {
        margin-bottom: 8px;
        letter-spacing: 1px;
        line-height: 28px;

        @include mobile-only {
          font-size: 20px;
          line-height: 24px;
          letter-spacing: 0.7px;
        }
      }

      a {
        font-size: 16px;
        line-height: 24px;
        text-decoration: underline;
        &:visited {
          color: $color-text-dark;
        }
        &:hover {
          color: $color-text-accent;
        }
        &:active {
          text-decoration: none;
        }
      }
    }
  }
</style>