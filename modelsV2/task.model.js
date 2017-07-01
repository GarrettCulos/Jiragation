module.exports = function (sequelize, DataTypes) {
  var task = sequelize.define('task', {
    task_id:      { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    task_label:   { type: DataTypes.STRING, allowNuyll:false},
    account_id:   { type: DataTypes.INTEGER, allowNull: false},
    priority:     { type: DataTypes.STRING, allowNull: true},
    date_created: { type: DataTypes.DATE, allowNull: false},
    due_date:     { type: DataTypes.DATE, allowNull: true},
    description:  { type: DataTypes.STRING, allowNull: true},
    user_id:      { type: DataTypes.INTEGER, allowNull:false}
  });

  return task;
};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/