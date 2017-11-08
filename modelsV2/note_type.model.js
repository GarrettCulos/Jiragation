module.exports = function (sequelize, DataTypes) {
  var note_type = sequelize.define('note_type', {
    id:                 { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    type:               { type: DataTypes.INTEGER, allowNull: true},
    type_description:   { type: DataTypes.STRING, allowNull: true}
  },
  {
     timestamps : false,
     freezeTableName: true
  });

  return note_type;
};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/