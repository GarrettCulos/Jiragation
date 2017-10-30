module.exports = {
  up: function(queryInterface, Sequelize){
    return queryInterface.createTable('note', {
      id:           { type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
      task_id:      { type: DataTypes.STRING, allowNull: true},
      account_id:   { type: DataTypes.INTEGER, allowNull: true},
      project_id:   { type: DataTypes.INTEGER, allowNull: true},
      sprint_id:    { type: DataTypes.INTEGER, allowNull: true},
      note:         { type: DataTypes.STRING, allowNull: false},
      is_active:    { type: DataTypes.INTEGER, allowNull: false},
      expired_to:   { type: DataTypes.INTEGER, allowNull: true},
      user_id:      { type: DataTypes.INTEGER, allowNull: false},
      type_id:      { type: DataTypes.INTEGER, allowNull: false}
    })
  },
  down: function(queryInterface, Sequelize){
    return queryInterface.dropTable('note');
  })
}