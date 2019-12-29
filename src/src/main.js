import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import Axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'

//设置 axios baseUrl
Axios.defaults.baseURL = 'http://localhost:3000'

Vue.config.productionTip = false
Vue.prototype.axios = Axios
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
