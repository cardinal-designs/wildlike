
<template lang="pug">
  .menu-group
    slot
</template>

<script>
  export default {
    name: 'MenuGroup',
    data () {
      return {
        menus: []
      }
    },
    methods: {
      addMenu (menu) {
        this.menus.push(menu)
      },
      removeMenu (menu) {
        let index = this.menus.findIndex(a => a.heading === menu.heading)
        this.menus.splice(index, 1)
      },
      activate ({ heading }) {
        const toOpen = this.menus.filter(a => !a.active)
        const toClose = this.menus.filter(a => a.active && a.autoClose !== false)

        toOpen.concat(toClose)
          .forEach((menu) => {
            menu.active = Boolean(heading === menu.heading)
          })
      }
    }
  }
</script>

<style scoped lang="scss">
</style>