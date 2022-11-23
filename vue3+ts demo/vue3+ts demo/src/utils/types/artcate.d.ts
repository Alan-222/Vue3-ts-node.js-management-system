declare interface queryParams {
  currentPage: number; // 当前页
  pageSize: number; // 每页条数
  name: string | undefined;
  alias: string | undefined;
}
declare interface artcateUpdateForm {
  id: number;
  name: string;
  alias: string;
  status: number;
}
declare interface artcateAddForm {
  name: string;
  alias: string;
}
declare interface cateOptionList {
  id: number;
  name: string;
  alias: string;
  status: 0;
}
