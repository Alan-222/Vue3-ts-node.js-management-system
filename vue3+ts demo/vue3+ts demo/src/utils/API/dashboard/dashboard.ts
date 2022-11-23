import $http from '../../http';
// 获取各模型数量
export const getAllModelCount = () => {
  return $http({
    url: '/dashboard/allModelCount',
    method: 'get'
  });
};
// 获取登录日志
export const getLogList = () => {
  return $http({
    url: '/dashboard/logList',
    method: 'get'
  });
};
// 获取最新文章
export const getEssayList = () => {
  return $http({
    url: '/dashboard/essayList',
    method: 'get'
  });
};
// 获取审核与未审核文章数量
export const getEssayNum = () => {
  return $http({
    url: '/dashboard/essayNum',
    method: 'get'
  });
};
