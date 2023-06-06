const state = {
  settings: null,
  blocks: [],
  defaultIcons: {},
  helpLinks: [],
  cartBubbleColors: {},
  customerName: '',
  enablePredictiveSearch: false,
};

const mutations = {
  SET_DATA(state, newData) {
    state.settings = newData.settings;
    state.blocks = newData.blocks;
    state.defaultIcons = newData.defaultIcons;
    state.helpLinks = newData.helpLinks;
    state.cartBubbleColors = newData.cartBubbleColors;
    state.customerName = newData.customerName;
    state.enablePredictiveSearch = newData.enablePredictiveSearch;
  },
};

const actions = {
  setData({ commit }, newData) {
    commit('SET_DATA', newData);
  },
};

export default { namespaced: true, state, mutations, actions };
