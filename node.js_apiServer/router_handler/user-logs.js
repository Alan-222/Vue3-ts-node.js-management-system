const UserLogsModel = require('../model/user-logs');
const UsersModel = require('../model/users');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

UserLogsModel.hasOne(UsersModel, { foreignKey: 'id', sourceKey: 'user_id' });

exports.getLogList = (req, res) => {
  if (req.query.currentPage <= 0) {
    req.query.currentPage = 1;
  }
  if (req.query.pageSize > 50) {
    req.query.pageSize = 50;
  }
  let where = {};
  if (req.query.date && req.query.date.length === 2) {
    where = {
      create_time: {
        [Op.between]: req.query.date
      }
    };
  }
  const offset = (req.query.currentPage - 1) * req.query.currentPage;
  UserLogsModel.findAndCountAll({
    offset,
    limit: parseInt(req.query.pageSize) || 20,
    include: [
      {
        model: UsersModel,
        attributes: ['username']
      }
    ],
    where: where,
    order: [['create_time', 'DESC']]
  }).then(function (logs) {
    return res.send({
      code: 0,
      message: '获取成功',
      data: {
        logs: logs.rows,
        total: logs.count
      }
    });
  });
};

exports.deleteLog = (req, res) => {
  const log_ids = req.body;
  UserLogsModel.destroy({ where: { user_log_id: log_ids } }).then(function (role) {
    if (!role) {
      return res.send({
        code: 1,
        message: '删除失败',
        data: null
      });
    }
    return res.json({
      code: 0,
      message: '删除成功',
      data: role
    });
  });
};
