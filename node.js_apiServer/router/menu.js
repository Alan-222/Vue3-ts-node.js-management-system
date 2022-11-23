const express = require('express');
// 创建路由对象
const router = express.Router();
const handler = require('../router_handler/menu');
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const { add_menu_schema, edit_menu_schema, delete_menu_schema, get_menu_schema } = require('../schema/menu');
// 获取菜单列表
router.get('/listMenu', handler.getMenuList);
// // 获取所有角色
// router.get('/allmenu', handler.getAllmenu);
// 获取子菜单
router.get('/listMenuOptions', handler.getMenuOptions);
// 添加角色
router.post('/addMenu', handler.addMenu);
// 修改角色
router.post('/editMenu', handler.editMenu);
// 删除角色
router.post('/delMenu', handler.deleteMenu);
// 根据id获取用户信息接口
router.get('/getMenu', handler.getOneMenu);

module.exports = router;
