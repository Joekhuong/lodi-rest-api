'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('follow', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idol_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }    
  });
};
