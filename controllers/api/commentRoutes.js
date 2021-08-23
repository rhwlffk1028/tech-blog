const router = require('express').Router();
const { Comment } = require('../../models');
const auth = require('../../utils/auth');

// Get all comments
router.get("/", async (req, res) => {
    try {
        const commentData = await Comment.findAll({});
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Post a comment
router.post('/', auth, (req, res) => {
  // check the session
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      // use the id from the session
      user_id: req.session.user_id,
    })
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
});

// delete comment
router.delete('/:id', auth, async (req, res) => {
    try {
        const commentData = await Comment.destroy({
            where: {
                id: req.params.id,
            }
        });

        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;