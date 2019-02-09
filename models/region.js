'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('region', {
    id: {type: DataTypes.INTEGER, primaryKey:true},
    name: DataTypes.TEXT,
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
};
