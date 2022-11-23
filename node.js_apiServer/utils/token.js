/**
 * Created by Administrator on 2020/12/21.
 * 生成token和refresh方法
 */
const jwt = require('jsonwebtoken');
const tkconf = require('../config/index');
const addToken = function (user, serect, time) {
  //创建token并导出

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    serect,
    { expiresIn: time + 's' }
  );
  return token;
};

const decodedToken = function (token) {
  const decoded = jwt.decode(token);
  return decoded;
};

const verifyToken = function verify_refreshToken(refreshToken) {
  return jwt.verify(refreshToken, tkconf.jwtRefrechSecretKey, (err, decode) => {
    return err ? err : 1;
  });
};

module.exports = {
  addToken,
  decodedToken,
  verifyToken
};
