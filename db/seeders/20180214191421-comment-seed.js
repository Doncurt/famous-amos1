'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  return queryInterface.bulkInsert('Comments', [
    {
        body:"Hello happy doggy.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        body:"Hey what's up.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        body:"Great dog. Very wow.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        body:"I like turtles.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        body:"I bought this dog, but the shipper never sent it.  Can I get a refund?",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        body:"This dog is great to dress up as a clown.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        body:"If you buy a lion's mane for this dog, then people wont know that you don't have a pet lion.",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        body:"If dogs ruled the earth, there wouldn't be any wars.",
        createdAt: new Date(),
        updatedAt: new Date()
    }
], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
      },
};
