const Sequelize = require('sequelize');
const moment = require('moment');
const sequelize = require('./init');
const ArtcateModel = require('./artcate');
const ArticlesArtcatesModel = require('./articles-artcates');
const tools = require('../utils/tools');
const UsersModel = require('./users');
// 定义表的模型
const ArticleModel = sequelize.define('articles', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING(255)
  },
  content: {
    type: Sequelize.TEXT
  },
  cover_img: {
    type: Sequelize.STRING(255)
  },
  state: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },
  status: {
    type: Sequelize.TINYINT,
    defaultValue: 1
  },
  author_id: {
    type: Sequelize.INTEGER
  },
  check_state: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },
  auditor: {
    type: Sequelize.STRING(255)
  },
  check_reason: {
    type: Sequelize.STRING(255)
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

ArticleModel.addArticle = async function (data) {
  console.log(data);
  const t = await sequelize.transaction();
  try {
    const article = await ArticleModel.create(data);
    const articles_artcates = data.artcate_ids.map(function (artcate_id) {
      return {
        article_id: article.id,
        artcate_id: artcate_id
      };
    });
    await ArticlesArtcatesModel.bulkCreate(articles_artcates);
    t.commit();
    return article.id;
  } catch (e) {
    t.rollback();
    return e.message;
  }
};

ArticleModel.updateArticle = async function (article_id, data) {
  const t = await sequelize.transaction();
  try {
    console.log(article_id);
    data.update_time = new Date();
    await ArticleModel.update(data, {
      where: {
        id: article_id
      }
    });
    const articles_artcates = await ArticlesArtcatesModel.findAll({
      where: { article_id: article_id }
    });
    const artcate_ids = articles_artcates.map(function (item) {
      return item.artcate_id;
    });
    // 新加的分类
    const add_artcate_ids = tools.minustArr(data.artcate_ids, artcate_ids);
    const add_articles_artcates = add_artcate_ids.map(function (artcate_id) {
      return { article_id: article_id, artcate_id: artcate_id };
    });
    await ArticlesArtcatesModel.bulkCreate(add_articles_artcates);
    // 删除的分类
    const del_artcate_ids = tools.minustArr(artcate_ids, data.artcate_ids);
    if (del_artcate_ids && del_artcate_ids.length > 0) {
      await ArticlesArtcatesModel.destroy({
        where: {
          article_id: article_id,
          artcate_id: del_artcate_ids
        }
      });
    }
    t.commit();
    return true;
  } catch (e) {
    t.rollback();
    return e.message;
  }
};

ArticleModel.delArticle = async function (article_id) {
  const t = await sequelize.transaction();
  try {
    await ArticleModel.destroy({
      where: { id: article_id }
    });
    await ArticlesArtcatesModel.destroy({
      where: { article_id: article_id }
    });
    t.commit();
    return true;
  } catch (e) {
    t.rollback();
    return false;
  }
};

ArticleModel.belongsToMany(ArtcateModel, {
  through: {
    model: ArticlesArtcatesModel
  },
  foreignKey: 'article_id',
  otherKey: 'artcate_id'
});
module.exports = ArticleModel;
