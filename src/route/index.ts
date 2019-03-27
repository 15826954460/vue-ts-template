import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

let routes: any[] = [];
const routerContext = require.context(".", true, /index\.ts/);
routerContext.keys().forEach(routeName => {
  if (routeName.startsWith("./index")) {
    return;
  } // 排除根index.js
  const routeModule = routerContext(routeName); // get router module object
  routes = [...routes, ...(routeModule.default || routeModule)]; // 注册路由
});

export default new Router({
  mode: "history",
  base: process.env.BASE_URL, // "/"
  routes: routes
});
