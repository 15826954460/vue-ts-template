import Vue from 'vue';
import App from './App.vue';
import router from './route';
import store from '@/store/store';
import "@/components/globalCom" /** 直接引用js */

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
