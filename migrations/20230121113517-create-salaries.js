'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Salaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: { 
        type: Sequelize.INTEGER,
        allowNull:false,
    },
    month: { 
        type: Sequelize.INTEGER,
        allowNull:false,
    },
    year: {
        type: Sequelize.INTEGER,
        unique: true
    },
    total_working_days: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    total_leaves_taken: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    overtime: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    total_salary_made:{
        type: Sequelize.INTEGER,
        defaultValue: 0,    
    },
    is_salary_calculated:{
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Salaries');
  }
};