const state = {
  products: {},
  steps: [],
  currentStep: 'Choose Lunchbox',
  productSelected: false,
  selectedProductImageUrls: ['', '', '', ''],
  selectedProducts: {
    lunchbox: null,
    magnet: null,
    bag: null,
    bottle: null,
  },
  selectedProductData: {
    lunchbox: {},
    magnet: {},
    bagProduct: {},
    bagVariant: {},
    bottleProduct: {},
    bottleVariant: {},
  },
  currentTotal: 0,
  currentSavings: 0,
};

const mutations = {
  SET_PRODUCTS: (state, products) => (state.products = products),
  SET_STEPS: (state, steps) => (state.steps = steps),
  SET_CURRENT_STEP: (state, step) => (state.currentStep = step),
  SET_PRODUCT_SELECTED_STATUS: (state, status) => (state.productSelected = status),
  SET_SELECTED_PRODUCT_IMAGES: (state, urls) => (state.selectedProductImageUrls = urls),
  SET_SELECTED_PRODUCTS: (state, products) => (state.selectedProducts = products),
  SET_SELECTED_PRODUCT_DATA: (state, data) => (state.selectedProductData = data),
  SET_CURRENT_TOTAL: (state, total) => (state.currentTotal = total),
  SET_CURRENT_SAVINGS: (state, savings) => (state.currentSavings = savings),
};

const actions = {
  setProducts({ commit }, products) {
    commit('SET_PRODUCTS', products);
  },
  setSteps({ commit }, steps) {
    commit('SET_STEPS', steps);
  },
  setCurrentStep({ commit }, step) {
    commit('SET_CURRENT_STEP', step);
  },
  toggleProductSelected({ commit }, status) {
    commit('SET_PRODUCT_SELECTED_STATUS', status);
  },
  setProductImageUrls({ commit }, urls) {
    commit('SET_SELECTED_PRODUCT_IMAGES', urls);
  },
  setSelectedProducts({ commit, dispatch }, products) {
    commit('SET_SELECTED_PRODUCTS', products);
    let data = updateData();
    dispatch('setSelectedProductData', data).then(() => {
      let total = calculateTotal();
      let savings = calculateSavings();
      dispatch('setCurrentTotal', total).then(() => {
        dispatch('setCurrentSavings', savings);
      });
    });
  },
  setSelectedProductData({ commit }, data) {
    commit('SET_SELECTED_PRODUCT_DATA', data);
  },
  setCurrentTotal({ commit }, total) {
    commit('SET_CURRENT_TOTAL', total);
  },
  setCurrentSavings({ commit }, savings) {
    commit('SET_CURRENT_SAVINGS', savings);
  },
};

const updateData = () => {
  let newSelectedProductData = state.selectedProductData;
  if (state.selectedProducts['lunchbox'] !== null) {
    newSelectedProductData.lunchbox = state.products.lunchboxes.find((lunchbox) => lunchbox.data.variants[0].id === state.selectedProducts['lunchbox']);
  }
  if (state.selectedProducts['magnet'] !== null) {
    newSelectedProductData.magnet = newSelectedProductData.lunchbox.magnets.variants.find((variant) => variant.id === state.selectedProducts['magnet']);
  }
  if (state.selectedProducts['bag'] !== null) {
    newSelectedProductData.bagProduct = newSelectedProductData.lunchbox.bags.find((bag) => bag.data.variants.find((variant) => variant.id === state.selectedProducts['bag']));
    newSelectedProductData.bagVariant = newSelectedProductData.bagProduct.data.variants.find((variant) => variant.id === state.selectedProducts['bag']);
  }
  if (state.selectedProducts['bottle'] !== null) {
    newSelectedProductData.bottleProduct = state.products.bottles.find((bottle) => bottle.data.variants.find((variant) => variant.id === state.selectedProducts['bottle']));
    newSelectedProductData.bottleVariant = newSelectedProductData.bottleProduct.data.variants.find((variant) => variant.id === state.selectedProducts['bottle']);
  }
  return newSelectedProductData;
};

const calculateTotal = () => {
  let lunchboxPrice = state.selectedProductData.lunchbox.data ? state.selectedProductData.lunchbox.data.variants[0].price : 0;

  let bagPrice = state.selectedProductData.bagVariant.price ? state.selectedProductData.bagVariant.price : 0;

  let bottlePrice = state.selectedProductData.bottleVariant.price ? state.selectedProductData.bottleVariant.price : 0;

  return lunchboxPrice + bagPrice + bottlePrice;
};

const calculateSavings = () => {
  let lunchboxPrice = state.selectedProductData.lunchbox.data ? state.selectedProductData.lunchbox.data.variants[0].price : 0;

  let bagComparePrice = state.selectedProductData.bagVariant.compare_at_price ? state.selectedProductData.bagVariant.compare_at_price : 0;

  let bottleComparePrice = state.selectedProductData.bottleVariant.compare_at_price ? state.selectedProductData.bottleVariant.compare_at_price : 0;

  return lunchboxPrice + bagComparePrice + bottleComparePrice - state.currentTotal;
};

export default { namespaced: true, state, mutations, actions };
