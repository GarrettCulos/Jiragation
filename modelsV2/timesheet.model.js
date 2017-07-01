module.exports = function (sequelize, DataTypes) {
  var timesheet = sequelize.define('timesheet', {
    task_id:      { type: DataTypes.STRING, allowNull:false},
    start_time:   { type: DataTypes.BIGINT, allowNull: false},
    end_time:     { type: DataTypes.BIGINT, allowNull: false},
    account_id:   { type: DataTypes.INTEGER, allowNull:false},
    user_id:      { type: DataTypes.INTEGER, allowNull:false}
  });

  return timesheet;
};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/