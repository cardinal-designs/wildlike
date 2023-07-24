import axios from 'axios';
import { isHiddenProduct } from 'scripts/helpers/util';
import { STATE_SESSION_STORAGE_KEY } from 'scripts/helpers/collections';
import { handleize } from '../../filters/string.js';

const state = {
  // status represents if the products are loading or not / coverAll represent if the loading states covers the entire products grid or only loads more product below
  fetchingStatus: {
    status: false,
    coverAll: false,
  },
  currentHandle: '',
  currentPage: 1,
  currentSort: '',
  currentFilters: [],
  currentProducts: [],
  currentTags: [],
  currentTotal: 0,
  paginationAmount: 0,
  currentScrollPos: -1,
};

const mutations = {
  SET_FETCHING_STATUS: (state, status) => {
    state.fetchingStatus = status;
  },
  SET_CURRENT_HANDLE: (state, handle) => {
    state.currentHandle = handle;
    cacheStateToSessionStorage(state);
  },
  SET_CURRENT_PAGE: (state, page) => {
    state.currentPage = page;
    cacheStateToSessionStorage(state);
  },
  SET_CURRENT_SORT: (state, sort) => {
    state.currentSort = sort;
    cacheStateToSessionStorage(state);
  },
  SET_CURRENT_FILTERS: (state, filters) => {
    state.currentFilters = filters;
    cacheStateToSessionStorage(state);
  },
  SET_CURRENT_PRODUCTS: (state, products) => {
    state.currentProducts = products;
    cacheStateToSessionStorage(state);
  },
  SET_CURRENT_TAGS: (state, tags) => {
    state.currentTags = tags;
    cacheStateToSessionStorage(state);
  },
  SET_CURRENT_TOTAL: (state, total) => {
    state.currentTotal = total;
    cacheStateToSessionStorage(state);
  },
  SET_PAGINATION_AMOUNT: (state, paginationAmount) => {
    state.paginationAmount = paginationAmount;
    cacheStateToSessionStorage(state);
  },
  APPEND_PRODUCTS: (state, products) => {
    state.currentProducts = state.currentProducts.concat(products);
  },
  SET_STATE_FROM_CACHE: (state, cacheState) => {
    state.currentHandle = cacheState.currentHandle;
    state.currentPage = cacheState.currentPage;
    state.currentSort = cacheState.currentSort;
    state.currentFilters = cacheState.currentFilters;
    state.currentTotal = cacheState.currentTotal;
    state.paginationAmount = cacheState.paginationAmount;
    state.currentScrollPos = cacheState.currentScrollPos;
  },
  SET_CURRENT_SCROLL_POS: (state, pos) => {
    state.currentScrollPos = pos;
    cacheStateToSessionStorage(state);
  }
};

