const { User } = require('../models');

const userData = [
  {
    username: 'testuser1',
    email: 'testemail1@test.com',
    password: 'testpassword1'
  },
  {
    username: 'testuser2',
    email: 'testemail2@test.com',
    password: 'testpassword2'
  }
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;