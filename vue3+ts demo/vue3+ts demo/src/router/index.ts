import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';
import permission from '@/store/module/permission';

const whiteList = ['/login'];
// const routes: Array<RouteRecordRaw> = [
//   {
//     path: '/backEnd',
//     name: 'BackEnd',
//     // redirect: '/helloWorld',
//     meta: {
//       title: '首页'
//     },
//     component: () => import('../views/layout/backEnd.vue'),
//     children: [
//       {
//         path: '/helloWorld',
//         name: 'HelloWorld',
//         meta: {
//           title: '你好世界'
//         },
//         component: () => import('../views/helloWorld.vue')
//       },
//       {
//         path: '/artcate',
//         name: 'Artcate',
//         meta: {
//           title: '文章分类管理'
//         },
//         component: () => import('../views/article/artcate.vue')
//       },
//       {
//         path: '/article',
//         name: 'Article',
//         meta: {
//           title: '文章管理'
//         },
//         component: () => import('../views/article/article.vue')
//       },
//       {
//         path: '/post/:id',
//         name: 'Post',
//         component: () => import('../views/article/post.vue'),
//         meta: {
//           title: ''
//         }
//       },
//       {
//         path: '/editArticle/:id',
//         name: 'EditArticle',
//         meta: {
//           title: ''
//         },
//         component: () => import('../views/article/editArticle.vue')
//       },
//       {
//         path: '/published/:id',
//         name: 'Published',
//         component: () => import('../views/article/published.vue'),
//         meta: {
//           title: '发布成功'
//         }
//       },
//       {
//         path: '/personalCenter',
//         name: 'personalCenter',
//         meta: {
//           title: '个人中心'
//         },
//         component: () => import('../views/personalCenter.vue')
//       }
//     ]
//   },
//   {
//     path: '/login',
//     name: 'Login',
//     meta: {
//       title: '登录'
//     },
//     component: () => import('../views/login.vue')
//   },
//   { path: '/', redirect: { name: 'BackEnd' } }
// ];

//静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401.vue'),
    meta: { hidden: true }
  }
];
export const errorRoutes: Array<RouteRecordRaw> = [
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: '错误页面',
      icon: '404'
    },
    children: [
      {
        path: '/401',
        component: () => import('@/views/errorPage/401.vue'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '/404',
        component: () => import('@/views/errorPage/404.vue'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '/:pathMatch(.*)', redirect: '/404', meta: { hidden: true } }
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 })
});

// router.beforeEach((to, from, next) => {
//   if (getToken()) {
//     if (to.path === '/login') {
//       next('/');
//     } else {
//       if (!store.state.username) {
//         store.dispatch('GetInfo');
//         next();
//       } else {
//         next();
//       }
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       // 在免登录白名单，直接进入
//       next();
//     } else {
//       next('/login');
//     } // 否则全部重定向到登录页
//   }
//   // 路由发生变化修改页面title
//   if (to.meta.title) {
//     document.title = to.meta.title;
//   } else {
//     document.title = '加载中...';
//   }
// });

// 重置路由
export function resetRouter() {
  permission.state.routes.forEach((route: any) => {
    const name = route.name;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export default router;
