'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcrypt')
module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('12345678', 10)

        return await queryInterface.bulkInsert('Admins', [{
          name: 'Admin',
          email: 'admin@email.com',
          password:hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }]);

  },

  async down (queryInterface, Sequelize) {

    return await queryInterface.bulkDelete('Admin', null, {});
  }
};
