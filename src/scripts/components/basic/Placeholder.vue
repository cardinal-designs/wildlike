<template lang="pug">
  div
    transition(:name="this.transitionName")
      div(v-show="!state")
        slot(name="main")
    transition(:name="this.transitionName")
      div(v-show="state === 'loaded'")
        slot(name="main")
    transition(:name="this.transitionName")
      div(v-show="state === 'error'")
        slot(name="error")
</template>

<script>
/**
 * Show a placeholder image until the main image is loaded.
 * 
 * Slots:
 *  - placeholder
 *  - main
 *  - error 
 * 
 * @module Placeholder
 */

export default {
  name: 'Placeholder',
  mounted() {
    let loaded = 0;
    this.$slots.main
      .flatMap(vnode => {
        let loadableElements = vnode.elm.querySelectorAll('img, iframe');
        if(vnode.elm.matches('img, iframe'))
          loadableElements = [vnode.elm];

        if(!loadableElements.length) {
          this.state = 'loaded';
          return [];
        };
        return [...loadableElements];
      })
      .map((element, __, arr) => {
        if(element.complete) {// element might already be loaded
          loaded += 1;
          if(loaded === arr.length)
              this.state = 'loaded';
        } else {
          element.addEventListener(this.eventName, e => {
            loaded += 1;
            if(loaded === arr.length)
              this.state = 'loaded';
          })
        }
      })
  },
  data () {
    return {
      /** @prop {(''|'loaded'|'error')} state */
      state: '',
    }
  },
  props: {
    /** @prop {('load'|'canplay')} eventName */
    eventName: {
      type: String,
      default: 'load'
    },

    /** @prop {String} transitionName */
    transitionName: {
      type: String,
      default: 'fade'
    }
  },
}
</script>

<style>
  .fade-leave-active, .fade-leave {
    position: absolute;
  }
</style>