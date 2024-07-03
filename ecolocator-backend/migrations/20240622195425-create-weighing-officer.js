'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WeighingOfficers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Email: {
        type: Sequelize.STRING,
        unique: true,
      },
      FirstName: {
        type: Sequelize.STRING,
      },
      LastName: {
        type: Sequelize.STRING,
      },
      Hashed_Password: {
        type: Sequelize.STRING,
      },
      RegistrationDate: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      CenterID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'RecyclingCenters', // Assuming you have a RecyclingCenters table
          key: 'CenterID',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WeighingOfficers');
  }
};
