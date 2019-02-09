'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('idol', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    firstname: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lastname: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    img_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    page_id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  });
};
