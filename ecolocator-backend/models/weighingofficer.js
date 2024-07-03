'use strict';
module.exports = (sequelize, DataTypes) => {
  const WeighingOfficer = sequelize.define('WeighingOfficer', {
    Email: {
      type: DataTypes.STRING,
      unique: true,
    },
    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    Hashed_Password: DataTypes.STRING,
    RegistrationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    CenterID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'RecyclingCenters', // assuming you have a RecyclingCenters table
        key: 'CenterID',
      },
    },
  }, {});
  WeighingOfficer.associate = function(models) {
    // associations can be defined here
  };
  return WeighingOfficer;
};
