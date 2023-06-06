<template lang="pug">
  div.show-more(:class="classes", v-on="$listeners")
    div.show-more__content(ref="content" :style="style")
      div.show-more__overlay
      slot
    p.show-more__button-container
      slot(name="button")
        button(@click="toggle", secondary).show-more__button.link.link--secondary
          span.link__content {{ isExpanded ? 'Show Less' :'Show More'}}
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  name: 'AccordionTease',
  data() {
    return {
      isExpanded: this.expanded,
      toggled: false,
      tease: false,
      contentHeight: 0
    }
  },
  computed: {
    style () {
      if(this.isExpanded) {
        return {
          maxHeight: `${this.contentHeight}px`,
        }
      }
      return {
        maxHeight: `${this.collapsedHeight}px`
      }
    },
    classes() {
      const expanded = this.isExpanded;

      return {
        'show-more--tease': this.tease,
        'show-more--no-tease': !this.tease,
        'show-more--collapsed': !expanded,
        'show-more--expanded': expanded,
        'show-more--indempotent': this.idempodent
      }
    }
  },
  mounted () {
    // check if we need to do anything
    if(this.$refs.content.scrollHeight > this.collapsedHeight)
      this.tease = true;

    // update the height with screen width changes
    if(this.tease) {
      this.resizeFunc = debounce(() => {
        try {
          this.contentHeight = this.$refs.content.children[1].scrollHeight;
        } catch(e) { /* noop */}
      });
      window.addEventListener('resize', this.resizeFunc)
    }
  },
  beforeDestroy() {
    // cleanup resize function
    if(this.resizeFunc)
      window.removeEventListener('resize', this.resizeFunc);
  },
  props: {
    expanded: {
      type: Boolean,
      default: false,
    },
    idempodent: {
      type: Boolean,
      default: false,
    },
    collapsedHeight: {
      default: 444,
      type: Number
    },
    onTeaseExpand: Function,
  },
  methods: {
    toggle() {
      if(this.idempodent && this.toggled) return;
      this.isExpanded = !this.isExpanded;
      this.toggled = true;
      this.contentHeight = this.$refs.content.scrollHeight;

      if(this.onTeaseExpand instanceof Function)
        this.onTeaseExpand(this);
    }
  },
  watch: {
    expanded(newValue) {
      this.isExpanded = newValue;
    }
  },
}
</script>

<style lang="scss">
  .show-more {
    position: relative;

    &__content {
      overflow: hidden;
      transition: max-height .5s linear;
      position: relative;

      * {
        font-family: $font-family-secondary;
        font-weight: 600;
      }
    }

    &__overlay {
      position: absolute;
      height: 50%;
      width: 100%;
      background: linear-gradient(180deg, rgba(250, 251, 250, 0) 0%, rgba(253, 253, 253, .98) 75%, rgba(253, 253, 253, 1) 100%);
      z-index: 1;
      bottom: 0;
      left: 0;
    }

    &__button-container {
      padding: 0 0 0;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
    }

    &__button {
      text-transform: none;
    }
  }

  .show-more.show-more--expanded {
    .show-more--indempotent.show-more__button-container {
      display: none;
    }

    .show-more__overlay {
      display: none;
    }

    .show-more__button-container {
      padding-bottom: 8px;
      position: static;
    }
  }

  .show-more.show-more--no-tease {
    .show-more__overlay {
      display: none;
    }

    .show-more__button-container {
      display: none;
    }
  }
</style>
