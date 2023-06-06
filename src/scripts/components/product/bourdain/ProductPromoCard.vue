<template lang="pug">
  .promo
    p.promo__heading
      slot(name="heading")
    p.promo__subheading.body-sm.text-center
      slot(name="subheading")
</template>
  
<script>
export default {
  name: 'ProductPromoCard'
}
</script>

<style lang="scss" scoped>
  .promo {
    padding: 8px;
    border: 1px solid $color-brand-secondary;
    box-shadow: $drop-shadow--light;
    border-radius: 2px;

    &__heading {
      display: flex;
      align-items: center;
      justify-content: center;

      * {
        vertical-align: bottom;
      }
    }

    .icon {
      margin: 0 4px;
    }
  }
</style>