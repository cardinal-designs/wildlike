import axios from 'axios';
import prop from 'lodash/property';

const CART_MODAL_CLOSE_DELAY_MS = 5000;

const state = {
  checkout: {
    items: [],
  },
  sidecartOpen: false,
  kits: [],
  cartModalEnabled: window.bvaccel.cart.modalEnabled,
  cartModalOpen: false,
  cartModalTimerId: 0,
};

const mutations = {
  SET_CHECKOUT(state, checkout) {
    state.checkout = checkout;
  },
  OPEN_SIDECART(state) {
    state.sidecartOpen = true;
  },
  OPEN_CARTMODAL(state) {
    state.cartModalOpen = true;
  },
  CLOSE_CARTMODAL(state) {
    state.cartModalOpen = false;
  },
  CLOSE_SIDECART(state) {
    state.sidecartOpen = false;
  },
  SET_KITS(state, kits) {
    state.kits = kits;
  },
  SET_CART_MODAL_TIMER_ID(state, id) {
    state.cartModalTimerId = id;
  },
};

const actions = {
  init({ commit, dispatch }) {
    // forcing clean cart request for IE11
    let timestamp = new Date().getTime();
    let kits = [];

    kits = findKits();

    axios
      .get(`/cart.js?q=${timestamp}`)
      .then((response) => commit('SET_CHECKOUT', response.data))
      .then(() => {
        let kits = findKits();
        dispatch('setKits', kits);
      });
  },
  addItems({ state, commit, dispatch }, items) {
    if (!(items instanceof Array)) items = [items];
    // separate items to update from items to add
    const currentItemIds = state.checkout.items.map(prop('id'));
    //const [ itemsToUpdate, itemsToAdd ] = partition(items, item => currentItemIds.includes(item.id) && !(item.properties && item.properties._kitId));

    // Check if items already exist in cart,
    // if so check the properties of two same variants,
    // if properties are same, update the variant qty
    // else add a new item to the cart
    const itemsToUpdate = [],
      itemsToAdd = [];
    for (const item of items) {
      if (currentItemIds.includes(item.id)) {
        if (!(item.properties && item.properties._kitId)) {
          itemsToAdd.push(item);
        } else {
          if (matchProperties(state.checkout.items[lineItemIds.indexOf(item.id)], item)) {
            itemsToUpdate.push(item);
          } else {
            itemsToAdd.push(item);
          }
        }
      } else {
        itemsToAdd.push(item);
      }
    }

    let promise;

    if (itemsToUpdate && itemsToUpdate.length > 0) {
      const lineItemIds = state.checkout.items.map(prop('id'));
      for (const item of itemsToUpdate) {
        // get the matching line item
        const lineItem = state.checkout.items[lineItemIds.indexOf(item.id)];
        // sum quantity
        item.quantity = item.quantity + lineItem.quantity;
        // add line item key
        item.key = lineItem.key;
      }
      promise = dispatch('updateItems', itemsToUpdate);
    }

    if (itemsToAdd && itemsToAdd.length > 0) {
      const data = itemsToAdd.length > 1 ? { items: itemsToAdd } : itemsToAdd[0];
      if (promise instanceof Promise) {
        promise.then(() => axios.post('/cart/add.js', data));
      } else {
        promise = axios.post('/cart/add.js', data);
      }
    }

    return promise
      .then(() => axios.get(`/cart.js?q=${new Date().getTime()}`))
      .then((response) => {
        commit('SET_CHECKOUT', response.data);
        commit('SET_KITS', findKits() || []);
        return response.data;
      })
      .catch((err) => {
        console.error(err);
        // if (Sentry) {
        //   Sentry.captureException(err);
        // }
        dispatch('toast/send', { text: err.message, type: 'error' }, { root: true });
        return err;
      });
  },
  /**
   * @desc NOTE: Only updates quantity.
   *
   * @typedef Item
   * @type {Object}
   * @prop {String} key
   * @prop {Number} quantity
   *
   * @param {Array<Item>} items
   */
  updateItems({ state, commit, dispatch }, items) {
    if (!(items instanceof Array)) items = [items];

    const updatedItemKeys = items.map(prop('key'));
    const lineItemQuantities = state.checkout.items.map((item) => items[updatedItemKeys.indexOf(item.key)] || item).map(prop('quantity'));
    const payload = {
      updates: lineItemQuantities,
    };

    return axios
      .post('/cart/update.js', payload)
      .then((response) => {
        commit('SET_CHECKOUT', response.data);
        commit('SET_KITS', findKits() || []);
        return response;
      })
      .catch((err) => {
        console.error(err);
        // if (Sentry) {
        //   Sentry.captureException(err);
        // }
        dispatch('toast/send', { text: err.message, type: 'error' }, { root: true });
        return err;
      });
  },
  removeItems({ dispatch }, items) {
    if (!(items instanceof Array)) items = [items];

    items.forEach((item) => (item.quantity = 0));

    return dispatch('updateItems', items);
  },
  openSidecart: ({ commit }) => {
    commit('CLOSE_CARTMODAL');
    commit('OPEN_SIDECART');
  },
  closeSidecart: ({ commit }) => commit('CLOSE_SIDECART'),
  openCartModal: ({ state, commit }) => {
    window.clearTimeout(state.cartModalTimerId);
    commit('OPEN_CARTMODAL');
  },
  closeCartModal: ({ commit }) => commit('CLOSE_CARTMODAL'),
  setKits: ({ commit }, kits) => commit('SET_KITS', kits),
  afterAddToCart: ({ state: { cartModalEnabled }, dispatch, commit }) => {
    const action = cartModalEnabled ? 'openCartModal' : 'openSidecart';
    dispatch(action);

    if (action === 'openCartModal') {
      const timerId = setTimeout(() => dispatch('closeCartModal'), CART_MODAL_CLOSE_DELAY_MS);
      commit('SET_CART_MODAL_TIMER_ID', timerId);
    }
  },
};

const matchProperties = (lineItem1, lineItem2) => {
  if (lineItem1.properties && lineItem2.properties) {
    let flag = true;
    if (Object.keys(lineItem1).length !== Object.keys(lineItem2).length) return false;

    for (const key in lineItem1.properties) {
      if (!(lineItem2.hasOwnProperty(key) && lineItem2[key] === lineItem1[key])) {
        flag = false;
      }
    }

    return flag;
  }
};

// Searches current cart line items for those with a _kitId property, adds unique kit ids to
// an array, then separates all kit items into objects matching their unique id and returns
// them for state
const findKits = () => {
  if (state.checkout.items && state.checkout.items.length) {
    let kitItems = state.checkout.items.filter(prop('properties')).filter(prop('properties._kitId'));
    let _kitIds = [];

    kitItems.forEach((item) => {
      if (!_kitIds.includes(item.properties._kitId)) {
        _kitIds.push(item.properties._kitId);
      }
    });

    return _kitIds.map((id) => {
      return {
        id: id,
        items: kitItems.filter((item) => item.properties._kitId === id).sort((a, b) => b.price - a.price), // sort highest to lowest so lunchbox magnet isn't first
      };
    });
  }
};

const getters = {
  cartModalOpen({ cartModalEnabled, cartModalOpen, checkout }) {
    return cartModalEnabled && cartModalOpen && checkout.items.length > 0;
  },
};

export default { namespaced: true, state, mutations, actions, getters };
