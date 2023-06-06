<template lang="pug">
  section.seo-collection-content-block(:style="contentBlockStyles")
    .seo-collection-content-block__wrapper
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
  .seo-collection-content-block {
    &__wrapper {
      box-sizing: border-box;
      margin: 0 auto;
      max-width: 1432px;
      padding: 0 20px 0 354px;

      @include mobile-tablet {
        padding: 0 20px;
      }
    }
  }
</style>