const router = require('express').Router();
const sequelize = require('../config/connection');
const {User,Post,Comment} = require('../models');

// dashboard page
router.get('/dashboard', async (req, res) => {
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

        const myposts = mypostData.map((post) => post.get({plain:true}));

        res.render('dashboard', {
            myposts,
            loggedIn: req.session.loggedIn
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard/create', async(req, res) => {
    try {
        const createData = Post.findAll({
            where:{
                user_id: req.session.user_id
            },
            attributes: ['id', 'title', 'created_at', 'post_content'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        const posts = postData.map((post) => post.get({plain:true}));

        res.render('createPost', {
            posts,
            loggedIn: true
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard/update/:id', async (req, res) => {
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

        const post = postData.map((post) => post.get({plain:true}));

        res.render('updatePost', {
            post,
            loggedIn: true
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;