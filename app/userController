const User = require('../model/model.user');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.store = async (req, res) => {
    try {
        const hashedPwd = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
        const user = await User.create({
            ...req.body,
            'password': hashedPwd
        });
        return res.send(user);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    }
}

exports.list = async (req, res) => {
    try {
        const users = await User.find();
        return res.send(users);
    } catch (err) {
        return res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    }
}

exports.destroy = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) res.status(404).send({ message: "User not found with id " + req.params.id });
        return res.send({ message: "User deleted successfully!" });
    }catch(err)
    {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.id
        });
    }
}