import Vue from 'vue';
import App from './App.vue';
import router from './route';
import store from '@/store/store';
import "@/components/globalCom" /** 直接引用js */
import i18n from "./i18nConfig/i18nConfig";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
