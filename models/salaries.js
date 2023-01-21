"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Salaries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Salaries.init(
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      total_working_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_leaves_taken: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      overtime: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_salary_made: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_salary_calculated: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Salaries",
    }
  );
  return Salaries;
};
