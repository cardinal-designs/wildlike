
<template lang="pug">
 
  div(:class="$mq === 'mobile' && heroSchema.mobileLayout === 'below' ? heroSchema.mobileBgColor : null")
    //- DESKTOP
    .hero-banner__container(v-show="$mq !== 'mobile'" :style="containerStyle" :class="heroSchema.layout")
      video.hero-banner__background-video(v-if="heroSchema.backgroundVideo.length > 0" :poster="heroSchema.image" autoplay="true" muted="true" loop="true")
        source(:src="heroSchema.backgroundVideo")
      .hero-banner(:class="[layoutHorizontal, layoutVertical($mq), textAlign]" :style='[backgroundStyles, layoutStyle]')
        .hero-banner__content-container
          div.hero-banner__content-background(:style="contentBackgroundStyles")
          .hero-banner__content(:class="contentProperties.classes" :style="contentProperties.style")
            h4.preheader.hero-banner__preheading(v-if="heroSchema.preHeading", :class="heroSchema.preHeadingColor") {{heroSchema.preHeading}}
            h2.h1.hero-banner__heading(v-if="heroSchema.heading", :class="heroSchema.headingColor") {{heroSchema.heading}}
            h3.subheader.hero-banner__subheading(v-if="heroSchema.subHeading", :class="heroSchema.subHeadingColor") {{heroSchema.subHeading}}
            p.body-md.hero-banner__body-copy(v-if="heroSchema.copy", :class="heroSchema.copyColor") {{heroSchema.copy}}
            OptionSelectDropdown(:product="heroSchema.aProduct" @input="selectOptionChange($event)")
              //- option(v-for="option in  heroSchema.allProducts") {{  (option) }}
            template(v-for="(variant, optIndex) of heroSchema.aProduct")
              .hero-banner__input-container
                input.hero-banner__input(
                  type="hidden"
                  :name="heroSchema.serviceProductHandle"
                  :id="variant.id"
                  @change="variantChange(optIndex, variant)"
                )
                label(
                  :for="variant.id"
                ) 
            form(
              method="post"
              id="cartform"
              action="/cart/add"
            )
              input.hero-banner__input(
                type="hidden"
                name="id"
                  :data-productid="heroSchema.serviceProductID"
                  :value="selectedVariantId"
                )
                

              div(
                id="sesami__buttonWrapper"
                :class="[productIdAsClassName]"
                :data-sesami-product-id="heroSchema.serviceProductID"
                :data-sesami-variant-id="selectedVariantId"
              )
    //- MOBILE
    .hero-banner__container(v-show="$mq === 'mobile'" :style="containerStyle" ref="main")
      .hero-banner(:class="[...textAlignMobile, layoutVertical($mq), heroSchema.mobileLayout]")
        video.hero-banner__background-video(v-if="heroSchema.backgroundVideo.length > 0" :poster="heroSchema.image" autoplay="true" muted="true" loop="true" playsinline="true")
          source(:src="heroSchema.backgroundVideo")
        .hero-banner__image-mobile(v-else :style="backgroundStylesMobile")
        .hero-banner__content(:class="[{[heroSchema.mobileBgColor]: heroSchema.mobileLayout === 'below'}, contentProperties.classes]" :style="contentProperties.style")
          h4.preheader.hero-banner__preheading(v-if="heroSchema.preHeading", :class="heroSchema.preHeadingColorMobile") {{heroSchema.preHeading}}
          h2.h1.hero-banner__heading(v-if="heroSchema.heading", :class="heroSchema.headingColorMobile") {{heroSchema.heading}}
          h3.subheader.hero-banner__subheading(v-if="heroSchema.subHeading", :class="heroSchema.subHeadingColorMobile") {{heroSchema.subHeading}}
          p.body-md.hero-banner__body-copy(v-if="heroSchema.copy", :class="heroSchema.copyColorMobile") {{heroSchema.copy}}
          OptionSelectDropdown(:product="heroSchema.aProduct" @input="selectOptionChange($event)")
          template(v-for="(variant, optIndex) of heroSchema.aProduct")
            .hero-banner__input-container
            

              input.hero-banner__input(
                type="hidden"
                :name="heroSchema.serviceProductHandle"
                :id="variant.id"
                @change="variantChange(optIndex, variant)"
              )
              label(
                :for="variant.id"
              )   
          form(
            method="post"
            id="cartform"
            action="/cart/add"
          )
            input.hero-banner__input(
              type="hidden"
              name="id"
              :data-productid="heroSchema.serviceProductID"
              :value="selectedVariantId"
            )
            .sesami__additionalButtonWrapper(
              :class="[productIdAsClassName]"
              :data-sesami-product-id="heroSchema.serviceProductID"
              :data-sesami-variant-id="selectedVariantId"
            )


