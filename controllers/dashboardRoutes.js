const router = require('express').Router();
const sequelize = require('../config/connection');
const {User,Post,Comment} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: [
                'id',
                'title',
                'post_content',
                'user_id',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ["id", "comment_text", "user_id", "post_id", "created_at"],
                    include: [{model: User, attributes: ["username"]}]
                },
                {
                    model: User,
                    attributes: ["username"],
                },
            ]
        });

        const posts = postData.map((post) => post.get({plain:true}));

        res.render('dashboard', {
            posts,
            loggedIn: true
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/create', withAuth, (req, res) => {
    res.render('createPost', {
        loggedIn: true
    });
});

router.get('/update/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'post_content',
                'user_id',
                'created_at'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ["id", "comment_text", "user_id", "post_id", "created_at"],
                    include: [{model: User, attributes: ["username"]}]
                },
                {
                    model: User,
                    attributes: ["username"],
                },
            ]
        });

        if (!postData) {
            res.status(400).json({message: "No post found with this id!"});
            return;
        }

        const posts = postData.map((post) => post.get({plain:true}));

        res.render('updatePost', {
            posts,
            loggedIn: true
        });

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;