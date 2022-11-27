const mongoose = require('mongoose');
const User = require('./model.user');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        validate: {
            validator: (value) => ifUserExists(value),
            message: 'User does not exist'
        }
    }
});

const ifUserExists = async function(value) {
    try{
        const user = await User.findOne({"_id":value});
        return user;
    }
    catch(err){
        return false;
    }
};

module.exports = mongoose.model('RefreshToken', tokenSchema);