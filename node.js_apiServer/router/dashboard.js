const express = require('express');
// 创建路由对象
const router = express.Router();
const handler = require('../router_handler/dashboard');

// 2. 导入需要的验证规则对象

// 获取各模型总数
router.get('/allModelCount', handler.countAllModel);
// 获取20条登录日志
router.get('/logList', handler.getLogList);
// 获取20条最新文章
router.get('/essayList', handler.getEssayList);
// 获得已审核与未审核与未通过文章总数
router.get('/essayNum', handler.getEssayNum);
module.exports = router;
