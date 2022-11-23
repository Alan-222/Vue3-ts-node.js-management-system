/**
 * 登录日志类型
 */
declare interface logItem {
  user_log_id: number;
  user_id: number;
  user: Object;
  ip: string;
  ua: string;
  create_time: string;
}
/**
 * 登录日志查询参数
 */
declare interface logQueryForm {
  page: number;
  limit: number;
  date: Array;
}
