const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('./init');
const ArticlesArtcatesModel = require('../model/articles-artcates');
// 定义表的模型
const ArtcateModel = sequelize.define('artcates', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(255)
  },
  alias: {
    type: Sequelize.STRING(255)
  },
  status: {
    type: Sequelize.TINYINT,
    defaultValue: 0
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

ArtcateModel.delArtcate = async function (artcate_ids) {
  const t = await sequelize.transaction();
  try {
    await ArtcateModel.destroy({
      where: { id: artcate_ids }
    });
    await ArticlesArtcatesModel.destroy({
      where: { artcate_id: artcate_ids }
    });
    t.commit();
    return true;
  } catch (e) {
    t.rollback();
    return false;
  }
};

module.exports = ArtcateModel;
