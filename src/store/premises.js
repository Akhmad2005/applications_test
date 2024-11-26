import axios from "@/plugins/axios";

const state = {
  premises: [],
	loading: false,
	params: {
		page_size: 10, 
		page: 1,
	},
	total: 0,
};

const getters = {
	premises: (state) => state.premises,
	loading: (state) => state.loading,
	params: (state) => state.params,
	total: (state) => state.total,
};

const mutations = {
  setState(state, {key, value}) {
    state[key] = value;
  },
};

const actions = {
	fetchPremises({ commit, state }, payload) {
		commit("setState", { key: 'loading', value: true })
    return new Promise(async (resolve, reject) => {
      try {
				payload && payload.params && commit("setState", { key: 'params', value: { ...state.params,...payload.params} })
        const res = await axios.get(
					`/api/geo/v2.0/user-premises/`, 
					{ params: state.params }
				)
        const { status, message, data } = res
        if (status) {
          commit("setState", { key: 'premises', value: data && data.results || [] })
          commit("setState", { key: 'total', value: data && data.count || 0 })
          resolve(data)
        } else {
          reject((message && message[ i18n ]) || message)
          return
        }
      } catch (e) {
        reject(e && e.response && e.response.data && e.response.data.error)
      } finally {
				commit("setState", { key: 'loading', value: false })
			}
    })
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};