</template>

<script>
  import { flexSwitch } from 'scripts/helpers/flex.js';
  import { textAlignSwitch } from 'scripts/helpers/textAlign.js';
  import Icon from 'scripts/components/basic/Icon.vue';
  import VButton from 'scripts/components/buttons/VButton.vue';
  import VLink from 'scripts/components/buttons/VLink.vue';
  import { px } from 'scripts/filters/string.js';
  import { mapState } from 'vuex';
  import OptionSelectDropdown from 'scripts/components/forms/OptionSelectDropdown.vue'

  export default {
    name: 'HeroBanner',
    components: {
    Icon,
    VButton,
    VLink,
    OptionSelectDropdown
    },
    props: {
      heroSchema: Object
    },
    data() {
    return {
      dateChosen: false,
      selectedVariantId: this.heroSchema.serviceProductAllVariantIDs[0].id,
      showOverlay: false,
      backgroundStyles: {
        backgroundImage: `url('${this.heroSchema.image}')`
      },
      overlayStyles: {
        opacity: `${this.heroSchema.overlayOpacity / 100}`
      },
      contentBackgroundStyles: {
        backgroundColor: this.heroSchema.contentBackgroundColor,
        opacity: `${this.heroSchema.overlayOpacity / 100}`,
      }
    };
    },
    computed: {
    ...mapState({
      itemsInCart: state => state.cart.checkout.items
    }),
    layoutHorizontal() {
      return flexSwitch('justify', this.heroSchema.layoutHorizontal);
    },
    productIdAsClassName(){
      const variantIdClass = "product-with-id-" + this.heroSchema.serviceProductID.toString();
      return variantIdClass;
    },
    textAlign() {
      return textAlignSwitch(this.heroSchema.layoutHorizontal);
    },
    textAlignMobile() {
      return [textAlignSwitch(this.heroSchema.mobileTextAlignment), this.heroSchema.mobileTextAlignment === 'center' && this.heroSchema.mobileLayout === 'overlay' ? 'flex-align-center' : ''];
    },
    backgroundStylesMobile() {
      if (this.heroSchema.imageMobileEnable) {
        return {
          backgroundImage: `url('${this.heroSchema.imageMobile}')`
        };
      } else {
        return {
          backgroundImage: `url('${this.heroSchema.image}')`
        };
      }
    },
    contentProperties() {
      return {
        classes: this.heroSchema.enableTextBox
          ? [
              {
                'hero-banner__content--text-box': true,
                'hero-banner__content--text-box-img': this.heroSchema
                  .textBoxBgImage
              },
              this.heroSchema.textBoxBgColor
            ]
          : undefined,
        style:
          this.heroSchema.enableTextBox && this.heroSchema.textBoxBgImage
            ? { backgroundImage: `url(${this.heroSchema.textBoxBgImage})`}
            : undefined
      };
    },
    containerStyle() {
      const {
        heroSchema: { bottomMargin, topMargin, maxWidth }
      } = this;
      if (this.$mq === 'mobile') {
        return {
          marginTop: px(topMargin / 2),
          marginBottom: px(bottomMargin / 2),
          maxWidth,
        };
      }
      return {
        marginTop: px(topMargin),
        marginBottom: px(bottomMargin),
        maxWidth,
      };
    },
    layoutStyle() {
      return {
        minHeight: this.heroSchema.layout === 'short' ? '540px' : '720px'
      };
    },
    isOverlayMobile() {
      const { heroSchema } = this;
      return !!(
        heroSchema.overlayEnable &&
        heroSchema.mobileLayout === 'overlay'
      );
    },
    minHeightStyleMobile() {
      const { heroSchema } = this;
      const {
        bvaccel: { header }
      } = window;

      if (
        heroSchema.mobileLayout === 'below' &&
        header &&
        header.topOffsetMobile
      ) {
        // set too 100vh accounting for fixed header.
        return { minHeight: `calc(100vh - ${header.topOffsetMobile}px)` };
      }
    }
    },
    methods: {
    selectOptionChange( optionValue) {
      let variant = this.heroSchema.aProduct.variants.find(item => item.title === optionValue);
      this.variantChange(0,variant);
    },
    variantChange(n, variant) {
      this.selectedVariantId = variant.id;
    },
    addToCart(element) {
      const buttonClass = ".product-with-id-" + this.heroSchema.serviceProductID;

      const sesamiDateInput = element.querySelector("[name='properties[Date]']").value
      const sesamiTimeInput = element.querySelector("[name='properties[Time]']").value
      const sesamiTimezoneInput = element.querySelector("[name='properties[Timezone]']").value
      const sesamiTeamMemberInput = element.querySelector("[name='properties[Team Member]']").value

      let addService = {
        id: this.selectedVariantId,
        quantity: 1,
        properties: {
          Date: sesamiDateInput,
          Time: sesamiTimeInput,
          Timezone: sesamiTimezoneInput,
          'Team Member': sesamiTeamMemberInput
        }
      };
      this.$store
        .dispatch("cart/addItems", addService)
        .then(() => this.$store.dispatch("cart/afterAddToCart"))
        .then(() => (this.adding = false)
      );
    },
    layoutVertical($breakpoint) {
      const isMobile = $breakpoint === 'mobile';
      const direction = isMobile ? 'justify' : 'align';
      if (this.heroSchema.enableTextBox) {
        // content in text box is always vertically centered
        return `flex-${direction}-center`;
      }
      return flexSwitch(direction, this.heroSchema.layoutVertical);
    }
    },
    mounted() {
      const schemaServiceProductID = this.heroSchema.serviceProductID;
      const that = this;

      window.addEventListener('sesami:loaded', function(){
        const buttonClass = ".product-with-id-" + schemaServiceProductID;
        const formElements = document.querySelectorAll(buttonClass);
        formElements.forEach((element) =>  {
          const sesamiDateInput = element.querySelector("[name='properties[Date]']")
          sesamiDateInput.addEventListener('change', function(){
            that.addToCart(element);
          });
        });
      });
    }
  };
