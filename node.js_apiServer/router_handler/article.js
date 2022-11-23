// 导入处理路径的模块
const path = require('path');
// 处理规则的对象
const { Op } = require('sequelize');
const fs = require('fs');
// 引入数据库映射模型
const ArtcateModel = require('../model/artcate');
const ArticleModel = require('../model/article');

// 判断是否是数字方法  可为123或"123"
function checkRate(input) {
  var re = /^[0-9]+.?[0-9]*/; //判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
  if (!re.test(input)) {
    return false;
  }
  return true;
}
// 文章封面图片接口
exports.uploadCover = (req, res) => {
  // const { error } = uploadSchema.validate(req.fields);
  console.log(req.fields);
  console.log(req.files);
  if (!req.files) return res.send({ code: 1, message: '文章封面是必选参数', data: null });
  // 对插入的图片进行处理
  const generateFilename = (originalFilename) => {
    let names = originalFilename.split('.');
    return `${names[0]}_${req.user.id}.${names[1]}`;
  };
  // 通过fs更改文件名
  const uploadDir = path.join(__dirname, '..', 'public/upload');
  const newFilename = generateFilename(req.files.file.name);
  fs.rename(req.files.file.path, path.join(uploadDir, newFilename), (err) => {
    if (err) {
      console.log('重命名失败');
      console.log(err);
    }
  });
  const newFilePath = '/public/upload/' + newFilename;
  res.send({
    code: 0,
    message: '更新封面成功',
    data: {
      srcUrl: newFilePath
    }
  });
};
// 文章图片接口
exports.uploadImgs = (req, res) => {
  // const { error } = uploadSchema.validate(req.fields);
  console.log(req.fields);
  console.log(req.files);
  if (!req.files) return res.send({ code: 1, message: '文章图片是必选参数', data: null });
  // 对插入的图片进行处理
  const generateFilename = (originalFilename) => {
    let names = originalFilename.split('.');
    return `${names[0]}_${req.user.id}.${names[1]}`;
  };
  // 通过fs更改文件名
  const uploadDir = path.join(__dirname, '..', 'public/upload/imgs');
  const newFilename = generateFilename(req.files.file.name);
  fs.rename(req.files.file.path, path.join(uploadDir, newFilename), (err) => {
    if (err) {
      console.log('重命名失败');
      console.log(err);
    }
  });
  const newFilePath = '/public/upload/imgs/' + newFilename;
  res.send({
    code: 0,
    message: '插入文章图片成功',
    data: {
      srcUrl: newFilePath
    }
  });
};
// 发布文章处理函数
exports.addArticle = (req, res) => {
  // 整理要插入数据库的文章信息对象
  const articleInfo = {
    ...req.body,
    // 文章作者的id
    author_id: req.user.id,
    state: 2
  };
  const result = ArticleModel.addArticle(articleInfo);
  result.then((ret) => {
    if (checkRate(ret)) {
      return res.send({
        code: 0,
        message: '创建文章成功',
        data: ret
      });
    } else {
      return res.send({
        code: 1,
        message: ret,
        data: null
      });
    }
  });
};
// 保存新文章处理函数
exports.saveArticle = (req, res) => {
  const article_id = req.query.id;
  if (article_id) {
    const updateArticleInfo = {
      ...req.body,
      state: 0
    };
    const result = ArticleModel.updateArticle(article_id, updateArticleInfo);
    result.then(function (ret) {
      if (ret === true) {
        return res.send({
          code: 0,
          message: '修改文章成功',
          data: ret
        });
      } else {
        return res.send({
          code: 1,
          message: ret,
          data: null
        });
      }
    });
  } else {
    // 整理要插入数据库的文章信息对象
    const articleInfo = {
      ...req.body,
      // 文章作者的id
      author_id: req.user.id,
      state: 0
    };
    const result = ArticleModel.addArticle(articleInfo);
    result.then((ret) => {
      if (checkRate(ret)) {
        return res.send({
          code: 0,
          message: '保存文章成功',
          data: ret
        });
      } else {
        return res.send({
          code: 1,
          message: ret,
          data: null
        });
      }
    });
  }
};
// 获取文章的列表数据
exports.getArticleList = (req, res) => {
  // 接收前端参数
  let { pageSize, currentPage } = req.query;
  // 默认值
  // 默认值
  limit = pageSize ? Number(pageSize) : 10;
  offset = currentPage ? currentPage : 1;
  offset = (offset - 1) * pageSize;
  // 根据分类的状态，获取所有未被删除的分类列表数据
  // status 为 0 表示被停用 的数据
  let where = {};
  let title = req.query.title;
  let state = req.query.state;
  if (title) {
    where.title = { [Op.like]: `%${title}%` };
  }
  if (state) {
    where.state = { [Op.eq]: state };
  }
  ArticleModel.findAndCountAll({
    distinct: true,
    order: [['create_time', 'DESC']],
    include: [{ model: ArtcateModel }],
    offset: offset,
    limit: limit,
    where: where
  }).then(function (articles) {
    if (!articles)
      return res.send({
        code: 1,
        message: '暂无数据',
        data: null
      });
    return res.send({
      code: 0,
      message: '获取成功',
      data: articles
    });
  });
};
// 根据id获取文章的数据
exports.getArticleById = (req, res) => {
  const article_id = req.params.id;
  ArticleModel.findOne({
    include: [{ model: ArtcateModel }],
    where: {
      id: article_id
    }
  }).then((article) => {
    if (!article) {
      res.send({
        code: 1,
        message: '文章不存在',
        data: null
      });
    } else {
      res.send({
        code: 0,
        message: '获取成功',
        data: article
      });
    }
  });
};
// 根据id删除文章的数据
exports.deleteArticle = (req, res) => {
  const article_id = req.params.id;
  // console.log(user_ids);
  ArticleModel.delArticle(article_id).then(function (article) {
    if (article !== true) {
      return res.send({
        code: 1,
        message: '删除失败',
        data: null
      });
    }
    return res.send({
      code: 0,
      message: '删除成功',
      data: article
    });
  });
};
// 根据id更新文章的数据
exports.updateArticle = (req, res) => {
  const article_id = req.query.id;
  const updateArticleInfo = {
    ...req.body,
    state: 2,
    check_state: 0,
    check_reason: '',
    auditor: ''
  };
  const result = ArticleModel.updateArticle(article_id, updateArticleInfo);
  result.then(function (ret) {
    if (ret === true) {
      return res.send({
        code: 0,
        message: '修改文章成功',
        data: ret
      });
    } else {
      return res.send({
        code: 1,
        message: ret,
        data: null
      });
    }
  });
};
// 根据状态获取数量
exports.getStateCount = async (req, res) => {
  const totalNum = await ArticleModel.count();
  const draftNum = await ArticleModel.count({ where: { state: 0 } });
  const releaseNum = await ArticleModel.count({ where: { state: 1 } });
  const reviewNum = await ArticleModel.count({ where: { state: 2 } });
  const notPassNum = await ArticleModel.count({ where: { state: 3 } });
  res.send({
    code: 0,
    message: '获取各状态数量成功',
    data: {
      total: totalNum,
      draft: draftNum,
      release: releaseNum,
      review: reviewNum,
      notPass: notPassNum
    }
  });
};
// 审核文章
exports.checkArticle = (req, res) => {
  const article_id = req.body.id;
  ArticleModel.findOne({
    where: {
      id: article_id
    }
  }).then((article) => {
    if (!article)
      return res.send({
        code: 1,
        message: '文章未找到',
        data: null
      });
    if (article.state === 1)
      return res.send({
        code: 1,
        message: '文章已审核',
        data: null
      });
    const checkInfo = {
      ...req.body,
      state: 0,
      auditor: req.user.username
    };
    if (req.body.check_state === 1) {
      checkInfo.state = 1;
    } else {
      checkInfo.state = 3;
    }
    ArticleModel.update(checkInfo, {
      where: {
        id: article_id
      }
    }).then((result) => {
      if (!result)
        return res.send({
          code: 1,
          message: '审核失败',
          data: null
        });
      else
        return res.send({
          code: 0,
          message: '审核成功',
          data: result
        });
    });
  });
};
