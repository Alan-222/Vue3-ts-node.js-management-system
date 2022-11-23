// 处理图片文件中间件
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
// 导入加密模块
const bcrypt = require('bcryptjs');
// 导入模型
const UsersModel = require('../model/users');
const RolesModel = require('../model/roles');
const UserLogsModel = require('../model/user-logs');
const MenusModel = require('../model/menus');
// 获取用户基本信息的处理函数
exports.getUserinfo = (req, res) => {
  const user_id = req.user.id;
  UsersModel.findOne({
    attributes: { exclude: ['password'] },
    include: [{ model: RolesModel }],
    where: {
      id: user_id
    }
  }).then(function (user_roles) {
    if (!user_roles) {
      return res.send({
        code: 1,
        message: '帐号未分配角色',
        data: ''
      });
    }
    let menu_ids = [];
    let buttons = [];
    const role_names = [];
    user_roles.roles.forEach(function (item) {
      if (item.status) {
        menu_ids = menu_ids.concat(item.menu_ids);
        role_names.push(item.role_name);
        item.buttons.forEach(function (button) {
          buttons = buttons.concat(button.btns);
        });
      }
    });
    MenusModel.getListTree({ menu_id: menu_ids }).then(function (menus) {
      return res.send({
        code: 0,
        message: '获取成功',
        data: {
          roles: role_names,
          user_id: user_id,
          name: user_roles.username,
          nickname: user_roles.nickname,
          email: user_roles.email,
          avatar: user_roles.user_pic,
          menus: menus,
          buttons: buttons
        }
      });
    });
  });
};
// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  const user_id = req.user.id;
  const data = req.body;
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
        data: data
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
// 重置密码接口处理函数
exports.updatepwd = (req, res) => {
  if (req.body.password !== req.body.repassword) {
    return res.send({
      code: 1,
      message: '两次密码输入不一致',
      data: null
    });
  }
  const user_id = req.user.id;
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
// 更新用户头像接口
exports.updateAvatar = (req, res) => {
  let user_id = req.user.id;
  let info = {};
  // 初始化处理文件对象
  let form = new formidable.IncomingForm();
  form.uploadDir = './public/avatar'; // 指定解析对象（图片）存放的目录
  form.keepExtensions = true; //保留后缀名

  form.parse(req, function (error, fields, files) {
    if (error) {
      info.code = 1;
      info.message = '上传头像失败';
      info.data = null;
      res.send(info);
    }
    // fields 除了图片外的信息
    // files 图片信息
    // console.log(fields);
    // console.log(files);

    // var fullFileName = fields.name + files.avatar.orginalFilename; // 拼接图片名称：用户名+用户ID+图片名称
    // fs.writeFileSync(`public/avatar/${fullFileName}`, fs.readFileSync(files.avatar.filepath)); // 存储图片到public静态资源文件夹下
    const generateFilename = (originalFilename, path) => {
      let names = originalFilename.split('.');
      path = path.replace('invalid-name', '');
      return `${path}${names[0]}_${req.user.id}.${names[1]}`;
    };

    // 通过fs更改文件名
    const newFilePath = generateFilename(files.file.originalFilename, files.file.filepath);
    fs.rename(files.file.filepath, newFilePath, (err) => {
      if (err) {
        console.log('重命名失败');
        console.log(err);
      } else {
        console.log(
          `已经保存为${generateFilename(files.file.newFilename, files.file.originalFilename, files.file.filepath)}`
        );
      }
    });
    const result = UsersModel.update(
      { user_pic: newFilePath },
      {
        where: {
          id: user_id
        }
      }
    );
    result.then(function (ret) {
      if (ret) {
        return res.send({
          code: 0,
          message: '重置头像成功',
          data: {
            srcUrl: newFilePath
          }
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
