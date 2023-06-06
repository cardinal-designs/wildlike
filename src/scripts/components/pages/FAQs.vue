<template lang="pug">
  .faq
    accordion-group.faq__category(v-for="(faqsObj, index) in faqsList" :key="index")
      span.faq__title.h3 {{faqsObj.category}}
      accordion(
        v-for="(faq, subindex) in faqsObj.values"
        :key="subindex"
        :heading="faq.question"
        activeIcon="minus"
        :auto-close="false"
        theme="faq")
          div.faq__answer.client-generated(v-html="faq.answer")
</template>

<script>
import AccordionGroup from 'scripts/components/basic/AccordionGroup.vue';
import Accordion from 'scripts/components/basic/Accordion.vue';

export default {
  name: 'FAQs',
  components: {
    AccordionGroup,
    Accordion,
  },
  props: {
    faqsList: {
      type: Array,
      default: () => ([{}])
    }
  },
  data() {
    return {};
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.faq {
  margin-top: 32px;
  margin-bottom: 0;

  @include tablet-up {
    padding-top: 16px;
  }

  &__category {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__title {
    display: block;
    margin-bottom: 24px;
    font-family: $font-family-primary;
  }

  &__answer {
    margin-bottom: 0;
  }
}
</style>

<style lang="scss">
  .accordion.accordion--faq a.accordion__header {
    text-decoration: none;
    padding: 16px 8px;

    .accordion__menu-title {
      font-size: rem($font-size-h5-mobile);
      letter-spacing: 1px;

      @include desktop-up {
        font-size: rem($font-size-h5-desktop);
      }
    }
  }


  .faq__answer {
    ul {
      margin: 0;
      padding-left: 20px;

      @include tablet-up {
        padding-left: 27px;
      }

      li {
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    p {
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }

    tbody {
      border-top-color: $color-faq-table-border;
    }
  }
</style>
