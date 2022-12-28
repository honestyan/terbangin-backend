"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "BookingDetails", // table name
        "title", // new field name
        {
          type: Sequelize.ENUM("Mr", "Mrs"),
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        "BookingDetails", // table name
        "ticketNum", // new field name
        {
          type: Sequelize.ENUM("Mr", "Mrs"),
          allowNull: true,
        }
      ),
      queryInterface.addColumn(
        "BookingDetails", // table name
        "isCheckIn", // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        }
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
