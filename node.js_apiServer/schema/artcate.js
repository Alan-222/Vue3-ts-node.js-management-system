const joi = require('joi');
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
const name = joi.string().required();
const alias = joi.string().alphanum().required();
const status = joi.valid(0, 1);
const id = joi.number().integer().min(1).required();
const ids = joi.array().required();
exports.add_article_cates_schema = {
  body: {
    name,
    alias,
    status
  }
};
exports.delete_article_cates_schema = {
  body: {
    ids
  }
};
exports.get_article_cates_schema = {
  params: {
    id
  }
};
exports.update_article_cates_schema = {
  body: {
    id,
    name,
    alias,
    status
  }
};
