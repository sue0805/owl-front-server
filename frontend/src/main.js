// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'
import VueApexCharts from 'vue-apexcharts'
import elasticsearch from 'elasticsearch'

Vue.prototype.$ES = new elasticsearch.Client({
  host: 'http://13.209.160.90:9200',
  // log: 'trace'
});
Vue.prototype.$EventBus = new Vue();
Vue.prototype.$http = axios

Vue.use(VueApexCharts)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})