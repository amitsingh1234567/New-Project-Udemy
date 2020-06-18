const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
// User Model
const User = require('../models/user');


router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        success: true,
                        msg: 'User created',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Invalid authentication credentials!'
                    });
                });
        });
});


router.post('/login', (req, res) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            fetchedUser = user;
            if (!user) {
                return res.status(401).json({
                    message: 'User not found with this E-Mail'
                });
            }
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {

            if (!result) {
                return res.status(401).json({
                    message: 'Password Incorrect'
                });
            }
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
                'secret_this_should_be_longer',
                { expiresIn: '1h' }
            );

            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Invalid authentication credentials!'
            });
        })
})

module.exports = router;