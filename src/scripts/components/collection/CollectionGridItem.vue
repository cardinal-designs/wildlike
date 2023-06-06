

<template lang="pug">
  a.collection-product(:href="url", @mouseover="hovered = true", @mouseleave="hovered = false")
    img.collection-product__image(:src="currentImage", :alt="imageAlt")
    h3.collection-product__title {{ title }}
    .collection-product__details
      p.collection-product__tagline(v-if="tagline && tagline !== ''") {{ tagline }}
      p.collection-product__price {{ price }}
      v-button.collection-product__cta(label="Shop Now", :secondary="true")
</template>

<script>
  import VButton from 'scripts/components/buttons/VButton.vue'

  export default {
    name: 'CollectionGridItem',
    components: { VButton },
    data () {
      return {
        hovered: false
      }
    },
    props: {
      title: String,
      tagline: String,
      url: String,
      image: String,
      hoverImage: String,
      imageAlt: String,
      price: String
    },
    computed: {
      currentImage () {
        return (this.hovered) ? this.hoverImage : this.image
      }
    }
  }
</script>

<style scoped lang="scss">
</style>