</script>

<style scoped lang="scss">

.hero-banner {
  position: relative;
  display: flex;
  width: 100%;
  padding: 64px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &__input-container {
    @include mobile-only {
      max-width: 375px;
      margin: 0 auto;
    }
  }

  &__input {
    margin-bottom: 8px;

    @include mobile-only {
      align-content: left;
      text-align: left;
    }
  }

  &__preheading,
  &__heading,
  &__subheading {
    margin-bottom: 4px;
  }

  @include desktop-up {
    &__preheading,
    &__heading,
    &__subheading {
      margin-bottom: 8px;
    }
  }

  &.overlay {
    min-height: 240px;
  }

  &.below {
    justify-content: flex-start;
    .hero-banner__content--text-box {
      position: relative;
      top: -30px;
    }

    .hero-banner__content {
      margin: 0;
      max-width: none;
    }
  }

  &.text-right {
    text-align: left;
  }
  @include mobile-only {
    position: auto;
    height: auto;
    flex-direction: column;
    padding: 0;
  }
  @include tablet-only {
    background-position: initial;
  }

  &__container {
    position: relative;
    margin: 0 auto;
  }

  &__background-video {
    display: block;
    max-width: 100vw;
    @include desktop-up {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      z-index: 20;
    }
  }

  &__content-container {
    position: relative;
    z-index: 21;
    padding: 40px 24px 40px 36px;
    @include desktop-up {
      max-width: 417px;
      width: 100%;
      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        max-width: none;
        width: auto;
      }
    }
  }

  &__content-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
  }

  &__content {
    display: inline-flex;
    flex-direction: column;
    // max-width: 250px;
    width: 100%;
    z-index: 21;
    &--text-box {
      margin: 0 18px;
      padding: 24px 8px;
      border-radius: $hero-content-border-radius;
      background-size: cover;
    }
    @include tablet-up {
      max-width: none;

      &--text-box {
        margin: 0;
        padding: 40px;
        border-radius: $hero-content-border-radius;
        background-size: cover;
        &.short {
          padding: 24px;
        }
      }
    }
    @include mobile-only {
      padding: 16px 32px;
    }
  }

  &__body-copy {
    margin-top: 0;
    word-break: break-word;
    margin-bottom: 24px;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &__image-mobile {
    position: relative;
    height: 240px;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
