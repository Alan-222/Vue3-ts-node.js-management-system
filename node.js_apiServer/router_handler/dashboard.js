const UserLogsModel = require('../model/user-logs');
const UsersModel = require('../model/users');
const Sequelize = require('sequelize');
const RolesModel = require('../model/roles');
const ArticleModel = require('../model/article');
const ArtcateModel = require('../model/artcate');
const { where } = require('sequelize');
const Op = Sequelize.Op;

exports.countAllModel = async (req, res) => {
  const userSum = await UsersModel.count();
  const roleSum = await RolesModel.count();
  const articleSum = await ArticleModel.count();
  const artcateSum = await ArtcateModel.count();
  res.send({
    code: 0,
    message: '获取成功',
    data: {
      userSum,
      roleSum,
      articleSum,
      artcateSum
    }
  });
};
exports.getLogList = (req, res) => {
  UserLogsModel.findAll({
    order: [['create_time', 'DESC']],
    limit: 20,
    attributes: { exclude: ['ip', 'ua'] },
    include: [
      {
        model: UsersModel,
        attributes: ['id', 'username'],
        include: [{ model: RolesModel, attributes: ['role_id', 'role_name'] }]
      }
    ]
  }).then((result) => {
    res.send({
      code: 0,
      message: '获取成功',
      data: result
    });
  });
};
exports.getEssayList = (req, res) => {
  ArticleModel.findAll({
    order: [['create_time', 'DESC']],
    limit: 20,
    attributes: { exclude: ['content', 'cover_img', 'state', 'status', 'check_reason', 'update_time'] },
    include: [
      { model: ArtcateModel, attributes: ['name'] },
      { model: UsersModel, attributes: ['username'] }
    ],
    where: {
      check_state: 1
    }
  }).then((result) => {
    res.send({
      code: 0,
      message: '获取成功',
      data: result
    });
  });
};
exports.getEssayNum = async (req, res) => {
  const checkEssaysNum = await ArticleModel.count({ where: { check_state: { [Op.ne]: 0 } } });
  const notCheckEssaysNum = await ArticleModel.count({ where: { check_state: { [Op.eq]: 0 } } });
  const notPassEssayNum = await ArticleModel.count({ where: { check_state: { [Op.eq]: 2 } } });
  const publishedEssaysNum = await ArticleModel.count({ where: { state: { [Op.eq]: 1 } } });
  const draftEssaysNum = await ArticleModel.count({ where: { state: { [Op.eq]: 0 } } });
  const totalNum = await ArticleModel.count();
  res.send({
    code: 0,
    message: '获取成功',
    data: [
      { value: checkEssaysNum, name: '已审核文章' },
      { value: notCheckEssaysNum, name: '未审核文章' },
      { value: notPassEssayNum, name: '未通过文章' },
      { value: publishedEssaysNum, name: '已发布文章' },
      { value: draftEssaysNum, name: '草稿' },
      { value: totalNum, name: '全部文章' }
    ]
  });
};
