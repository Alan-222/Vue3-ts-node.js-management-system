const joi = require('joi');
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
// 用户名的校验规则
const username = joi.string().alphanum().min(1).max(10).required();
// 密码的验证规则
const password = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required();
const checkCode = joi.string().alphanum().min(4).max(4).required();
const uuid = joi.number().required();
const role_ids = joi.array().items(joi.number());
// 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(0).required();
const nickname = joi.string();
const email = joi.string().email();
const status = joi.valid(0, 1);
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required();
// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
  // 表示对res.body对象进行验证
  body: {
    username,
    password,
    checkCode,
    uuid
  }
};
exports.add_user_schema = {
  // 表示对res.body对象进行验证
  body: {
    username,
    password,
    role_ids
  }
};
exports.edit_user_schema = {
  params: {
    id
  },
  body: {
    username,
    status,
    role_ids,
    nickname,
    email
  }
};
exports.edit_password_schema = {
  body: {
    id,
    // 使用 password 这个规则，验证 req.body.oldPwd 的值
    old_password: password,
    // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
    // 解读：
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    password: joi.not(joi.ref('old_password')).concat(password),
    repassword: joi.ref('password')
  }
};
exports.update_userinfo_schema = {
  body: {
    nickname,
    email,
    role_ids
  }
};
exports.update_password_schema = {
  body: {
    old_password: password,
    password: joi.not(joi.ref('old_password')).concat(password),
    repassword: joi.ref('password')
  }
};
exports.update_avatar_schema = {
  body: {
    avatar
  }
};
exports.get_userInfoById_schema = {
  params: {
    id
  }
};
exports.delete_user_schema = {
  body: {
    id
  }
};
