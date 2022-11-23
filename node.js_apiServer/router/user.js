const express = require('express');
// 创建路由对象
const router = express.Router();
const handler = require('../router_handler/user');
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const {
  reg_login_schema,
  add_user_schema,
  edit_user_schema,
  edit_password_schema,
  get_userInfoById_schema,
  delete_user_schema
} = require('../schema/user');
// 获取用户列表
router.get('/list', handler.getList);
// 添加新用户
router.post('/addUser', expressJoi(add_user_schema), handler.addUser);
// 修改用户信息
router.post('/editUser/:id', expressJoi(edit_user_schema), handler.editUser);
// 删除用户
router.post('/delUser', handler.deleteUser);
// 重置密码
router.post('/editPwd', expressJoi(edit_password_schema), handler.editPassword);
// 根据id获取用户信息接口
router.get('/queryUserInfo/:id', expressJoi(get_userInfoById_schema), handler.getUserinfoById);
// 登录
router.post('/login', expressJoi(reg_login_schema), handler.login);
// 获取图形验证码
router.get('/checkCode', handler.getCheckCode);
// 刷新token
router.post('/refreshToken', handler.refreshToken);
module.exports = router;
