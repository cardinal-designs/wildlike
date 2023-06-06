__webpack_public_path__ = window.__webpack_public_path__;

import 'core-js';
// import 'swiper/dist/css/swiper.css';

import 'scripts/helpers/pages.js';

import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import VueScript2 from 'scripts/lib/script2.js';
import VueLazyLoad from 'vue-lazyload';
import VScrollLock from 'v-scroll-lock';
import VueScrollto from 'vue-scrollto';
import vuescroll from 'vue-scroll';
import VTooltip from 'v-tooltip';
import PortalVue from 'portal-vue';
import VueMq from 'vue-mq';
import browserDetect from 'vue-browser-detect-plugin';
import { mapState } from 'vuex';

import components from './components';
import store from './store';
import { ucfirst, upcase, unhandleize, px } from './filters/string.js';
import { money, moneyWithoutDecimals } from './filters/money.js';
// IMPORTANT: PLEASE SEE COMMENTS IN metafieldClassFilters.js BEFORE USING THESE FILTERS
import { overlayColorClass, textColorClass, textAlignClass, ctaClass, linkColorClass } from './filters/metafieldClassFilters.js';

import imageConfig from 'scripts/config/images.js';

import { AddressFormProvider } from './lib/addressFormProvider';
import objectFitImages from 'object-fit-images';

const cssVars = require('../styles/variables.scss');

// If app proxy or challenge page (template is null)
const appProxy = window.bvaccel && (window.bvaccel.template === null || window.bvaccel.template === 'page.gsx' || window.bvaccel.template.indexOf('page.yotpo--') !== -1);

// make window available within Vue app
Vue.prototype.$window = window;

Vue.config.productionTip = false;

Vue.use(Vue2TouchEvents);
Vue.use(VueScript2);

Vue.use(VScrollLock);
Vue.use(VueScrollto);
Vue.use(vuescroll);
Vue.use(PortalVue);
Vue.use(VTooltip);

Vue.use(VueLazyLoad, {
  preload: 1.3,
  loading: imageConfig.loading,
  attempt: 1,
});

Vue.use(VueMq, {
  breakpoints: {
    mobile: parseInt(cssVars.breakTablet, 10),
    tablet: parseInt(cssVars.breakDesktop, 10),
    desktop: parseInt(cssVars.breakHd, 10),
    hd: Infinity,
  },
});

Vue.use(browserDetect);

Vue.filter('ucfirst', ucfirst);
Vue.filter('upcase', upcase);
Vue.filter('unhandleize', unhandleize);
Vue.filter('money', money);
Vue.filter('moneyWithoutDecimals', moneyWithoutDecimals);
Vue.filter('px', px);
Vue.filter('overlayColorClass', overlayColorClass);
Vue.filter('textColorClass', textColorClass);
Vue.filter('textAlignClass', textAlignClass);
Vue.filter('ctaClass', ctaClass);
Vue.filter('linkColorClass', linkColorClass);

// enables detection of clicks outside a template element
// use: v-click-outside="methodToCall"
Vue.directive('click-outside', {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      // check that click was outside the element
      if (!(el == event.target || el.contains(event.target))) {
        // if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unbind: function(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
});

new Vue({
  store,
  components,
  comments: true,
  data() {
    return { promise: null };
  },
  methods: {
    fakeAsync() {
      this.promise = new Promise((r, j) => {
        window.setTimeout(() => {
          Math.random() > 0.5 ? r() : j();
        }, 1000);
      });
    },
  },
  computed: {
    ...mapState({
      checkout: (state) => state.cart.checkout,
    }),
    featuredProductSlidesToShow() {
      if (this.$mq === 'mobile') return 1.8;
      if (this.$mq === 'tablet') return 3;
      return 4;
    },
  },
  created() {
    // on creation, initialize app data
    this.$store.dispatch('cart/init');
    this.$store.dispatch('products/init');

    // If app proxy or challenge page, move MainContent to body so Vue doesn't parse and the move back after mounted
    if (appProxy) {
      document.body.appendChild(document.getElementById('MainContent'));
    }
  },
  mounted() {
    // on mount, start listening for load events
    // on a section load, re-mount section to reflect admin changes
    document.addEventListener('shopify:section:load', (event) => {
      const sectionContainer = document.getElementById(event.target.id);
      const NewComponent = Vue.extend({
        components,
        store,
        template: event.target.innerHTML,
      });
      const component = new NewComponent().$mount();

      sectionContainer.innerHTML = '';
      sectionContainer.appendChild(component.$el);
    });

    // If app proxy (template == null), move MainContent back to the correct place
    if (appProxy) {
      document.getElementById('MainContentWrapper').appendChild(document.getElementById('MainContent'));
    }
  },
}).$mount('#app');

document.addEventListener('DOMContentLoaded', function() {
  AddressFormProvider();
});

objectFitImages();
