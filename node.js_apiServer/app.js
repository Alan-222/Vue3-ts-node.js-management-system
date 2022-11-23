const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const joi = require('joi');
// 导入并配置cors中间件
const cors = require('cors');
app.use(cors());
// 配置解析表单数据的中间件，注意：这个中间件只能解析application/x-www-form-urlencoded格式的表单数据
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());
// 暴露静态资源
app.use('/public/avatar', express.static('./public/avatar'));
app.use('/public/upload', express.static('./public/upload'));
// 导入配置文件
const config = require('./config/index');
// 解析 token 的中间件
const expressJWT = require('express-jwt');
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: ['/user/login', '/user/checkCode', '/user/refreshToken'] })
);
// 导入首页数据图模块
const dashboardRouter = require('./router/dashboard');
app.use('/dashboard', dashboardRouter);
// 导入用户路由模块
const userRouter = require('./router/user');
app.use('/user', userRouter);
// 导入用户角色模块
const roleRoute = require('./router/role');
app.use('/user/role', roleRoute);
// 导入用户菜单模块
const menuRouter = require('./router/menu');
app.use('/user/menu', menuRouter);
// 导入用户登录日志模块
const logRouter = require('./router/user-logs');
app.use('/user/log', logRouter);
// 导入用户信息路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);
// 导入文章分类路由模块
const artCateRouter = require('./router/artcate');
app.use('/my/article', artCateRouter);
// 导入文章模块
const articleRouter = require('./router/article');
app.use('/my/article', articleRouter);
// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.send({ code: 1, message: err.message });
  if (err.name === 'UnauthorizedError') return res.send({ code: 401, message: '身份认证失败' });
  if (err.name === 'UnhandledPromiseRejectionWarning') return res.send({ code: 500, message: err.message });
  // 未知错误
  return res.send({ code: 500, message: err });
});
// 启动服务器
app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007');
});
