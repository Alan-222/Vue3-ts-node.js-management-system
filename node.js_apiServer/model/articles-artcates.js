const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('./init');

// 定义表的模型
const ArticlesArtcatesModel = sequelize.define('articles_artcates', {
  article_artcate_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  article_id: {
    type: Sequelize.INTEGER
  },
  artcate_id: {
    type: Sequelize.INTEGER
  },
  create_time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
});

module.exports = ArticlesArtcatesModel;
