import $http from '../../http';

export const getUserInfo = () => {
  return $http({
    url: '/my/userinfo',
    method: 'get'
  });
};
export const updateUserInfo = (userinfo: userinfoForm) => {
  return $http({
    url: '/my/userinfo',
    method: 'post',
    data: userinfo
  });
};
