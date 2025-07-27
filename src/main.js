import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'
import system from './utils/system.js'

Vue.use(ElementUI)
Vue.config.productionTip = false

// 将 system 配置挂载到 Vue 原型上，使其在所有组件中可用
// Vue.prototype.$system = system
// 挂载到全局变量，使其在非组件环境中也可用
window.system = system

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
