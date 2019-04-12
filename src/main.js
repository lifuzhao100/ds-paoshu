import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import routes from './routes'
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.config.productionTip = false
const router = new VueRouter({
  routes
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
