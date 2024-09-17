const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

const router = express.Router();
const saltRounds = 10;

// SIGNUP

router.post('/signup', (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;

    if (email === '' || password === '' || firstName === '' || lastName === '') {
        res.status(400).json({ message: 'Please provide email, password, first name and last name.'});
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({message: 'Please provide a valid email address.'});
        return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!passwordRegex.test(password))  {
        res.status(400).json({ message: 'Password must have at least 8 characters and contain at least one number, one lowercase and one uppercase letter.'})
        return;
    }

    User.findOne({ email })
        .then((foundUser) => {
            if (foundUser) {
                throw new Error('User already exists.');
            }

            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            return User.create({ email, password: hashedPassword, firstName, lastName });
        })

        .then((createdUser) => {
            if (!createdUser) {
                return res.status(500).json({ message: 'Error creating user.' });
            }

            const { _id, email, firstName, lastName } = createdUser;
            const payload = { _id, email, firstName, lastName };
            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: '24h' }
            );
            res.status(201).json({ 
                authToken: authToken,
                user: { _id, email, firstName, lastName }
            });
        })
        .catch(err => {
            if (err.message === 'User already exists.') {
                res.status(400).json({ message: 'User already exists.'});
            } else {
                console.log(err);
                res.status(500).json({ message: 'Internal server error'});
            }
        });
});


// LOGIN 

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    if (email === '' || password === '') {
        res.status(400).json({ message: 'Please provide email and password.'});
        return;
    }

    User.findOne({ email })
    .then((foundUser) => {
        if (!foundUser) {
            res.status(401).json({ message: 'USER_NOT_FOUND'});
            return;
        }
        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
        if (passwordCorrect) {
            const { _id, email, firstName, lastName } = foundUser;
            const payload = { _id, email, firstName, lastName };
            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: '24h'}
            );
            res.status(200).json({ 
                authToken: authToken,
                user: {_id, email, firstName, lastName }
            });
        }
        else {
            res.status(401).json({ message: 'INCORRECT_PASSWORD'})
        }
    })
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

// VERIFY TOKEN STORED ON THE CLIENT

router.get('/verify', isAuthenticated, (req, res, next) => {
    console.log(`req.payload`, req.payload);
    res.status(200).json(req.payload);
});

module.exports = router;
