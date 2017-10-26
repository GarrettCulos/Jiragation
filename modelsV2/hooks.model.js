module.exports = function (sequelize, DataTypes) {
  var hooks = sequelize.define('hooks', {
    id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    account_id:    { type: DataTypes.INTEGER, allowNull: false},
    hash:          { type: DataTypes.STRING, allowNull: false},
    hook_type:     { type: DataTypes.STRING, allowNull: false},
    hook_info:     { type: DataTypes.STRING, allowNull: false},
  },
  {
     timestamps : true,
     freezeTableName: true
  });

  return hooks

};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/