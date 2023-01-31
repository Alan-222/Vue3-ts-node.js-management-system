// 导入数据库映射模块
const ArtcateModel = require('../model/artcate');
const { Op } = require('sequelize');

// 获取所有分类数据
exports.getAllCates = (req, res) => {
  ArtcateModel.findAll({
    where: {
      status: 1
    }
  }).then((result) => {
    if (!result)
      return res.send({
        code: 0,
        message: '暂无数据',
        data: null
      });
    else {
      return res.send({
        code: 0,
        message: '获取所有分类数据成功',
        data: result
      });
    }
  });
};
// 分页获取文章的分类列表数据
exports.getArticleCates = (req, res) => {
  // 接收前端参数
  let { pageSize, currentPage } = req.query;
  // 默认值
  limit = pageSize ? Number(pageSize) : 10;
  offset = currentPage ? currentPage : 1;
  offset = (offset - 1) * pageSize;
  let where = {};
  // 根据分类的状态，获取所有未被删除的分类列表数据
  // status 为 0 表示没有被 标记为删除 的数据
  let name = req.query.name;
  let status = req.query.status;
  if (name) {
    where.name = { [Op.like]: `%${name}%` };
  }
  if (status) {
    where.status = { [Op.equal]: status };
  }
  ArtcateModel.findAndCountAll({
    offset: offset,
    limit: limit,
    where: where
  }).then(function (artcates) {
    if (!artcates)
      return res.send({
        code: 0,
        message: '暂无数据',
        data: null
      });
    return res.send({
      code: 0,
      message: '获取成功',
      data: artcates
    });
  });
};
exports.addArticleCates = (req, res) => {
  ArtcateModel.findAll({
    where: {
      [Op.or]: [{ name: req.body.name }, { alias: req.body.name }]
    }
  }).then((result) => {
    console.log(result);
    if (result && result.length)
      return res.send({
        code: 1,
        message: '分类名称或别名被占用，请更换后重试！',
        data: null
      });
    else {
      delete req.body.id;
      ArtcateModel.create(req.body).then((ret) => {
        if (!ret)
          return res.send({
            code: 1,
            message: '新增文章分类失败',
            data: null
          });
        else
          return res.send({
            code: 0,
            message: '新增文章分类成功',
            data: ret
          });
      });
    }
  });
};
exports.deleteArticleCates = (req, res) => {
  const artcate_ids = req.body.ids;
  ArtcateModel.delArtcate(artcate_ids || []).then((result) => {
    if (!result) {
      return res.send({
        code: 1,
        message: '删除失败',
        data: null
      });
    }
    return res.send({
      code: 0,
      message: '删除成功',
      data: result
    });
  });
};
exports.getArtcateById = (req, res) => {
  const artcate_id = req.params.id;
  ArtcateModel.findOne({
    where: {
      id: artcate_id
    }
  }).then((result) => {
    if (!result)
      return res.send({
        code: 1,
        message: '获取文章分类失败',
        data: null
      });
    else
      return res.send({
        code: 0,
        message: '获取文章分类成功',
        data: result
      });
  });
};
exports.updateArtcate = (req, res) => {
  const artcate_id = req.body.id;
  ArtcateModel.findAll({
    where: {
      [Op.and]: {
        id: {
          [Op.ne]: artcate_id
        },
        [Op.or]: [{ name: req.body.name }, { alias: req.body.alias }]
      }
    }
  }).then((result) => {
    console.log(result);
    if (result && result.length)
      return res.send({
        code: 1,
        message: '分类名称或别名被占用，请更换后重试！',
        data: null
      });
    else {
      delete req.body.id;
      ArtcateModel.update(req.body, {
        where: {
          id: artcate_id
        }
      }).then((ret) => {
        if (!ret)
          return res.send({
            code: 1,
            message: '更新文章分类信息失败',
            data: null
          });
        else
          return res.send({
            code: 0,
            message: '更新文章信息成功',
            data: ret
          });
      });
    }
  });
};
