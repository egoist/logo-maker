import Vue from 'vue'
import App from './App.vue'
import 'typeface-press-start-2p/index.css'
import './css/nes.css'

if (process.env.NODE_ENV === 'production') {
  require('./offline')
}

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App)
})
