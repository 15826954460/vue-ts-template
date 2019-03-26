const state = {
  number: 9999
};

const mutations = {
  mt_addNumber: (data: any) => {
    state.number += 100;
  }
};

const actions = {
  ac_addNumber: ({ commit }: any, data: any) => {
    commit("mt_addNumber", data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
