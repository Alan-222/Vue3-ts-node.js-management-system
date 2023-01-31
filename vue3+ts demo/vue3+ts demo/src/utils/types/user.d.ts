/**
 * 用户查询表单类型
 */
declare interface userQueryParams {
  currentPage: number; // 当前页
  pageSize: number; // 每页条数
  username: string | undefined;
  status: number | undefined;
}
/**
 * 用户编辑表单类型
 */
declare interface userEditForm {
  id: number;
  action: string;
  username: string;
  old_password: string;
  password: string;
  repassword: string;
  status: number;
  role_ids: any[];
}
/**
 * 用户对象行属性
 */
declare interface userRow {
  updateTime: string;
  createTime: string;
  id: number;
  username: string;
  nickname: string;
  email: string;
  userPic: string;
  status: number;
  roles: Roles[];
}

declare interface Buttons {
  menuId: number;
  btns: string[];
}

declare interface UsersRoles {
  createTime: string;
  userRoleId: number;
  roleId: number;
  userId: number;
}

declare interface Roles {
  menuIds: number[];
  buttons: Buttons[];
  updateTime: string;
  createTime: string;
  roleId: number;
  roleName: string;
  remark: string;
  status: number;
  usersRoles: UsersRoles;
}
