/**
 * 菜单查询参数类型声明
 */
declare interface MenuQueryParam {
  title: string;
}

/**
 * 菜单分页列表项声明
 */

declare interface MenuItem {
  menu_id?: number;
  parent_id: number;
  type?: string | 'C' | 'M' | 'EXTLINK';
  createTime: string;
  updateTime: string;
  name: string;
  icon: string;
  component: string;
  sort: number;
  hidden: number;
  children: MenuItem[];
}

/**
 * 菜单表单类型声明
 */
declare interface MenuFormData {
  /**
   * 菜单ID
   */
  menu_id?: number;
  /**
   * 父菜单ID
   */
  parent_id: number;
  /**
   * 菜单标题
   */
  title: string;
  /**
   * 路由名称
   */
  name: string;
  /**
   * 菜单是否隐藏(1:是;0:否;)
   */
  hidden: number;
  icon?: string;
  /**
   * 排序
   */
  sort: number;
  /**
   * 组件路径
   */
  component?: string;
  /**
   * 路由路径
   */
  path: string;
  /**
   * 跳转路由路径
   */
  redirect?: string;

  /**
   * 菜单类型
   */
  type: string;

  /**
   * 权限标识
   */
  permission?: string;
}

/**
 * 资源(菜单+权限)类型
 */
declare interface Resource {
  /**
   * 菜单值
   */
  value: string;
  /**
   * 菜单文本
   */
  label: string;
  /**
   * 子菜单
   */
  children: Resource[];
  /**
   * 权限集合
   */
  perms: Permission[];
  /**
   * 按钮集合
   */
  buttons: string[];
}

/**
 * 权限类型
 */
declare interface Permission {
  /**
   * 权限值
   */
  value: string;
  /**
   * 权限文本
   */
  label: string;
  /**
   * 权限标识
   */
  permission: string;
}
