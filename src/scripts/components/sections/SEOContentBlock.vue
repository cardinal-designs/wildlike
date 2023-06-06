<template lang="pug">
  section.seo-content-block(:style="contentBlockStyles")
    .seo-content-block__wrapper
      seo-content-accordion(:title="schema.settings.title", :content="schema.settings.content")
</template>

<script>
import SeoContentAccordion from '../basic/SEOContentAccordion.vue';
export default {
  name: 'SeoContentBlock',
  components: {
    SeoContentAccordion
  },
  props: {
    schema: Object
  },
  data () {
    return {
      contentBlockStyles: {
        paddingTop: `${this.schema.settings.marginTop}px`,
        paddingBottom: `${this.schema.settings.marginBottom}px`,
      }
    };
  },
  computed: {},
  mounted () {},
  beforeDestroy () {},
  methods: {}
}
</script>

<style lang="scss">
  .seo-content-block {
    &__wrapper {
      box-sizing: border-box;
      margin: 0 auto;
      max-width: 1170px;
      padding: 0 20px;
    }
  }
</style>