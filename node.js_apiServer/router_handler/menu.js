const MenusModel = require('../model/menus');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

function filterRoutes(routes) {
  const res = [];
  routes.forEach((item) => {
    if (item.children) {
      if (item.children[0].type === 'B') {
        const perms = [];
        item.children.forEach((item) => {
          perms.push({
            value: item.menu_id,
            label: item.title,
            permission: item.permission
          });
        });
        const menuItem = {
          value: item.menu_id,
          label: item.title,
          perms: perms || undefined
        };

        res.push(menuItem);
      } else {
        const menuItem = {
          value: item.menu_id,
          label: item.title,
          children: item.children || undefined
        };
        if (menuItem.children && menuItem.children.length) {
          menuItem.children = filterRoutes(menuItem.children);
        }
        res.push(menuItem);
      }
    } else {
      const menuItem = {
        value: item.menu_id,
        label: item.title
      };

      res.push(menuItem);
    }
  });
  return res;
}
exports.getMenuList = (req, res) => {
  MenusModel.getListTree(req.query).then(function (menuTree) {
    return res.send({
      code: 0,
      message: '获取成功',
      data: menuTree || []
    });
  });
};

exports.getMenuOptions = (req, res) => {
  MenusModel.getListTree(req.query).then(function (menuTree) {
    const filterTree = filterRoutes(menuTree);
    return res.send({
      code: 0,
      message: '获取成功',
      data: filterTree || []
    });
  });
};

exports.addMenu = (req, res) => {
  MenusModel.create(req.body).then(function (menu) {
    if (!menu) {
      return res.send({
        code: 1,
        message: '创建失败',
        data: null
      });
    }
    return res.send({
      code: 0,
      message: '创建成功',
      data: menu.menu_id
    });
  });
};

exports.editMenu = (req, res) => {
  delete req.body.menu_id;
  const data = req.body;
  console.log(req.body);
  data.update_time = new Date();
  MenusModel.update(data, {
    where: {
      menu_id: req.query.menu_id || 0
    }
  }).then(function (menu) {
    if (!menu) {
      return res.send({
        code: 1,
        message: '修改失败',
        data: null
      });
    }
    return res.send({
      code: 0,
      message: '修改成功',
      data: menu
    });
  });
};

exports.deleteMenu = (req, res) => {
  // MenusModel.destroy({
  //   where: {
  //     [Op.or]: [{ menu_id: req.body.id }, { parent_id: req.body.id }]
  //   }
  // }).then(function (menu) {
  //   return res.send({
  //     code: 0,
  //     message: '删除成功',
  //     data: menu
  //   });
  // });
  MenusModel.deleteMenu(req.body.id).then(function (menu) {
    if (menu !== true) {
      return res.send({
        code: 1,
        message: '删除失败',
        data: null
      });
    }
    return res.send({
      code: 0,
      message: '删除成功',
      data: menu
    });
  });
};

exports.getOneMenu = (req, res) => {
  MenusModel.findOne({
    where: {
      menu_id: req.query.menu_id
    }
  }).then(function (menu) {
    return res.send({
      code: 0,
      message: '获取成功',
      data: menu
    });
  });
};
