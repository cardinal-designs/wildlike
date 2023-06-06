<template lang="pug">
  .sub-nav
    p.sub-nav__title.strong-medium-mobile {{title}}
    .u-hidden-tablet-up
      select-input(:options="options" :selected="pagePath" :placeholder="placeholder" @input="triggerMobileLink")
    .u-hidden-mobile-only
      ul.sub-nav__list
        li.sub-nav__list-item(v-for="(option, index) in options" :key="index")
          span.strong-bold.sub-nav__link(v-if="option.value === pagePath") {{option.label}}
          a.sub-nav__link.link.link--primary(v-else :href="option.value")
            span.link__content {{ option.label }}
</template>

<script>
import SelectInput from 'scripts/components/forms/SelectInput.vue';

export default {
  name: 'SubNav',
  components: {
    SelectInput,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
    },
    pagePath: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  methods: {
    triggerMobileLink(path) {
      if (path === window.location.pathname || path.length <= 0) {
        return;
      }
      window.location.href = path;
    },
  },
};
</script>

<style lang="scss" scoped>
.sub-nav {
  margin-bottom: -16px;
  padding: 20px 16px 0;
  width: 100%;

  @include tablet-up {
    padding: 56px 12px 0 28px;
    width: 200px;
    flex: 0 0 auto;
  }
  @include desktop-up {
    width: 240px;
  }

  &__title {
    margin-bottom: 8px;
    font-size: rem(14);
    line-height: 1.14;
    text-align: center;

    @include tablet-up {
      margin-bottom: 16px;
      font-size: rem(18);
      line-height: 1.33;
      text-align: left;
    }
  }

  &__list {
    list-style: none;
    padding-left: 0;
  }

  &__list-item {
    margin-bottom: 16px;
    font-size: rem(18);
    line-height: 1.33;
  }

  &__link {
    display: inline-block;
    font-size: inherit;
    line-height: inherit;

    .link__content {
      font-size: inherit;
      line-height: inherit;
    }
  }

  .input--select {
    margin-bottom: 0;
  }
}
</style>
