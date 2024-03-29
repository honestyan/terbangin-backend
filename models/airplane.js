"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airplane extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Airplane.belongsTo(models.Airline, {
        foreignKey: "airline_id",
        as: "airline",
      });
    }
  }
  Airplane.init(
    {
      name: DataTypes.STRING,
      capacity: DataTypes.INTEGER,
      airline_id: DataTypes.INTEGER,
      total_seat_row: DataTypes.INTEGER,
      total_seat_column: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Airplane",
    }
  );
  return Airplane;
};
