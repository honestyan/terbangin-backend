"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  Transaction.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      payment_id: DataTypes.STRING,
      pax: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      payment_link: DataTypes.STRING,
      status: DataTypes.ENUM(
        "unpaid",
        "pending",
        "settlement",
        "cancel",
        "expire",
        "refund",
        "fraud"
      ),
      eticket: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
