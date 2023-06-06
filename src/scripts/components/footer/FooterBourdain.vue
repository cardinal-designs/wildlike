
<template lang="pug">
  .footer-content(:class="footerClass")
    footer-email-collection(v-if="!schemaEmail.settings.hideEmail" :schema="schemaEmail")
      slot
    footer-main(:schema="schemaMain" :schemaContact="schemaContact")
    footer-sub-footer(:schema="schemaSubfooter")
    //footer-to-top(text="Top" :dynamicallyHide="true")
</template>

<script>
  import FooterEmailCollection from 'scripts/components/footer/FooterEmailCollection.vue';
  import FooterMain from 'scripts/components/footer/FooterMain.vue';
  import FooterSubFooter from 'scripts/components/footer/FooterSubFooter.vue';
  //import FooterToTop from 'scripts/components/navigation/FooterToTop.vue';

  export default {
    name: 'FooterBourdain',
    components: {
      FooterEmailCollection,
      FooterMain,
      FooterSubFooter,
      //FooterToTop,
    },
    props: {
      schemaEmail: Object,
      schemaMain: Object,
      schemaContact: Object,
      schemaSubfooter: Object,
      footerAlign: {
        type: String,
        default: "left"
      },
    },
    methods: {
    },
    data() {
      return {}
    },
    computed: {
      footerClass() {
        return `footer-content--${this.footerAlign}`;
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss"></style>