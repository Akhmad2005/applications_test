import Vue from 'vue'

import App from './App.vue'
import Antd from 'ant-design-vue';
import router from './router'
import store from './store';


import 'ant-design-vue/dist/antd.css';
import './assets/styles/main.scss'

// @ts-ignore
import GIcon from './components/g/icon.vue'
// @ts-ignore
import GTablePagination from './components/g/table-pagination.vue'

Vue.use(Antd);

Vue.component('g-icon', GIcon)
Vue.component('g-table-pagination', GTablePagination)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
