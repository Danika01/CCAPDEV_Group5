const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number
        },
        Technician: Number
    },
    refreshToken: Number
});

module.exports = mongoose.models('User', userSchema);