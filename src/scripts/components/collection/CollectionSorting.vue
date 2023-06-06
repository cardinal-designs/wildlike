
<template lang="pug">
  .collection-sorting
    select-input(v-if="$mq !== 'mobile'" :disableDefault="true" :options="sortingOptions", v-model="currentValue")
    .collection-sorting__mobile(v-else)
      .collection-sorting__mobile-option(
          v-for="option in sortingOptions"
          :key="option.value"
          :class="isActvieSortMethod(option.value)"
          @click="mobileSortSelect(option.value)")
        span.body-md {{option.label}}

</template>

<script>
  import { mapState } from 'vuex';
  import SelectInput from 'scripts/components/forms/SelectInput.vue'

  export default {
    name: 'CollectionSorting',
    components: { SelectInput },
    props: {
      defaultSort: String,
      mobileClickBinding: Function,
      value: String,
    },
    data () {
      return {
        currentValue: this.value ? this.value : this.defaultSort,
        sortingOptions: [
          { label: 'Featured', value: 'manual' },
          { label: 'Most Popular', value: 'best-selling' },
          { label: 'Newest Arrivals', value: 'created-descending' },
          { label: 'Price: Low to High', value: 'price-ascending' },
          { label: 'Price: High to Low', value: 'price-descending' },
          { label: 'A-Z', value: 'title-ascending' },
          { label: 'Z-A', value: 'title-descending' }
        ]
      }
    },
    methods: {
      mobileSortSelect(value) {
        this.currentValue = value
        if(this.mobileClickBinding) {
          this.mobileClickBinding()
        }
      },
      isActvieSortMethod(value) {
        if(this.currentValue === value) {
          return 'sort-active'
        }
      }
    },
    watch: {
      value() {
        this.currentValue = this.value;
      },
      currentValue() {
        this.$store.dispatch('collections/updateSort', this.currentValue)
        this.$emit('input', this.currentValue)
      }
    }
  }
</script>

<style scoped lang="scss">
  .collection-sorting {
    min-width: 315px;

    @include mobile-only {
      max-width: none;
      width: 100%;
    }
    &__mobile {
      margin: 25px 16px;
      border-top: 1px solid $color-black-300;

      &-option {
        text-align: center;
        padding: 16px;
        border-bottom: 1px solid $color-black-300;
        cursor: pointer;
        &.sort-active {
          span {
            font-weight: 700;
          }
        }
      }
    }
    
    /deep/ .vs__open-indicator {
      fill: $color-black-900;
    }
  }
</style>