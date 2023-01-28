import router from '@/router';
import { ElMessage } from 'element-plus';
import store from '@/store';
import NProgress from 'nprogress';
import getPageTitle from '@/utils/get-title';
import 'nprogress/nprogress.css';
import permission from '@/store/module/permission';
NProgress.configure({ showSpinner: false }); // 进度环显示/隐藏

// 白名单路由
const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // 设置页面标题
  document.title = getPageTitle(to.meta?.title);
  const hasToken = store.state.token;
  if (hasToken) {
    // console.log('有token');

    // 登录成功，跳转到首页
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.state.roles.length > 0;
      if (hasGetUserInfo) {
        if (to.matched.length === 0) {
          // from.name ? next({ name: from.name as any }) : next('/404');
          next('/404');
        } else {
          next();
        }
      } else {
        try {
          await store.dispatch('GetInfo');
          const menus = store.state.menus;
          const accessRoutes: any = await permission.dispatch('generateRoutes', menus);
          accessRoutes.forEach((route: any) => {
            router.addRoute(route);
          });
          next({ ...to, replace: true });
        } catch (error) {
          console.log(error);

          // 移除 token 并跳转登录页
          await store.dispatch('resetToken');
          ElMessage.error((error as any) || '系统异常');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // 未登录可以访问白名单页面(登录页面)
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
