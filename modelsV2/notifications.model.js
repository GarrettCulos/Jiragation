module.exports = function (sequelize, DataTypes) {
  var notifications = sequelize.define('notifications', {
    id:        { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    data:      { type: DataTypes.STRING, allowNull: false},
    task_id:   { type: DataTypes.STRING, allowNull: false},
    account_id:{ type: DataTypes.INTEGER, allowNull: false},
    status:    { type: DataTypes.INTEGER, allowNull: false},
    user_id:   { type: DataTypes.INTEGER, allowNull: false},
  },
  {
     timestamps : true,
     freezeTableName: true
  });

  return notifications;
};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/