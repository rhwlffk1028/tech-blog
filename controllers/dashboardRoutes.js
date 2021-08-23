const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// dashboard
router.get('/', withAuth, async (req, res) => {
    try {
        const mypostData = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: ['id', 'title', 'post_content', 'user_id', 'created_at'],
            include: [
                {
                    model: Comment,
                    attributes: ["id", "comment_text", "user_id", "post_id", "created_at"],
                    include: [{
                        model: User,
                        attributes: ["username"]
                    }]
                },
                {
                    model: User,
                    attributes: ["username"],
                },
            ]
        });

        const posts = mypostData.map((post) => post.get({ plain: true }));

        res.render('dashboard', {
            posts,
            loggedIn: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// edit post
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'created_at',
            'post_content'
        ],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "user_id", "post_id", "created_at"],
                include: [{
                    model: User,
                    attributes: ["username"]
                }]
            },
            {
                model: User,
                attributes: ["username"],
            },
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });

            res.render('editPost', {
                post,
                loggedIn: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create post
router.get('/create/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            // use the ID from the session
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'created_at',
            'post_content'
        ],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "user_id", "post_id", "created_at"],
                include: [{
                    model: User, 
                    attributes: ["username"]
                }]
            },
            {
                model: User,
                attributes: ["username"],
            },
        ]
    })
        .then(dbPostData => {
            // serialize data before passing to template
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('createPost', { posts, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;