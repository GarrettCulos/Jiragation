module.exports = function (sequelize, DataTypes) {
  var note = sequelize.define('note', {
    note_id:      { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    task_id:      { type: DataTypes.STRING, allowNull: true},
    description:  { type: DataTypes.STRING, allowNull: false},
    is_active:    { type: DataTypes.INTEGER, allowNull: false},
    user_id:      { type: DataTypes.INTEGER, allowNull:false}
  });

  return note;
};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/