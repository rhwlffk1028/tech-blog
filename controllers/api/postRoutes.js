const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const auth = require('../../utils/auth');

// get all posts
router.get("/", (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'post_content', 'user_id', 'created_at'],
        include: [
            {
                model: User,
                attributes: ["username"],
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
        .then(postData => res.status(200).json(postData))
        .catch(err => {
            res.status(500).json(err);
        })
});

// get a post by id
router.get("/:id", (req, res) => {
    Post.findByPk(req.params.id, {
        attributes: ['id', 'title', 'post_content', 'user_id', 'created_at'],
        include: [
            {
                model: User,
                attributes: ["username"],
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
        .then(postData => {
            if (!postData) {
                res.status(404).json({ message: 'No post found with this id!' });
                return;
            }

            res.status(200).json(postData);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// create a post only if it's logged in
router.post('/', auth, (req, res) => {
    Post.create({
        title: req.body.title,
        post_content: req.body.post_content,
        user_id: req.session.user_id
    })
        .then(postData => {
            res.status(200).json(postData);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// update a post only if it's logged in
router.put('/:id', auth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            post_content: req.body.post_content
        },
        {
            where: {
                id: req.params.id,
            }
        })
        .then(postData => {
            if (!postData) {
                res.status(404).json({ message: 'No post found with this id!' });
                return;
            }

            res.status(200).json(postData);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// delete a post only if it's logged in
router.delete('/:id', auth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id,
        }
    })
        .then(postData => {
            if (!postData) {
                res.status(404).json({ message: 'No post found with this id!' });
                return;
            }

            res.status(200).json(postData);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

module.exports = router;