<template lang="pug">
  section.seo-content-accordion
    .seo-content-accordion__wrapper
      h2.seo-content-accordion__header {{ title }}
      div.seo-content-accordion__content(:style="contentBlockHeight")
          div(ref="content" v-html="content")
      div.seo-content-accordion__cta-wrapper
        button.link.link--secondary(@click.prevent="activate")
          span.link__content {{ active ? 'Read Less' : 'Read More' }}
</template>

<script>
  export default {
    name: 'SeoContentBlock',
    components: {},
    props: {
      title: String,
      content: String,
    },
    data() {
      return {
        active: false,
        contentBlockHeight: {
          maxHeight: '72px',
        },
      };
    },
    methods: {
      activate() {
        if (this.$parent.active && !this.active) {
          this.$parent.activate(this);
          this.$emit('active');
        } else {
          this.active = !this.active;
        }

        this.$nextTick(() => this.setMaxContentHeight());
      },
      setMaxContentHeight() {
        const contentHeight = this.$refs.content.scrollHeight;

        this.contentBlockHeight = {
          maxHeight: this.active ? `${contentHeight + 10}px` : '72px',
        };
      },
    },
  };
</script>

<style lang="scss">
  .seo-content-accordion {
    &__header {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.5rem;
      padding-bottom: 8px;
      text-transform: uppercase;

      @include mobile-only {
        font-size: 1.375rem;
        line-height: 1.375rem;
      }
    }

    &__content {
      margin-bottom: 8px;
      padding-bottom: 10px;
      overflow: hidden;
      transition: 0.2s max-height ease-in-out;

      p {
        font-size: 1rem;
        line-height: 1.5rem;
        font-family: $font-family-secondary;
      }

      div {
        font-family: $font-family-secondary;
      }

      @include link;
      @include link--tertiary;
      a {
        @extend .link;
        @extend .link--tertiary;
      }

      h2 {
        @extend .seo-content-accordion__header;
      }
    }
  }
</style>
