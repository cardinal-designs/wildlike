
<template lang="pug">
  .navbar__logo.smaller-logo
    h1(v-if="h1")
      a.navbar__logo__image(href="/")
        img(:src="image", :srcset="imageSource", :alt="alt")
        span.u-hidden {{ alt }}
    div(v-else)
      a.navbar__logo__image(href="/")
        img(:src="image", :srcset="imageSource", :alt="alt")
</template>

<script>
  export default {
    name: 'NavbarLogo',
    data: function() {
      return {
        scrolled: true
      }
    },
    props: {
      image: String,
      largeImage: String,
      alt: String,
      h1: Boolean,
    },
    computed: {
      imageSource () {
        return `${this.image} 1x, ${this.largeImage} 2x`
      }
    }
  }
</script>

<style scoped lang="scss">
  h1 {
    margin: 0;
  }

  .navbar__logo {
    width: 166px;

    @include desktop-up {
      margin-right: 16px;
    }
  }

  .navbar__logo__image {
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {

      @include mobile-tablet {
        max-height: 40px;
      }

      @include desktop-up {
        justify-content: flex-start;
        // padding: 35px 0; // was overlaying other clickable elements
        width: 166px;
        transition: width .15s ease-in;
      }
    }
  }

  .header-fixed .navbar__logo__image {
    img {
      @include desktop-up {
        width: 121px;
      }
    }
  }

  .navbar__logo__image--svg {
    @include desktop-up {
      height: 19vh;
    }
  }
</style>