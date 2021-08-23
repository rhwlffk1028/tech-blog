const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// homepage
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
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

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// signup page
router.get('/signup', (req, res) => {
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
        console.log(postData);
        const post = postData.get({ plain: true });

        res.render('singlePost', {
            post,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;