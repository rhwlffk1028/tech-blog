const { Comment } = require('../models');

const commentData = [
  {
    comment_text: 'test1 looks cool.',
    user_id: 2,
    post_id: 1
  },
  {
    comment_text: 'test2 looks cool.',
    user_id: 1,
    post_id: 2
  }
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;