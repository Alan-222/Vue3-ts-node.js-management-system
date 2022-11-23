const express = require('express');
// 创建路由对象
const router = express.Router();
const expressJoi = require('@escook/express-joi');
// 导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema } = require('../schema/user');
const handler = require('../router_handler/userinfo');

// 获取登录用户的基本信息
router.get('/userinfo', handler.getUserinfo);
// 更新登录用户的基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), handler.updateUserInfo);
// 重置密码接口
router.post('/updatepwd', expressJoi(update_password_schema), handler.updatepwd);
// 更新头像接口
router.post('/update/avatar', handler.updateAvatar);

module.exports = router;
