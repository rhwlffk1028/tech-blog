const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const auth = require('../../utils/auth');
const bcrypt = require('bcrypt');

// get all users '/api/users'
router.get("/", (req, res) => {
    User.findAll({
        attributes: { exclude: ['created_at'] }
    })
        .then(userData => {
            res.status(200).json(userData);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// get specific user /api/users/id
router.get("/:id", (req, res) => {
    User.findOne(
        {
            where: {
                user_id: req.params.id
            },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'post_content', 'created_at']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'created_at'],
                    include: {
                        model: Post,
                        attributes: ['title']
                    }
                }]
        })
        .then(userData => {
            if (!userData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }

            res.status(200).json(userData);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

// create a user
router.post("/", (req, res) => {
    User.create(req.body)
        .then(userData => {
            req.session.save(() => {
                req.session.username = userData.username;
                req.session.user_id = userData.id;
                req.session.loggedIn = true;

                res.status(200).json(userData);
            });
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

// login user
router.post('/login', async (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(userData => {
            if (!userData) {
                res.status(400).json({ message: 'Incorrect email or password, please try again' });
                return;
            }

            const validatePassword = bcrypt.compareSync(req.body.password, userData.password);

            if (!userData || !validatePassword) {
                res.status(400).json({ message: 'Incorrect email or password, please try again' });
                return;
            }

            req.session.save(() => {
                req.session.username = userData.username;
                req.session.user_id = userData.id;
                req.session.loggedIn = true;

                res.json({ user: userData, message: 'You are now logged in!' });
            });

        })
        .catch(err => {
            res.status(400).json(err);
        })
});

// Logout user
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end(console.log('Now you are logged out'));
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;