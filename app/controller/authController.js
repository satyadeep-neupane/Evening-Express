const User = require('../model/model.user');
const Token = require('../model/model.token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.attemptLogin = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).send({message: 'Please provide email and password'});

        const user = await User.findOne({'email': email});
        if(!user) return res.status(404).send({message: "User not found with email " + email});

        const validPassword = await bcrypt.compare(password, user.password);
        if(validPassword){
            const accessToken = generateAccessToken(generatePayload(user));
            const refreshToken = generateRefreshToken(generatePayload(user));
            try{
                await Token.create({'token': refreshToken, 'user_id': user._id});
                // res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
                return res.json({
                    user: user,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });    
            }catch(err){
                console.log(err);
                return res.status(401).send({message: 'Something Went Wrong'});
            }
        }else{
            return res.status(401).send({message: 'Invalid Email or Password'});
        }
    }catch(err)
    {
        return res.status(500).send({
            message: err.message || "Some error occurred while attempting the Login."
        });
    }
};

exports.getNewAccessToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    // const refreshToken = req.cookies.refreshToken;
    if(refreshToken == null) return res.status(401).send({message: 'Refresh Token Not Found'});
    try{
        const token = await Token.findOne({'token': refreshToken});
        if(!token) return res.status(401).send({message: 'Refresh Token Not Found'});
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(403).send({message: 'Refresh Token Expired'});
            if(user.sub != token.user_id) return res.status(403).send({message: 'Invalid Refresh Token'});
            const accessToken = generateAccessToken(generatePayload(user));
            return res.json({accessToken: accessToken});
        });
    }catch(err){
        return res.status(500).send({
            message:"Some error occurred while attempting the Login."
        });
    }
}

function generatePayload(user)
{
    return {
        sub: user._id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000) - 30
    }
}

function generateAccessToken(payload) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' });
}

function generateRefreshToken(payload) {
    // expires after 1 day
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
}

// require('crypto').randomBytes(64).toString('hex');