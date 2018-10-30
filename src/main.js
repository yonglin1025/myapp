import Vue from 'vue'
import App from './App'
import Store from './store'

Vue.config.productionTip = false
Vue.prototype.$store = Store
import '@/assets/font/iconfont.css';
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
