var uuidv4      = require('uuid/v4') 

module.exports = function (sequelize, DataTypes) {
  var users = sequelize.define('users', {
    id:               { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    first_name:       { type: DataTypes.STRING, allowNull:true},
    last_name:        { type: DataTypes.STRING, allowNull: true},
    user_name:        { type: DataTypes.STRING, allowNull: false},
    password:         { type: DataTypes.STRING, allowNull: false},
    is_admin:         { type: DataTypes.INTEGER, allowNull: false},
    is_active:        { type: DataTypes.INTEGER, allowNull: false},
    email_address:    { type: DataTypes.STRING, allowNull: false},
    socket_guid:      { type: DataTypes.STRING, allowNull:false, default: uuidv4()}
  },{
    timestamps : false,
    freezeTableName: true
  });

  return users;
};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/