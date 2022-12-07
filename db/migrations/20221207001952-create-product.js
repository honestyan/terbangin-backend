'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      iata_from: {
        type: Sequelize.STRING
      },
      iata_to: {
        type: Sequelize.STRING
      },
      date_departure: {
        type: Sequelize.DATE
      },
      date_arrival: {
        type: Sequelize.DATE
      },
      est_time: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      gate: {
        type: Sequelize.INTEGER
      },
      airplane_id: {
        type: Sequelize.INTEGER
      },
      airline_id: {
        type: Sequelize.INTEGER
      },
      stock: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Products');
  }
};