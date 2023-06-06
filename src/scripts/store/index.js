import Vue from 'vue';
import Vuex from 'vuex';

// modules
import products from './modules/products';
import collections from './modules/collections';
import cart from './modules/cart';
import toast from './modules/toast';
import scroll from './modules/scroll';
import video from './modules/video';
import kitBuilder from './modules/kitBuilder';
import header from './modules/header';
import offers from './modules/offers';
import fullOverlay from './modules/fullOverlay';

Vue.use(Vuex);

// map metafield values to class names
const metafieldColorMap = {
  Primary: 'brand-primary',
  Secondary: 'brand-secondary',
  Primary: 'brand-primary',
  'Accent 1': 'accent-1',
  'Accent 2': 'accent-2',
  'Accent 3': 'accent-3',
  'Accent 4': 'accent-4',
  'Accent 5': 'accent-5',
  White: 'white',
  white: 'white',
  'Light Grey': 'light-grey',
  Grey: 'grey',
  'Off-Black': 'off-black',
  Black: 'black',
};

const state = {
  badgeColorMap: {
    sale: ['badge-bg-sale'],
    new: ['badge-bg-new'],
    wildiespick: ['badge-bg-wildiespick'],
    preorder: ['badge-bg-preorder'],
    goingfast: ['badge-bg-goingfast']
  },
  comparePriceColor: window.bvaccel.comparePriceColor,
  config: {
    IS_RAMSEY: IS_RAMSEY,
    IS_BOURDAIN: IS_BOURDAIN,
  },
  metafieldColorMap,
};

export default new Vuex.Store({
  state,
  modules: {
    products,
    collections,
    cart,
    toast,
    scroll,
    video,
    kitBuilder,
    header,
    offers,
    fullOverlay,
  },
});
