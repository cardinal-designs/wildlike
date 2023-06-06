
<template lang="pug">
  .product-value-props(:style="{ 'background-color': schema.settings.backgroundColorProductValueProps }")
    .container
      //- 3 Columns
      .product-value-prop-container(v-if="schema.blocks[3].settings.title")
        .product-value-prop(v-for="block in schema.blocks" :key="block.id")
          .product-value-prop__content(v-if="block.settings.title && block.settings.body")
            .product-value-prop__icon
              img(:src="block.settings.icon" :alt="block.settings.icon")
            .product-value-prop__text 
              h4.product-value-prop__title(v-if="block.settings.title") {{ block.settings.title }}
              p.product-value-prop__body.body-md(v-if="block.settings.body" v-html="block.settings.body")
      //- 4 Columns
      .product-value-prop-container(v-else)
        .product-value-prop(v-for="block in schema.blocks.slice(0, 3)" :key="block.id")
          .product-value-prop__content(v-if="block.settings.title && block.settings.body")
            .product-value-prop__icon
              img(:src="block.settings.icon" :alt="block.settings.icon")
            .product-value-prop__text
              h4.product-value-prop__title(v-if="block.settings.title") {{ block.settings.title }}
              p.product-value-prop__body.body-md(v-if="block.settings.body" v-html="block.settings.body")
</template>

<script>
  export default {
    name: 'ProductValueProps',
    props: {
      schema: Object
    },
  }
</script>

<style scoped lang="scss">
  .product-value-props-container {
    background-color: $color-black-100;
    padding: 56px 31px 48px 31px;

    @include desktop-up {
      padding: 90px 106px 98px 106px;
    }
  }

  .product-value-prop-container {
    @include desktop-up {
      display: flex;
      padding-top: 67px;
      padding-bottom: 77px;
    }
  }

  .product-value-prop {
    @include desktop-up {
      width: 100% !important;
      height: auto;
      border-right: 1px solid $color-black-300;
      flex-shrink: 1;
    }

    &:last-child {
      border-right: 0;
    }

    &__content {
      display: flex;
      height: 100%;
      flex-direction: column;
      align-items: center;
      margin: 0 auto;
      position: relative;

      &:after {
        @include mobile-only {
          content: "";
          background: $color-black-300;
          position: absolute;
          bottom: 0;
          height: 1px;
          width: 80%;
        }
      }
      
      @include mobile-only {
        flex-direction: row;
        padding-top: 32px;
        padding-bottom: 23px;
        align-items: center;
        justify-content: center;
      }
      
      @include desktop-up {
        justify-content: flex-start;
        text-align: center;
        max-width: 312px;
      }
    }

    &__icon {
      height: 38px;
      width: auto;
      margin-bottom: 21px;
      @include mobile-only {
        height: 38px;
        max-width: 42px;
        margin-right: 20px;
      }
    }

    &__title {
      margin-bottom: 8px;

      @include desktop-up {
        margin-bottom: 16px;
      }
    }

  }
  img {
    height: 38px;
    @include mobile-only {
      height: auto;
      margin-right: 20px;
      width: 100%;
      object-fit: cover;
    }
  }
  .product-value-prop {
    &:last-child {
      .product-value-prop__content {
        &:after {
          @include mobile-only {
            content: "";
            height: 0px;
          }
        }
      }
    }
  }
</style>