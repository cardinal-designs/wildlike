<template lang="pug">
  .collection-mobile-menu(:class="{'menu-active': menuActive}")
    .collection-mobile-menu__header
      .collection-mobile-menu__header-title
        h4 {{menuTitle}}
      icon.collection-mobile-menu__header-close(@click="closeBinding" name="close" size="24px")
    vue100vh.collection-mobile-menu__container
      .collection-mobile-menu__contents
        slot
      .collection-mobile-menu__apply-button
        v-button(v-if="enableApplyButton" :primary="true" :full="true" @click="closeBinding" label="APPLY")
</template>

<script>
  import { mapState } from 'vuex'

  import Icon from 'scripts/components/basic/Icon.vue'
  import VButton from 'scripts/components/buttons/VButton.vue'
  import VLink from 'scripts/components/buttons/VLink.vue'
  import Vue100vh from 'scripts/components/basic/Vue100vh.vue'

  export default {
    name: "CollectionMobileMenuB",
    components: { Icon, VButton, VLink, Vue100vh },
    props: {
      menuActive: {
        type: Boolean,
        default: false
      },
      menuTitle: {
        type: String,
        required: true
      },
      enableApplyButton: {
        type: Boolean,
        default: false
      },
      closeBinding: {
        type: Function,
        required: true
      }
    },
    computed: {
      ...mapState({
        currentFilters: state => state.collections.currentFilters
      })
    }
  }
</script>

<style lang="scss" scoped>
  .collection-mobile-menu {
    background-color: $color-white;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    opacity: 0;
    transform: translate3d(-100%,0,0);
    transition: transform 250ms ease-in-out, opacity 200ms ease;
    display: flex;
    flex-direction: column;
    &.menu-active {
      opacity: 1;
      transform: translate3d(0,0,0);
    }
    &__header {
      position: relative;
      align-items: center;
      padding: 16px;
      background-color: $color-primary-400;

      &-title {
        width: 100%;
        text-align: center;
        /deep/ .link {
          margin-left: 16px;
        }
      }
      &-close {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    &__container {
      transform: translate(0,0); //this is to allow the apply button to position:fixed
    }
    &__contents {
      position: relative;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      padding-bottom: 48px;
    }
    &__apply-button {
      width: 100%;
      position: fixed;
      bottom: 0;
      padding: 20px 20px 20px 20px;
      padding-bottom: 32px;
      transform: translateY(-50%);
      background-color: $color-white;
    }
    &__filters-clear {
      cursor: pointer;
    }
  }
  .collection-mobile-menu__apply-button .button {
    width: 100%;
  }
</style>