const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('./init');
const tools = require('../utils/tools');
const Op = Sequelize.Op;
const RolesModel = require('./roles');
// 定义表的模型
const MenusModel = sequelize.define('menus', {
  menu_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  parent_id: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  title: {
    type: Sequelize.STRING(255),
    defaultValue: ''
  },
  sort: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  type: {
    type: Sequelize.CHAR(1),
    defaultValue: 'C'
  },
  icon: {
    type: Sequelize.STRING(255)
  },
  name: {
    type: Sequelize.STRING(255)
  },
  component: {
    type: Sequelize.STRING(255)
  },
  path: {
    type: Sequelize.STRING(255)
  },
  permission: {
    type: Sequelize.STRING(255)
  },
  redirect: {
    type: Sequelize.STRING(255)
  },
  hidden: {
    type: Sequelize.TINYINT(1)
  },
  update_time: {
    type: Sequelize.DATE,
    get() {
      return this.getDataValue('update_time')
        ? moment(this.getDataValue('update_time')).format('YYYY-MM-DD HH:mm:ss')
        : null;
    }
  },
  create_time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
});

MenusModel.getListTree = async function (where = {}) {
  let menus = [];
  if (where.title) {
    menus = await MenusModel.findAll({
      where: {
        title: {
          [Op.like]: `%${where.title}%`
        }
      },
      order: [['sort', 'DESC']]
    });
  } else {
    menus = await MenusModel.findAll({
      order: [['sort', 'DESC']]
    });
  }
  const menusArr = menus.map(function (item) {
    return item.get({ plain: true });
  });
  return tools.getTreeData(menusArr, null, 'menu_id');
};

// 删除菜单、子菜单及其角色表中含有菜单的记录
MenusModel.deleteMenu = async function (menu_id) {
  const t = await sequelize.transaction();
  try {
    // 要删除的菜单及按钮的id
    let menu_button_ids = [];
    // 要删除的菜单id
    let menu_ids = [];
    // 要删除的按钮及它们的父id
    let del_button = {
      menu_id: 0,
      btns: []
    };
    // 得到所有将被删除的菜单
    const menus = await MenusModel.findAll({
      where: { [Op.or]: [{ menu_id: menu_id }, { parent_id: menu_id }] }
    });
    // 将这些菜单id按按钮和菜单分开
    menus.forEach((item) => {
      menu_button_ids.push(item.menu_id);
      if (item.type !== 'B') menu_ids.push(item.menu_id);
      else {
        del_button.menu_id = item.parent_id;
        del_button.btns.push(item.permission);
      }
    });
    // 删除菜单表中的记录
    await MenusModel.destroy({
      where: { menu_id: menu_button_ids }
    });
    // 先找出所有含有菜单和按钮的角色
    const roles = await RolesModel.findAll({
      where: {
        menu_ids: { [Op.not]: null }
      },
      attributes: ['role_id', 'menu_ids', 'buttons']
    });
    const rolesArr = roles.map((item) => item.get({ plain: true }));
    // 如果menu_ids不为空则删除角色表中的menu_ids数组中对应id
    if (menu_ids && menu_ids.length) {
      rolesArr.forEach((item) => {
        // console.log(menu_ids);
        // console.log(item.menu_ids);
        const remain_menu_ids = tools.minustArr(item.menu_ids, menu_ids);
        RolesModel.update(
          { menu_ids: remain_menu_ids },
          {
            where: { role_id: item.role_id }
          }
        );
        // 如果含有按钮，看是否存在需要删除的删去对应的按钮
        if (del_button.btns && del_button.btns.length) {
          const remain_buttons = [];
          item.buttons.forEach((button) => {
            if (button.menu_id === del_button.menu_id) {
              const remain_button_item = {
                menu_id: del_button.menu_id,
                btns: tools.minustArr(button.btns, del_button.btns)
              };
              remain_buttons.push(remain_button_item);
            } else {
              remain_buttons.push(button);
            }
          });
          RolesModel.update(
            { buttons: remain_buttons },
            {
              where: { role_id: item.role_id }
            }
          );
        }
      });
    } else if (!menu_ids.length && del_button.btns && del_button.btns.length) {
      rolesArr.forEach((item) => {
        item.buttons.forEach((button) => {
          if (button.menu_id === del_button.menu_id) {
            const remain_buttons = [];
            item.buttons.forEach((button) => {
              if (button.menu_id === del_button.menu_id) {
                const remain_button_item = {
                  menu_id: del_button.menu_id,
                  btns: tools.minustArr(button.btns, del_button.btns)
                };
                remain_buttons.push(remain_button_item);
              } else {
                remain_buttons.push(button);
              }
            });
            RolesModel.update(
              { buttons: remain_buttons },
              {
                where: { role_id: item.role_id }
              }
            );
          }
        });
      });
    }
    return true;
  } catch (e) {
    t.rollback();
    return e.message;
  }
};
module.exports = MenusModel;
