module.exports = function (sequelize, DataTypes) {
  var note_meta = sequelize.define('note_meta', {
    id:             { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    note_id:        { type: DataTypes.INTEGER, allowNull: false},
    meta_relation:  { type: DataTypes.STRING, allowNull: false},
    type_id:        { type: DataTypes.INTEGER, allowNull: true}
  },
  {
     timestamps : false,
     freezeTableName: true
  });

  return note_meta;
};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/