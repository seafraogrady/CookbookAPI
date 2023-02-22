require('dotenv').config();
const express = require('express');
const passport = require('passport');
const jwt = require("jsonwebtoken");
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

module.exports = router
