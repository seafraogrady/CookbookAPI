const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();
const passport = require('passport');
const jwt = require("jsonwebtoken");
const { Users, User } = require('../models/users');
const router = express.Router();

router.post('/local', passport.authenticate('local', { session: false }),
    async (req, res) => {
        console.log('logged in');

        let payload = {};
        payload.name = req.user.username;

        console.table(payload);

        let token = jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: 60 * 5 });
        res.status(201).json({ accesstoken: token });
        console.log('login sucess');

        })

router.post('/', async (req, res) => {
    console.table(req.body);

    try {
        let user = await User.register(
            new User({
                email: req.body.email,
                username: req.body.username,
                roles:req.body.roles
            }),
            req.body.password);

        res.location(user._id)
            .status(201)
            .json(user._id);

    }
    catch (error) {
        res.status(400).json({ error: error });
        return;
    }
})

module.exports = router