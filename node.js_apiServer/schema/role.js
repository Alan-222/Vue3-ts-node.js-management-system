const joi = require('joi');
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
// 角色名的校验规则
const role_name = joi.string().min(1).max(10).required();
// 定义 id, nickname, emial 的验证规则
const role_id = joi.number().integer().min(0).required();
const remark = joi.string();
const status = joi.number().valid(0, 1);
const menu_ids = joi.array().required();
const buttons = joi.array().required();
const role_ids = joi.array().required();

// 添加角色的验证规则对象
exports.add_role_schema = {
  // 表示对res.body对象进行验证
  body: {
    role_name,
    remark,
    status
  }
};
// 修改角色的验证规则对象
exports.edit_role_schema = {
  query: {
    role_id
  },
  body: {
    role_name,
    remark,
    status
  }
};
// 删除角色的验证规则对象
exports.delete_role_schema = {
  body: {
    role_ids
  }
};
// 获取单角色的验证规则对象
exports.get_role_schema = {
  query: {
    role_id
  }
};
