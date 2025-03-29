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
    password: {
        type: String,   // temporary
        required: true,
        minLength: 8
    },
    aboutInfo: {
        type: String,
        default: "Hello!"
    },
    isTechnician : {
        type: Boolean,
        default: false,
    },
    pfp: {
        type: String,
        default: "/Images/default.png",
    },
    lastLogin: Date,
    rememberMe: {
        type: Boolean,
        default: false,
    }
});

const seatSchema = new Schema({
    seatNum: {
        type: Number,
        required: true
    },
    roomNum: {
        type: String,
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

const buildingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nickname: String
})

const labSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    building: {
        type: mongoose.ObjectId,
        ref: 'Building',
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    seats: [
        {
            type: mongoose.ObjectId,
            ref: 'Seat'
        }
    ],
    available: {
        type: Boolean,
        default: true
    }
});

const reservationSchema = new Schema ({
    requestDate: {
        type: Date,
        default: Date.now, // date stamp on document creation
        required: true
    },
    reservationDate: {
        type: String,
        required: true
    },
    timeIn: {
        type: String, // changed to string so it only will use the time
        required: true
    },
    timeOut: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.ObjectId,
        ref: 'User'
    },
    seat: {
        type: mongoose.ObjectId,
        ref: 'Seat'
    },
    anonymous: {
        type: Boolean,
        default: false
    }
});

const announcementSchema = new Schema({
    type: String
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Reservation: mongoose.model('Reservation', reservationSchema),
    Building: mongoose.model('Building', buildingSchema),
    Lab: mongoose.model('Lab', labSchema),
    Seat: mongoose.model('Seat', seatSchema),
    Announcement: mongoose.model('Announcement', announcementSchema)
}