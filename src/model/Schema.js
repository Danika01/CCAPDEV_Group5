const mongoose = require('../controller/node_modules/mongoose');
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
    password: {
        type: String,   // temporary
        required: true
    },
    aboutInfo: {
        type: String,
        required: true
    },
    type : {
        type: Number,              // 0 for student, 1 for lab-tech
        default: 0,
        required: true
    },
    pfp: String
});

const seatSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    reservations: [
        {
            type: mongoose.ObjectId,
            ref: 'Reservation',
            default: null
        }
    ]
});

const labSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    building: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    seats: [seatSchema]
});

const reservationSchema = new Schema ({
    requestDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    reservationDate: {
        type: Date,
        required: true
    },
    timeIn: {
        type: Date,
        required: true
    },
    timeOut: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.ObjectId,
        ref: 'User'
    }
});

const announcementSchema = new Schema({
    type: String
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Reservation: mongoose.model('Reservation', reservationSchema),
    Lab: mongoose.model('Lab', labSchema),
    Announcement: mongoose.model('Announcement', announcementSchema)
}