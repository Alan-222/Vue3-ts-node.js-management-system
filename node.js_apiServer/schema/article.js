// 导入定义验证规则的模块
const joi = require('joi');

// 定义标题、分类ID、内容、发布状态的验证规则
const id = joi.number().integer().min(1).required();
const title = joi.string().required();
const artcate_ids = joi.array().required();
const cover_img = joi.string().required();
const content = joi.string().required().allow('');
const state = joi.number().valid(0, 1, 2, 3);
const checkState = joi.number().valid(0, 1, 2).required();
const checkReason = joi.string();
const uploadSchema = joi.object({
  id: id
});
// 验证规则 - 发布文章
exports.publish_article_schema = {
  body: {
    title: title,
    cover_img: cover_img,
    content: content,
    state: state,
    artcate_ids: artcate_ids
  }
};
// 验证规则对象 - 编辑文章
exports.editSchema = {
  query: {
    id
  },
  body: {
    title: title,
    cover_img: cover_img,
    content: content,
    artcate_ids: artcate_ids
  }
};
// 验证规则兑现 - 更新封面
exports.uploadSchema = uploadSchema;
exports.get_article_schema = {
  params: {
    id
  }
};
exports.delete_article_schema = {
  params: {
    id
  }
};
exports.check_article_schema = {
  body: {
    id: id,
    check_state: checkState,
    check_reason: checkReason
  }
};
