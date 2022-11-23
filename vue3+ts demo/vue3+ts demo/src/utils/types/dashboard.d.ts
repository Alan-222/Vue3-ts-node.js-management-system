declare interface logListItem {
  create_time: string;
  user_log_id: number;
  user_id: number;
  user: logListUserItem;
}

declare interface logListUserItem {
  id: number;
  username: string;
  roles: logListRolesItem[];
}

declare interface logListRolesItem {
  role_id: number;
  role_name: string;
  users_roles: object;
}

declare interface essayItem {
  create_time: string;
  id: number;
  title: string;
  authod_id: number;
  check_state: 1;
  auditor: string;
  artcates: Array<essayCatesItem>;
  user: essayUserItem;
}

declare interface essayCatesItem {
  name: string;
  articles_artcates: object;
}

declare interface essayUserItem {
  username: string;
}

declare interface essayChartArray {
  value: number;
  name: string;
}
