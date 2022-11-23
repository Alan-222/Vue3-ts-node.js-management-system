import $http from '../../http';

export const getLogList = (params: logQueryForm) => {
  return $http({
    url: '/user/log/listLog',
    method: 'get',
    params: params
  });
};
export const deleteLog = (form: Array<number>) => {
  return $http({
    url: '/user/log/delLog',
    method: 'post',
    data: form
  });
};
