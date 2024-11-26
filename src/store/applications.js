import axios from "@/plugins/axios";

const state = {
  applications: [],
	loading: false,
	params: {
		page_size: 10, 
		page: 1,
		search: null,
		premise_id: undefined,
	},
	total: 0,
};

const getters = {
	applications: (state) => state.applications,
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
	fetchApplications({ commit, state }, payload) {
		commit("setState", { key: 'loading', value: true })
    return new Promise(async (resolve, reject) => {
      try {
				payload && payload.params && commit("setState", { key: 'params', value: { ...state.params,...payload.params} })
        const res = await axios.get(
					`/api/appeals/v1.0/appeals/`, 
					{ params: state.params }
				)
        const { status, message, data } = res
        if (status) {
          commit("setState", { key: 'applications', value: data && data.results || [] })
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
	createApplication(_, {form}) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(
					`/api/appeals/v1.0/appeals/`, 
					{...form}
				)
        const { status, message, data } = res
        if (status) {
          resolve(data)
        } else {
          reject((message && message[ i18n ]) || message)
          return
        }
      } catch (e) {
        reject(e && e.response && e.response.data && e.response.data.error)
      } 
    })
  },
	updateApplication(_,{id, form}) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.patch(
					`/api/appeals/v1.0/appeals/${id}/`, 
					{ data: form }
				)
        const { status, message, data } = res
        if (status) {
          resolve(data)
        } else {
          reject((message && message[ i18n ]) || message)
          return
        }
      } catch (e) {
        reject(e && e.response && e.response.data && e.response.data.error)
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