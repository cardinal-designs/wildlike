<template lang="pug">
  .link-directory.container
    ul.link-directory__quick-links
      li.link-directory__quick-link(v-for="(link, index) in schema.settings.linkList" :key="index") 
        a.h4.link.link--primary(v-if="link.linkList.length !== 0" :href="'#' + link.title + '_links'") {{link.title}}
        span.h4.link.link--primary.link--disabled(v-else) {{link.title}}
    ul.link-directory__category-lists
      li.link-directory__category-list(v-if="link.linkList.length !== 0" v-for="(link, index) in schema.settings.linkList" :key="index" :id="link.title + '_links'")
        h2.h3.link-directory__category-title {{link.title}}
        ul.link-directory__category-links
          li.link-directory__category-link(v-for="(childLink, index) in link.linkList" :key="index")
            a.link.link--primary(:href="childLink.url") {{childLink.title}}
</template>

<script>
export default {
  name: "LinkDirectory",
  props: {
    schema: Object,
  },
  computed: {
  },
  components: {
  },
}
</script>

<style scoped lang="scss">
.link-directory {
  max-width: 1011px;
}


.link-directory__quick-links,
.link-directory__category-lists, 
.link-directory__category-list, 
.link-directory__category-links, 
.link-directory__category-link {
  padding: 0;
}

.link-directory__quick-links {
  text-align: center;
}


.link-directory__quick-link, 
.link-directory__category-link {
  display: inline-block;
  margin: 0;
}


.link-directory__quick-link {
  padding: 0 6px;
  .link:hover {
    color: $color-text-dark;
  }
  .link::before  {
    margin-top: 2px;
    height: 2px;
    background: $color-text-dark;
  }
}


.link-directory__category-list {
  margin-top: 16px;
}

.link-directory__category-title {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid $color-black-300;

  &::before {
    display: block;
    content: '';
    margin-top: $fixed-header-height--mobile*-1 - 5;
    height: $fixed-header-height--mobile + 5;
    visibility: hidden;
    pointer-events: none;

    @include desktop-up {
      margin-top: $fixed-header-height--desktop*-1 - 5;
      height: $fixed-header-height--desktop + 5;
    }
  }
}

.link-directory__category-link {
  width: 100%;
  margin-bottom: 16px;

  @include desktop-up {
    width: 33%;
  }
}
</style>