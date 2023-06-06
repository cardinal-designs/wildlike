const state = {
  modalOpen: false,
  offerCount: 0,
  settings: null,
  blocks: [],
};

const mutations = {
  SET_MODAL_OPEN(state, value) {
    state.modalOpen = value;
  },
  SET_OFFER_COUNT(state, value) {
    state.offerCount = value;
  },
  SET_DATA(state, value) {
    state.settings = value.settings;
    state.blocks = value.blocks;
  },
};

const actions = {
  setModalOpen({ commit }, value) {
    commit('SET_MODAL_OPEN', value);
  },
  setOfferCount({ commit }, value) {
    commit('SET_OFFER_COUNT', value);
  },
  setData({ commit }, value) {
    commit('SET_DATA', value);
  },
};

export default { namespaced: true, state, mutations, actions };
