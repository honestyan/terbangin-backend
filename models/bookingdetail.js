'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BookingDetail.init({
    transaction_id: DataTypes.INTEGER,
    passenger_name: DataTypes.STRING,
    seat: DataTypes.STRING,
    visa: DataTypes.STRING,
    passport: DataTypes.STRING,
    izin: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BookingDetail',
  });
  return BookingDetail;
};