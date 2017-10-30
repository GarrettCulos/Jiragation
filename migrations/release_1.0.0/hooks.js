module.exports = {
  up: function(queryInterface, Sequelize){
    return queryInterface.createTable('hooks', {
      id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
      account_id:    { type: DataTypes.INTEGER, allowNull: false},
      hash:          { type: DataTypes.STRING, allowNull: false},
      hook_type:     { type: DataTypes.STRING, allowNull: false},
      hook_info:     { type: DataTypes.STRING, allowNull: false},
    },
    {
       timestamps : false,
       freezeTableName: true
    })
  },
  down: function(queryInterface, Sequelize){
    return queryInterface.dropTable('hooks');
  })
}