const actions = {
  updateHandle({ commit, dispatch }, handle) {
    commit('SET_CURRENT_HANDLE', handle);
    dispatch('fetchProducts');
  },
  updatePage({ commit, dispatch }, page) {
    commit('SET_CURRENT_PAGE', page);
    dispatch('fetchProducts');
  },
  loadMoreProducts({ commit, dispatch }, page) {
    commit('SET_CURRENT_PAGE', page);
    dispatch('fetchProducts', true);
  },
  loadAllProducts({ dispatch }) {
    dispatch('fetchAllProducts');
  },
  loadProductsByCurrentPage( { dispatch }, page) {
    dispatch('fetchProductsByCurrentPage');
  },
  updateSort({ commit, dispatch }, sort) {
    commit('SET_CURRENT_SORT', sort);
    commit('SET_CURRENT_PAGE', 1);
    dispatch('fetchProducts');
  },
  updateFilters({ commit, dispatch }, filters) {
    commit('SET_CURRENT_FILTERS', filters);
    commit('SET_CURRENT_SORT', state.currentSort);
    commit('SET_CURRENT_PAGE', 1);
    dispatch('fetchProducts');
  },
  setCollectionStateFromCache({ commit }, cache) {
    commit('SET_STATE_FROM_CACHE', cache);
  },
  setInitialCollectionState({ commit }, init) {
    commit('SET_CURRENT_HANDLE', init.handle);
    commit(
      'SET_CURRENT_PRODUCTS',
      init.products.filter((prod) => !isHiddenProduct(prod)),
    );
    commit('SET_CURRENT_TAGS', init.tags);
    commit('SET_CURRENT_TOTAL', init.total);
    commit('SET_PAGINATION_AMOUNT', init.paginationAmount);
    commit('SET_CURRENT_SORT', init.sort);
    commit('SET_CURRENT_PAGE', init.page);
    commit('SET_CURRENT_FILTERS', init.currentFilters);
  },
  setCollectionScrollPos({ commit }, pos) {
    commit('SET_CURRENT_SCROLL_POS', pos);
  },
  fetchProducts({ commit }, append = false) {
    commit('SET_FETCHING_STATUS', { status: true, coverAll: !append });
    const mutation = append ? 'APPEND_PRODUCTS' : 'SET_CURRENT_PRODUCTS';
    let url = filterSortUrlBuilder();
    return axios
      .get(url)
      .then((response) => {
        commit(
          mutation,
          response.data.products.filter((prod) => !isHiddenProduct(prod)),
        );
        commit('SET_CURRENT_TAGS', response.data.tags);
        commit('SET_CURRENT_TOTAL', response.data.productCount);
      })
      .then(() => {
        commit('SET_FETCHING_STATUS', { status: false, coverAll: false });
      });
  },
  fetchProductsByCurrentPage({ commit }) {
    commit('SET_FETCHING_STATUS', { status: true, coverAll: false });
    const promises = [];
    const responses = {};
    for (let i = 1; i <= state.currentPage; i++) {
      const url = filterSortUrlBuilder(true, i);
      // Collecting all the API responses into the responses object with the page as key and the response as a value in order to sort them
      promises.push(
        axios.get(url).then((response) => {
          const displayedProducts = response.data.products.filter((prod) => !isHiddenProduct(prod));
          responses[i] = displayedProducts;
        }),
      );
    }
    Promise.all(promises).then(() => {
      let orderedProducts = [];
      //- Iterating and sorting the responses object and concat those responses into an orderedProducts array
      Object.keys(responses)
        .sort((a, b) => a - b)
        .forEach((key) => {
          orderedProducts = orderedProducts.concat(responses[key]);
        });
      commit('SET_CURRENT_PRODUCTS', orderedProducts);
      commit('SET_FETCHING_STATUS', { status: false, coverAll: false });
    });
  },
  fetchAllProducts({ commit }) {
    commit('SET_FETCHING_STATUS', { status: true, coverAll: false });
    const totalPages = Math.ceil(state.currentTotal / state.paginationAmount);
    const promises = [];
    const responses = {};
    for (let i = state.currentPage + 1; i <= totalPages; i++) {
      const url = filterSortUrlBuilder(true, i);
      // Collecting all the API responses into the responses object with the page as key and the response as a value in order to sort them
      promises.push(
        axios.get(url).then((response) => {
          const displayedProducts = response.data.products.filter((prod) => !isHiddenProduct(prod));
          responses[i] = displayedProducts;
        }),
      );
    }
    Promise.all(promises).then(() => {
      let orderedProducts = [];
      //- Iterating and sorting the responses object and concat those responses into an orderedProducts array
      Object.keys(responses)
        .sort((a, b) => a - b)
        .forEach((key) => {
          orderedProducts = orderedProducts.concat(responses[key]);
        });
        state.currentPage = totalPages;
      commit('APPEND_PRODUCTS', orderedProducts);
      commit('SET_FETCHING_STATUS', { status: false, coverAll: false });
    });
  },
};

const cacheStateToSessionStorage = state =>   sessionStorage.setItem(
  STATE_SESSION_STORAGE_KEY,
  JSON.stringify({ [state.currentHandle]: {
    currentHandle : state.currentHandle,
    currentPage : state.currentPage,
    currentSort : state.currentSort,
    currentFilters : state.currentFilters,
    currentTotal : state.currentTotal,
    paginationAmount : state.paginationAmount,
    currentScrollPos : state.currentScrollPos,
  }})
);

const filterSortUrlBuilder = (isJSON = true, page) => {
  const pageToRequest = page || state.currentPage;
  let url = '';
  let baseUrl = `/collections/${state.currentHandle}/`;
  if (state.currentFilters.length) {
    let handleizedArray = state.currentFilters;
    let concatenatedTags = handleizedArray.join('&');
    url = `${baseUrl}?${isJSON ? 'view=json&' : ''}page=${pageToRequest}&sort_by=${state.currentSort}&${concatenatedTags}`;
  }
  if (!state.currentFilters.length && state.currentSort.length) {
    url = `${baseUrl}?${isJSON ? 'view=json&' : ''}page=${pageToRequest}&sort_by=${state.currentSort}`;
  }
  return url;
};

export default { namespaced: true, state, mutations, actions };
