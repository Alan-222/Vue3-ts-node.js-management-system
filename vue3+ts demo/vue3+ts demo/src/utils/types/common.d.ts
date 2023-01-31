/**
 * 弹窗类型
 */
declare interface Dialog {
  title: string;
  visible: boolean;
}

/**
 * 通用组件选择项类型
 */
declare interface Option {
  value: string;
  label: string;
  checked?: boolean;
  children?: Option[];
}

/**
 * 通用表格对象属性
 */
interface tableColumn {
  /**
   * 属性值
   */
  prop: string;
  /**
   * 标签值
   */
  label: string;
  /**
   * 对齐方向
   */
  align?: string;
  /**
   * 提示信息
   */
  ellipsis?: string;
  /**
   * 插槽
   */
  slot?: boolean;
  /**
   * 格式化方法
   */
  format?: Function;
  /**
   * 字典对象
   */
  dictCode?: string;
}
