import $http from '../../http';
import useStore from '@/store';
// 获取图形验证码
export const getCheckCode = (uuid: number) => {
  return $http({
    url: '/user/checkCode?uuid=' + uuid,
    method: 'get'
  });
};
// 刷新过期token
export const refreshToken = () => {
  return $http({
    url: '/user/refreshToken',
    method: 'post',
    data: { refreshToken: useStore.state.refreshToken }
  });
};
// 添加用户登录请求 data如果约定好可以添加ts 接口类型
export const userLogin = (form: loginForm) => {
  return $http({
    url: '/user/login',
    method: 'post',
    data: form
  });
};

export const listUser = (params: userQueryParams) => {
  return $http({
    url: '/user/list',
    method: 'get',
    params: params
  });
};

export const addUser = (form: userEditForm) => {
  return $http({
    url: '/user/addUser',
    method: 'post',
    data: form
  });
};

export const updateUser = (form: userEditForm) => {
  return $http({
    url: '/user/editUser/' + form.id,
    method: 'post',
    data: form
  });
};

export const delUser = (ids: object) => {
  return $http({
    url: '/user/delUser',
    method: 'post',
    data: ids
  });
};

export const updatePwd = (form: submitPass) => {
  return $http({
    url: `/user/editPwd`,
    method: 'post',
    data: form
  });
};
// 根据id获取用户数据
export const getUserInfoById = (id: number) => {
  return $http({
    url: `/user/queryUserInfo/${id}`,
    method: 'get'
  });
};
