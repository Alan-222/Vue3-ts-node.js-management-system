const express = require('express');
// 创建路由对象
const router = express.Router();
const handler = require('../router_handler/user-logs');

// 2. 导入需要的验证规则对象

// 分页获取角色列表
router.get('/listLog', handler.getLogList);
// 删除角色
router.post('/delLog', handler.deleteLog);

module.exports = router;
