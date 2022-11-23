import { createStore } from 'vuex';
import { userLogin } from '@/utils/API/user/user';
import { getUserInfo } from '@/utils/Api/user/personalCenter';
import router, { resetRouter } from '@/router';
import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken } from '@/utils/auth';
import permission from './module/permission';
import { ElMessage } from 'element-plus';
export default createStore({
  state: {
    token: getToken() || '',
    roles: [],
    menus: [],
    buttons: [],
    user_id: 0,
    username: '',
    nickname: '',
    email: '',
    user_pic: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons;
    },
    SET_USERID: (state, user_id) => {
      state.user_id = user_id;
    },
    updateUser(state, user) {
      state.username = user.username;
      state.nickname = user.nickname;
      state.email = user.email;
      state.user_pic = user.user_pic;
    }
  },
  actions: {
    login({ commit }, data) {
      return new Promise((resolve, reject) => {
        userLogin(data)
          .then((res) => {
            commit('SET_TOKEN', res.data.token);
            setToken(res.data.token);
            setRefreshToken(res.data.refreshToken);
            ElMessage.success('登录成功');
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 退出操作：清空jwt即可
    logout({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '');
        commit('updateUser', {
          username: '',
          nickname: '',
          email: '',
          user_pic: ''
        });
        removeToken();
        removeRefreshToken();
        resolve(null);
      });
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const { data } = res;

            if (!data || data.length <= 0) {
              reject('验证失败，请重新登录');
            }

            const { roles, user_id, name, nickname, email, avatar, menus, buttons } = data;

            // roles must be a non-empty array
            if (!roles || roles.length <= 0) {
              reject('此用户无分配角色或角色不可用，请重新登录');
            }
            commit('SET_ROLES', roles);
            commit('SET_USERID', user_id);
            commit('updateUser', {
              username: name,
              nickname: nickname,
              email: email,
              user_pic: avatar ? 'http://127.0.0.1:3007/' + avatar : '/src/assets/avatar/default_avatar.jpg'
            });
            commit('SET_MENUS', menus);
            commit('SET_BUTTONS', buttons);
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // token过期
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        commit('SET_MENUS', []);
        commit('SET_BUTTONS', []);
        commit('SET_USERID', -1);
        commit('updateUser', {
          username: '',
          nickname: '',
          email: '',
          user_pic: ''
        });
        resetRouter();
        removeToken();
        removeRefreshToken();
        resolve(null);
      });
    },
    /**
     * 清除 Token
     */
    resetToken({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '');
        removeToken();
        removeRefreshToken();
        resolve(null);
      });
    },

    // 动态修改权限
    // dynamically modify permissions
    changeRoles({ commit, dispatch }, role) {
      return new Promise(async (resolve) => {
        const token = role + '-token';

        commit('SET_TOKEN', token);
        setToken(token);

        const { roles } = await dispatch('GetInfo');

        resetRouter();

        // 根据角色权限生成可访问路由映射
        const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true });

        // dynamically add accessible routes
        accessRoutes.forEach((item: any) => {
          router.addRoute(item);
        });

        resolve(null);
      });
    }
  }
});
