'use strict';
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {});
  category.associate = function(models) {
    // associations can be defined here
    models.category.hasMany(models.SubCategory, { foreignKey: 'categoryId' });
    models.category.hasMany(models.ChildCategory, { foreignKey: 'categoryId' });


  };
  return category;
};