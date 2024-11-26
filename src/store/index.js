import Vue from 'vue';
import Vuex from 'vuex';
import applications from './applications';
import apartments from './apartments';
import premises from './premises';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    applications,
    apartments,
    premises,
  },
});