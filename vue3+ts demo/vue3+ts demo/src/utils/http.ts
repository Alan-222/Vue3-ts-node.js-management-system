import Axios from 'axios';
import router from '../router/index.js';
import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken } from '../utils/auth';
import { refreshToken } from './API/user/user.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import store from '../store/index.js';

const BASE_URL = ''; //请求接口url 如果不配置 则默认访问链接地址
const TIME_OUT = 20000; // 接口超时时间
// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests: any[] = [];

const instance = Axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT
});
// 不需要token的接口白名单
const whiteList = ['/user/login', '/user/refreshToken', '/user/checkCode'];

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // console.log(config);
    // 可以在此处添加一些共有的请求拦截
    if (!whiteList.includes(config.url)) {
      // config.headers['Content-Type'] = 'application/form-data'
      // 权限校验
      // console.log('请求头带token');

      let Token = getToken();
      if (Token && Token.length > 0) {
        config.headers['Authorization'] = Token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // console.log(response);
    // 如果返回的类型为二进制文件类型
    if (response.config.responseType === 'blob') {
      if (response.status != 200) {
        ElMessage.error('请求失败' + response.status);
        return Promise.reject();
      } else if (!response.headers['content-disposition']) {
        ElMessage.error('暂无接口访问权限');
        return Promise.reject();
      }
      return response;
    } else {
      if (response.data.code !== 0) {
        let errMsg = response.data.message || '系统错误';
        if (response.data.code == 401) {
          const config = response.config;
          // token失效,判断请求状态
          if (!isRefreshing) {
            isRefreshing = true;
            return refreshToken()
              .then((res) => {
                // 刷新token成功，更新最新token
                const { token, refresh_token } = res.data;
                store.commit('SET_TOKEN', token);
                store.commit('SET_REFRESHTOKEN', refresh_token);
                setToken(token);
                setRefreshToken(refresh_token);
                //已经刷新了token，将所有队列中的请求进行重试
                requests.forEach((cb) => cb(token));
                // 重试完了别忘了清空这个队列
                requests = [];
                return instance(config);
              })
              .catch(() => {
                removeToken();
                removeRefreshToken();
                // 重置token失败，跳转登录页
                router.replace({
                  path: '/login',
                  query: {
                    redirect: router.currentRoute.fullPath //登录成功后跳入浏览的当前页
                  }
                });
              })
              .finally(() => {
                isRefreshing = false;
              });
          } else {
            // 返回未执行 resolve 的 Promise
            return new Promise((resolve) => {
              // 用函数形式将 resolve 存入，等待刷新后再执行
              requests.push(() => {
                resolve(instance(config));
              });
            });
          }
          // 如果不是正在刷新，并且，获取到本地存储的token,和当前请求头携带的一致，就开始刷新

          // ElMessage.error(errMsg);
          // store.dispatch('FedLogOut').then((res) => {
          //   router.replace({
          //     path: '/login',
          //     query: {
          //       redirect: router.currentRoute.fullPath //登录成功后跳入浏览的当前页
          //     }
          //   });
          // });
        } else {
          ElMessage.error(errMsg);
        }
        return Promise.reject(errMsg);
      }
      return response.data;
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.code) {
        case 401:
          ElMessage.error('登录信息已过期，请登录重试');
          store.dispatch('FedLogOut').then((res) => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath //登录成功后跳入浏览的当前页
              }
            });
          });
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
