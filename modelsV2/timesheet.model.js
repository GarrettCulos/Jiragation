module.exports = function (sequelize, DataTypes) {
  var timesheet = sequelize.define('time_sheet', {
    task_id:      { type: DataTypes.STRING, allowNull:false},
    start_time:   { type: DataTypes.BIGINT, allowNull: false},
    end_time:     { type: DataTypes.BIGINT, allowNull: true, defaultValue:null},
    account_id:   { type: DataTypes.INTEGER, allowNull:false},
    user_id:      { type: DataTypes.INTEGER, allowNull:false}
  },
  {
      timestamps: false,
      tableName: 'time_sheet'
  });

  return timesheet;
};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/