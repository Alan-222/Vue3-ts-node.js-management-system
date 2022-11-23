import { createStore } from 'vuex';
import { errorRoutes, constantRoutes } from '@/router';
import { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

const modules = import.meta.glob('../../views/**/**.vue');

export function filterAsyncRoutes(routes: any) {
  const res: RouteRecordRaw[] = [];
  // console.log(routes);

  routes.forEach((route: any) => {
    const component = route.component;
    const tmp = {
      path: route.path,
      component: route.component === 'Layout' ? Layout : modules[/* @vite-ignore */ `../../views${component}.vue`],
      redirect: route.redirect || undefined,
      name: route.name,
      meta: {},
      children: route.children || undefined
    };
    tmp.meta.title = route.title;
    tmp.meta.hidden = !!route.hidden;
    if (route.icon) {
      tmp.meta.icon = route.icon;
    }
    if (tmp.name === 'EditArticle') {
      tmp.meta.target = true;
    }
    if (tmp.children && tmp.children.length) {
      // if (tmp.children.length) {
      //   tmp.alwaysShow = true;
      // }
      tmp.children = filterAsyncRoutes(tmp.children);
    }
    res.push(tmp);
  });
  return res;
}
const permission = createStore({
  state: {
    routes: [],
    addRoutes: []
  },

  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    }
  },

  actions: {
    generateRoutes({ commit }, menus) {
      return new Promise((resolve) => {
        const accessedRoutes = filterAsyncRoutes(menus);
        //  const accessedRoutes = filterAsyncRoutes(menus);.concat(errorRoutes)
        // console.log(accessedRoutes);

        commit('SET_ROUTES', accessedRoutes);
        resolve(accessedRoutes);
      });
    }
  }
});

export default permission;
