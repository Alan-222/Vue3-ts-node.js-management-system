// 导入express
const express = require('express');
// 导入路由模块
const router = express.Router();
// 导入路由处理函数
const handler = require('../router_handler/article');
// 导入处理路径的模块
const path = require('path');
// 导入解析校验规则的中间件
const expressJoi = require('@escook/express-joi');
// 导入文章的验证模块
const {
  get_article_schema,
  delete_article_schema,
  publish_article_schema,
  editSchema,
  check_article_schema
} = require('../schema/article');
const formidable = require('express-formidable');
// 添加文章封面
router.post(
  '/uploadCover',
  formidable({ encoding: 'utf-8', uploadDir: path.join(__dirname, '../public/upload'), multiples: true }),
  handler.uploadCover
);
// 添加文章图片
router.post(
  '/uploadImgs',
  formidable({ encoding: 'utf-8', uploadDir: path.join(__dirname, '../public/upload/imgs'), multiples: true }),
  handler.uploadImgs
);
// 发布文章
router.post('/addArticle', expressJoi(publish_article_schema), handler.addArticle);
// 保存文章
router.post('/saveArticle', handler.saveArticle);
// 获取文章的列表数据
router.get('/article', handler.getArticleList);
// 根据id删除文章数据
router.get('/deleteArt/:id', expressJoi(delete_article_schema), handler.deleteArticle);
// 根据id获取文章数据
router.get('/getArt/:id', expressJoi(get_article_schema), handler.getArticleById);
// 根据id更新文章数据
router.post('/updateArt', expressJoi(editSchema), handler.updateArticle);
// 计算各状态的文章数量
router.get('/stateCount', handler.getStateCount);
// 审核接口
router.post('/checkArt', expressJoi(check_article_schema), handler.checkArticle);
// 导出路由模块
module.exports = router;
