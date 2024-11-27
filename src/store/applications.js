import axios from "@/plugins/axios";
import { message } from "ant-design-vue";

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
        const { status, data } = res
        if (status) {
          resolve(data)
        }
        message.success('Заявка успешно создана');
      } catch (e) {
        console.error(e);
        reject(e && e.response && e.response.data && e.response.data.error)
        if (!Object.keys(form).some(key => e?.response?.data?.data?.[key]?.[0])) {
          message.error(e?.response?.data?.detail || 'Произошла ошибка при создании заявки');
        } else {
          Object.keys(form).forEach(k => {
            if (e?.response?.data?.data?.[k]?.[0]) {
              message.error(e?.response?.data?.data?.[k]?.[0])
            }
          })
        }
      } 
    })
  },
	updateApplication(_,{id, form}) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.patch(
					`/api/appeals/v1.0/appeals/${id}/`, 
					{...form}
				)
        const { status, data } = res
        if (status) {
          resolve(data)
        } 
        message.success('Заявка успешно измененено');
      } catch (e) {
        console.error(e);
        reject(e && e.response && e.response.data && e.response.data.error)
        if (!Object.keys(form).some(key => e?.response?.data?.data?.[key]?.[0])) {
          message.error(e?.response?.data?.detail || 'Произошла ошибка при изменение заявки');
        } else {
          Object.keys(form).forEach(k => {
            if (e?.response?.data?.data?.[k]?.[0]) {
              message.error(e?.response?.data?.data?.[k]?.[0])
            }
          })
        }
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