module.exports = function (sequelize, DataTypes) {
  var accounts = sequelize.define('jira_accounts', {
    id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    protocal:      { type: DataTypes.STRING, allowNull: false},
    user_name:     { type: DataTypes.STRING, allowNull: false},
    url:           { type: DataTypes.STRING, allowNull: false},
    basic_auth:    { type: DataTypes.STRING, allowNull: false},
    account_email: { type: DataTypes.STRING, allowNull: false},
    user_id:       { type: DataTypes.INTEGER, allowNull: false},
  },
  {
     timestamps : true,
     freezeTableName: true
  });

  return accounts

};

/*{
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Blog,{ foreignKey: 'user_id'});
      }
    },*/