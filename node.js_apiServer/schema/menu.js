const joi = require('joi');
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
// 菜单的校验规则
const name = joi.string().alphanum().required();
const component = joi.string().uri({ relativeOnly: true }).required();
const path = joi.string().uri({ relativeOnly: true }).required();
const redirct = joi.string().uri({ relativeOnly: true });
const permission = joi.string().alphanum();
// 定义 id, nickname, emial 的验证规则
const menu_id = joi.number().integer().min(0).required();
const parent_id = joi.number().integer().min(0).required();
const hidden = joi.number().valid(0, 1);
const menu_ids = joi.array().required();
const buttons = joi.array().required();
const role_ids = joi.array().required();

// 菜单的验证规则对象
exports.add_menu_schema = {
  // 表示对res.body对象进行验证
  body: {
    parent_id,
    name,
    component,
    path,
    hidden
  }
};
exports.edit_menu_schema = {
  body: {
    menu_id,
    parent_id,
    name,
    component,
    path,
    hidden
  }
};
exports.delete_menu_schema = {
  body: {
    menu_id
  }
};
exports.get_menu_schema = {
  query: {
    menu_id
  }
};
