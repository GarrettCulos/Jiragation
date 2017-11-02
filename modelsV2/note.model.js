module.exports = function (sequelize, DataTypes) {
  var note = sequelize.define('note', {
    id:           { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    note:         { type: DataTypes.STRING, allowNull: false},
    is_active:    { type: DataTypes.INTEGER, allowNull: false},
    expired_to:   { type: DataTypes.INTEGER, allowNull: true},
    user_id:      { type: DataTypes.INTEGER, allowNull: false},
  },
  {
     timestamps : true,
     freezeTableName: true
  });

  return note;
};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/