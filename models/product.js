"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      iata_from: DataTypes.STRING,
      iata_to: DataTypes.STRING,
      date_departure: DataTypes.DATE,
      date_arrival: DataTypes.DATE,
      est_time: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      gate: DataTypes.INTEGER,
      airplane_id: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
