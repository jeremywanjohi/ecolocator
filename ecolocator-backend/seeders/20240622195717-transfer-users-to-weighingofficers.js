'use strict';
const { QueryTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Fetch users with the role of 'weighing_officer'
      const users = await queryInterface.sequelize.query(
        `SELECT * FROM Users WHERE role = 'weighing_officer'`,
        { type: QueryTypes.SELECT }
      );

      // Map the users to the format needed for WeighingOfficers table
      const weighingOfficers = users.map(user => ({
        Email: user.email,
        FirstName: user.first_name,
        LastName: user.last_name,
        Hashed_Password: user.hashed_password,
        RegistrationDate: user.createdAt || new Date(), // Use createdAt or fallback to current date
        CenterID: 1, // Default value for now, update with actual CenterID if needed
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      // Insert the mapped users into WeighingOfficers table
      await queryInterface.bulkInsert('WeighingOfficers', weighingOfficers);
    } catch (error) {
      console.error('Error transferring users to weighingofficers:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all entries from WeighingOfficers table
    await queryInterface.bulkDelete('WeighingOfficers', null, {});
  }
};
