'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChildCategory = sequelize.define('ChildCategory', {
    categoryId: DataTypes.INTEGER,
    subCatId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  ChildCategory.associate = function(models) {
    // associations can be defined here
    models.ChildCategory.belongsTo(models.category, { foreignKey: 'categoryId' });

  };
  return ChildCategory;
};