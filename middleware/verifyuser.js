require('dotenv').config();

import userService from '../models/userService';
import crypto from 'crypto';




import { User } from '../models/users';



import axios from 'axios'



function isValidFaceBookUser(req, res, next) {
    const accessToken = req.body.accessToken;
    console.log('access token from client: ' + accessToken)

    getFacebookData(accessToken).then(
        (data) => {
            console.log (' facebook data '+ JSON.stringify(data));
         
            res.user = {
                facebook_id: data.id, // the facebook id
                name: data.name,
            }
            return next();
        })
        .catch((error) => {
            return res.status(401).send({ errors: 'Unauthorized -from isFacebookValidUser' })
        });
}

async function getFacebookData(access_token) {
    const { data } = await axios({
        url: 'https://graph.facebook.com/v8.0/me/',
        method: 'get',
        params: {
            access_token: access_token,
           
        }
    });
    return data;
};

function findOrCreateFaceBookUser(req, res, next) {
    User.findOne({ facebook_id: res.user })
        .then((user) => {
            if (user) {
                res.locals.auth = {
                    id: user._id,
                    permissionLevel: user.permissionLevel,
                };
            }
            else {
                const newUser = new User(res.locals.auth);
                newUser.permissionLevel = 1;
                res.locals.auth = {
                    id: newUser._id,
                    permissionLevel: newUser.permissionLevel,
                };

                newUser.save()
                    .then((result) => {
                        console.log('user created from facebook');
                    })
                    .catch((error) => {
                        res.status(401).json({ status: 'fail', message: 'failed to create ' + error })
                    });
            }
            next();
        })
}

export default {
     isValidFaceBookUser,
    findOrCreateFaceBookUser
}