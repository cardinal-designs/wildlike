const state = {
  showOverlay: false,
  zIndex: 3,
};

const mutations = {
  SET_VISIBILITY(state, newData) {
    state.showOverlay = newData;
  },
  SET_INDEX(state, value) {
    state.zIndex = value;
  },
};

const actions = {
  setVisibility({ commit }, value) {
    commit('SET_VISIBILITY', value);
  },
  setIndex({ commit }, value) {
    commit('SET_INDEX', value);
  },
};

export default { namespaced: true, state, mutations, actions };
