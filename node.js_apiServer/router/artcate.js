// 导入express
const express = require('express');
// 导入路由模块
const router = express.Router();
// 导入路由处理函数
const handler = require('../router_handler/artcate');
// 导入校验规则处理模块
const expressJoi = require('@escook/express-joi');
const {
  add_article_cates_schema,
  delete_article_cates_schema,
  get_article_cates_schema,
  update_article_cates_schema
} = require('../schema/artcate');
// 获取所有分类数据
router.get('/allcate', handler.getAllCates);
// 分页获取文章的分类列表数据
router.get('/Cates', handler.getArticleCates);
// 新增文章的分类列表数据
router.post('/addCates', expressJoi(add_article_cates_schema), handler.addArticleCates);
// 根据id删除文章分类数据
router.post('/deleteCates', expressJoi(delete_article_cates_schema), handler.deleteArticleCates);
// 根据id获取文章分类数据
router.get('/getCates/:id', expressJoi(get_article_cates_schema), handler.getArtcateById);
// 根据id更新文章分类数据
router.post('/updateCates', expressJoi(update_article_cates_schema), handler.updateArtcate);
module.exports = router;
