const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/model.user');

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(authHeader){
        const token = authHeader.split(' ')[1]; //Bearer token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if(err) return res.sendStatus(403);
            try{
                await User.findById(user.sub);
                req.user = user;
                next();
            }catch(err){
                return res.sendSatatus(403);
            }
        });
    }else{
        return res.sendStatus(401);
    }
}

module.exports = verifyJWT;