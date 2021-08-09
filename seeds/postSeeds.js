const { Post } = require('../models');

const postData = [
  {
    title: 'Title test 1',
    post_content: 'This is test1.',
    user_id: 1
  },
  {
    title: 'Title test 2',
    post_content: 'This is test2.',
    user_id: 2
  }
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;