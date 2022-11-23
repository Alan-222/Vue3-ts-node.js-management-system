const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const key = require('../config/index');
const { addToken, decodedToken, verifyToken } = require('../utils/token');
const UsersModel = require('../model/users');
const RolesModel = require('../model/roles');
const UserLogsModel = require('../model/user-logs');
const MenusModel = require('../model/menus');
const { Op } = require('sequelize');
const svgCaptcha = require('svg-captcha');
const redis = require('../config/redis');
/**
 * 获取图形验证码
 */
exports.getCheckCode = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0o1l',
    color: true,
    noise: 6,
    background: '#cc9966',
    height: 32,
    width: 100
  });
  const uuid = req.query.uuid;
  const effectTime = 10 * 60;
  redis
    .setKey(uuid, captcha.text.toLowerCase(), effectTime)
    .then((result) => {
      if (result) {
        res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8');
        res.send({
          code: 0,
          message: '获取验证码成功',
          data: captcha.data
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.send({
        code: 1,
        message: '验证码获取失败',
        data: null
      });
    });
};
/**
 * 刷新token
 */
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  // 验证 refreshToken 1:通过
  let _res = verifyToken(refreshToken);
  if (_res === 1) {
    let { id, username } = decodedToken(refreshToken);
    const token = 'Bearer ' + addToken({ id, username }, key.jwtSecretKey, key.secretKeyExpire);
    const refresh_token = addToken({ id, username }, key.jwtRefrechSecretKey, key.refreshSerectKeyExpire);
    res.send({
      code: 0,
      message: '获取成功',
      data: {
        token,
        refresh_token
      }
    });
  } else {
    res.send({
      code: 500,
      message: _res.message
    });
  }
};
/**
 * 添加新用户
 */
exports.addUser = (req, res) => {
  UsersModel.findAll({
    where: {
      username: {
        [Op.eq]: req.body.username
      }
    }
  }).then((result) => {
    if (result && result.length)
      return res.send({
        code: 1,
        message: '用户名被占用，请更换后重试！',
        data: null
      });
    else {
      const password = req.body.password;
      // 加密
      req.body.password = bcrypt.hashSync(password, 10);
      const result = UsersModel.addUser(req.body);
      result.then(function (ret) {
        if (ret === true) {
          return res.send({
            code: 0,
            message: '新增成功',
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
  });
};
/**
 * 登录
 */
exports.login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const checkCode = req.body.checkCode;
  const uuid = req.body.uuid;
  const value = await redis.getKey(uuid);
  if (!value) {
    return res.send({
      code: 1,
      message: '图形验证码已过期，请点击图片刷新'
    });
  }
  if (checkCode.toLowerCase() !== value.toLowerCase()) {
    return res.send({
      code: 1,
      message: '图形验证码不正确，请重新输入'
    });
  }
  UsersModel.findOne({
    where: {
      username: username
    }
  }).then(function (user) {
    if (!user) {
      return res.send({
        code: 1,
        message: '帐号不存在',
        data: ''
      });
    }
    if (user.status === 0) {
      return res.send({
        code: 1,
        message: '帐号已停用',
        data: ''
      });
    }
    const compareResult = bcrypt.compareSync(password, user.password);
    if (compareResult) {
      const token =
        'Bearer ' + addToken({ id: user.id, username: user.username }, key.jwtSecretKey, key.secretKeyExpire);
      // 'Bearer ' + jsonwebtoken.sign({ id: user.id, username: user.username }, key.jwtSecretKey, { expiresIn: '10h' });
      const refreshToken = addToken(
        { id: user.id, username: user.username },
        key.jwtRefrechSecretKey,
        key.refreshSerectKeyExpire
      );
      const logData = {
        user_id: user.id,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        ua: req.headers['user-agent']
      };
      UserLogsModel.create(logData);
      return res.send({
        code: 0,
        message: '登录成功',
        data: {
          token: token,
          refreshToken
        }
      });
    } else {
      return res.send({
        code: 1,
        message: '密码错误',
        data: ''
      });
    }
  });
};
/**
 * 编辑用户
 */
exports.editUser = (req, res) => {
  const user_id = req.params.id;
  console.log(req.body);
  UsersModel.findAll({
    where: {
      [Op.and]: {
        id: {
          [Op.ne]: user_id
        },
        username: {
          [Op.eq]: req.body.username
        }
      }
    }
  }).then((result) => {
    if (result && result.length)
      return res.send({
        code: 1,
        message: '用户名被占用，请更换后重试！',
        data: null
      });
    else {
      const result = UsersModel.updateUser(user_id, req.body);
      result.then(function (ret) {
        if (ret === true) {
          return res.send({
            code: 0,
            message: '修改成功',
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
  });
};
/**
 * 获得用户列表
 */
exports.getList = (req, res) => {
  // 接收前端参数
  let { pageSize, currentPage } = req.query;
  // 默认值
  limit = pageSize ? Number(pageSize) : 10;
  offset = currentPage ? currentPage : 1;
  offset = (offset - 1) * pageSize;
  let where = {};
  let username = req.query.username;
  let status = req.query.status;
  if (username) {
    where.username = { [Op.like]: `%${username}%` };
  }
  if (Number(status) === 0 || Number(status) === 1) {
    where.status = { [Op.eq]: status };
  }
  UsersModel.findAndCountAll({
    attributes: { exclude: ['password'] },
    include: [{ model: RolesModel }],
    offset: offset,
    limit: limit,
    where: where
  }).then(function (user_roles) {
    return res.send({
      code: 0,
      message: '获取成功',
      data: user_roles
    });
  });
};
/**
 * 删除用户
 */
exports.deleteUser = (req, res) => {
  const user_ids = req.body.id;
  // console.log(user_ids);
  UsersModel.delUser(user_ids || []).then(function (user) {
    if (user !== true) {
      return res.send({
        code: 1,
        message: '删除失败',
        data: null
      });
    }
    return res.send({
      code: 0,
      message: '删除成功',
      data: user
    });
  });
};
/**
 * 重置密码
 */
exports.editPassword = (req, res) => {
  if (req.body.password !== req.body.repassword) {
    return res.send({
      code: 1,
      message: '两次密码输入不一致',
      data: null
    });
  }
  const user_id = req.body.id;
  const old_password = req.body.old_password;
  UsersModel.findOne({ where: { id: user_id } }).then(function (user) {
    if (!user) {
      return res.send({
        code: 1,
        message: '用户不存在',
        data: null
      });
    }
    // 判断密码是否与数据库密码一致
    const compareResult = bcrypt.compareSync(old_password, user.password);
    if (!compareResult) {
      return res.send({
        code: 1,
        message: '原密码不正确',
        data: null
      });
    }
    const data = {
      password: bcrypt.hashSync(req.body.password, 10),
      update_time: new Date()
    };
    const result = UsersModel.update(data, {
      where: {
        id: user_id
      }
    });
    result.then(function (ret) {
      if (ret) {
        return res.send({
          code: 0,
          message: '修改成功',
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
  });
};
/**
 * 根据id获取用户信息接口
 */
// 根据用户的id，获取用户的基本信息
exports.getUserinfoById = (req, res) => {
  let user_id = req.params.id;
  UsersModel.findOne({
    attributes: { exclude: ['password'] },
    include: [{ model: RolesModel }],
    where: {
      id: user_id
    }
  }).then((user) => {
    if (!user) {
      res.send({
        code: 1,
        message: '用户不存在',
        data: null
      });
    } else {
      res.send({
        code: 0,
        message: '获取成功',
        data: user
      });
    }
  });
};
