import $http from '../../http';

// 获取所有分类的数据
export const getAllCates = () => {
  return $http({
    url: '/my/article/allcate',
    method: 'get'
  });
};
// 获取文章分类列表数据
export const getArtcateList = (tableParams: queryParams) => {
  return $http({
    url: '/my/article/Cates',
    method: 'get',
    params: tableParams
  });
};
// 新增文章分类数据
export const addArtcate = (form: artcateAddForm) => {
  return $http({
    url: '/my/article/addCates',
    method: 'post',
    data: form
  });
};
// 更新文章分类数据
export const updateArtcate = (form: artcateUpdateForm) => {
  return $http({
    url: '/my/article/updateCates',
    method: 'post',
    data: form
  });
};
// 根据id获取文章分类数据
export const getCatesById = (id: number) => {
  return $http({
    url: `/my/article/getCates/${id}`,
    method: 'get'
  });
};
// 根据id删除文章分类数据
export const deleteCatesById = (ids: object) => {
  return $http({
    url: `/my/article/deleteCates`,
    method: 'post',
    data: ids
  });
};
