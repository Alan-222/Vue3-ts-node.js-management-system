const express = require('express');
// 创建路由对象
const router = express.Router();
const handler = require('../router_handler/role');
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const { add_role_schema, edit_role_schema, delete_role_schema, get_role_schema } = require('../schema/role');
// 分页获取角色列表
router.get('/listRole', handler.getList);
// 获取所有角色
router.get('/allRole', handler.getAllRole);
// 添加角色
router.post('/addRole', expressJoi(add_role_schema), handler.addRole);
// 获取角色资源
router.get('/roleResource', handler.getRoleResource);
// 更新角色资源
router.post('/updateRoleResource', handler.updateRoleResource);
// 修改角色
router.post('/editRole', expressJoi(edit_role_schema), handler.editRole);
// 删除角色
router.post('/delRole', handler.deleteRole);
// 根据id获取用户信息接口
router.get('/getRole', expressJoi(get_role_schema), handler.getOneRole);

module.exports = router;
