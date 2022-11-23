const express = require('express');
const MenusModel = require('../model/menus');
const RoleModel = require('../model/roles');

exports.getList = (req, res) => {
  // 接收前端参数
  let { pageSize, currentPage } = req.query;
  // 默认值
  limit = pageSize ? Number(pageSize) : 10;
  offset = currentPage ? currentPage : 1;
  offset = (offset - 1) * pageSize;
  let where = {};
  let role_name = req.query.role_name;
  if (role_name) {
    where.role_name = { [Op.like]: `%${role_name}%` };
  }
  RoleModel.findAndCountAll({
    offset: offset,
    limit: limit,
    where: where
  }).then(function (roles) {
    return res.send({
      code: 0,
      message: '获取成功',
      data: roles
    });
  });
};

exports.getAllRole = (req, res) => {
  RoleModel.findAll({
    where: {
      status: 1
    }
  }).then(function (roles) {
    return res.send({
      code: 0,
      message: '获取成功',
      data: roles
    });
  });
};

exports.getRoleResource = (req, res) => {
  const role_id = req.query.role_id;
  RoleModel.findOne({
    where: {
      role_id: role_id
    }
  }).then(function (roles) {
    if (!roles) {
      return res.send({
        code: 1,
        massage: '角色不存在！',
        data: null
      });
    }
    let permIds = [];
    let buttons = [];
    if (roles.buttons) {
      roles.buttons.map((item) => {
        item.btns.forEach((element) => {
          buttons.push(element);
        });
      });
      MenusModel.findAll({
        attributes: ['menu_id', 'permission']
      }).then(function (menus) {
        buttons.some((item) => {
          menus.forEach((permission) => {
            if (permission.permission === item) {
              permIds.push(permission.menu_id);
            }
          });
        });
        return res.send({
          code: 0,
          message: '获取成功',
          data: {
            menuIds: roles.menu_ids,
            permIds: permIds,
            buttons: roles.buttons
          }
        });
      });
    } else {
      return res.send({
        code: 0,
        message: '获取成功',
        data: {
          menuIds: roles.menu_ids,
          permIds: []
        }
      });
    }
  });
};

exports.updateRoleResource = (req, res) => {
  const role_id = req.query.role_id;
  const data = req.body;
  data.update_time = new Date();
  RoleModel.update(data, {
    where: {
      role_id: role_id
    }
  }).then(function (resource) {
    if (!resource) {
      return res.send({
        code: 1,
        message: '修改失败',
        data: null
      });
    }
    return res.send({
      code: 0,
      message: '修改成功',
      data: resource
    });
  });
};

exports.addRole = (req, res) => {
  RoleModel.create(req.body).then(function (role) {
    if (!role) {
      return res.send({
        code: 1,
        message: '创建失败',
        data: null
      });
    }
    return res.send({
      code: 0,
      message: '创建成功',
      data: role
    });
  });
};

exports.editRole = (req, res) => {
  const data = req.body;
  data.update_time = new Date();
  RoleModel.update(data, {
    where: req.query
  }).then(function (role) {
    if (!role) {
      return res.send({
        code: 1,
        message: '修改失败',
        data: null
      });
    }
    return res.send({
      code: 0,
      message: '修改成功',
      data: role
    });
  });
};

exports.deleteRole = (req, res) => {
  const role_ids = req.body.role_ids;
  RoleModel.delRole(role_ids || []).then(function (role) {
    if (!role) {
      return res.send({
        code: 1,
        message: '删除失败',
        data: null
      });
    }
    return res.send({
      code: 0,
      message: '删除成功',
      data: role
    });
  });
};

exports.getOneRole = (req, res) => {
  RoleModel.findOne({
    where: req.query
  }).then(function (role) {
    return res.send({
      code: 0,
      message: '获取成功',
      data: role
    });
  });
};
