// 定义文章查询表单
declare interface articleQueryParams {
  currentPage: number; // 当前页
  pageSize: number; // 每页条数
  title: string | undefined;
  state: 0 | 1 | 2 | 3 | undefined;
}
// 定义文章状态表单
declare interface stateCount {
  total: string;
  release: string;
  draft: string;
  review: string;
  notPass: string;
}
// 定义文章表单
declare interface articleForm {
  id: number;
  title: string;
  content: string;
  artcate_ids: Array;
  state: 0 | 1 | 2 | 3;
  cover_img: object;
  create_time: string;
  authod_id: number;
  check_reason?: string;
}
// 定义添加文章的表单
declare interface articleAddForm {
  title: string;
  content: string;
  artcate_ids: Array;
  cover_img: string;
}
// 定义修改文章的表单
declare interface articleUpdateForm {
  title: string;
  content: string;
  artcate_ids: Array;
  cover_img: string;
}
// 定义发布文章弹出层表单
declare interface articlePostForm {
  artcate_ids: Array;
  cover_img: string;
  title: string;
  content: string;
}
// 定义浏览文章目录查询的表单
declare interface titleAnchors {
  title: string;
  lineIndex: number;
  indent: number;
}
// 定义作者信息
declare interface authorInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  user_pic: string;
}
declare interface checkArticleForm {
  title: string;
  content: string;
  cover_img: string;
}
declare interface checkPostForm {
  check_state: number;
  id: number;
  check_reason?: string;
}
