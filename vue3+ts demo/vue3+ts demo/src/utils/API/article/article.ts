import $http from '../../http';

// 获取文章列表数据
export const getArticleList = (queryParams: articleQueryParams) => {
  return $http({
    url: '/my/article/article',
    method: 'get',
    params: queryParams
  });
};
// 获取各文章状态的数量
export const getStateCount = () => {
  return $http({
    url: '/my/article/stateCount',
    method: 'get'
  });
};
// 更新文章封面
export const uploadCover = (img: any) => {
  return $http({
    url: '/my/article/uploadCover',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: img
  });
};
// 更新文章图片
export const uploadImgs = (img: any) => {
  return $http({
    url: '/my/article/uploadImgs',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: img
  });
};
// 新增文章数据
export const addArticle = (form: articleAddForm) => {
  return $http({
    url: '/my/article/addArticle',
    method: 'post',
    data: form
  });
};
// 新增文章数据
export const saveArticle = (form: any, id: number | undefined = undefined) => {
  if (id) {
    return $http({
      url: '/my/article/saveArticle?id=' + id,
      method: 'post',
      data: form
    });
  } else {
    return $http({
      url: '/my/article/saveArticle',
      method: 'post',
      data: form
    });
  }
};
// 更新文章数据
export const updateArticle = (id: number, form: articleUpdateForm) => {
  return $http({
    url: '/my/article/updateArt?id=' + id,
    method: 'post',
    data: form
  });
};
// 根据id获取文章数据
export const getArticleById = (id: number) => {
  return $http({
    url: `/my/article/getArt/${id}`,
    method: 'get'
  });
};
// 根据id删除文章数据
export const deleteArticleById = (id: number) => {
  return $http({
    url: `/my/article/deleteArt/${id}`,
    method: 'get'
  });
};
// 审核文章
export const checkArtcile = (form: checkPostForm) => {
  return $http({
    url: '/my/article/checkArt',
    method: 'post',
    data: form
  });
};
