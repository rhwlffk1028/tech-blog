const router = require('express').Router();
const sequelize = require('../config/connection');
const {User,Post,Comment} = require('../models');

router.get('/', async (req, res) => {
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

        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', async (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', async (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});

router.get('/post/:id', async (req, res) => {
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

        res.render('singlePost', {
            posts,
            loggedIn: req.session.loggedIn
        });

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
