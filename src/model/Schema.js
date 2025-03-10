const mongoose = require('../controller/node_modules/mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
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
        type: String,
        required: true
    },
    aboutInfo: {
        type: String,
        required: true
    },
    type : {
        type: String,
        required: true
    },
    pfp: String
});

const reservationSchema = new Schema ({
    /*userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    labID: {
        type: Schema.Types.ObjectId,
        ref:'Lab',
        required: true
    },*/
    email: String,
    requestDate: {
        type: Date,
        required: true
    },
    reservationDate: {
        type: Date,
        required: true
    },
    /*timeIn: {
        type: Date,
        required: true
    },
    timeOut: {
        type: Date,
        required: true
    },*/
    reservationTime: String,
    room: {
        type: String,
        required: true
    },
    seatNumber: Number
});


const labSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    building: String,
    /*buildingId: {
        type: Schema.Types.ObjectId,
        ref: "Building",
        required: true
    },*/
    capacity: {
        type: Number,
        required: true
    }
})
/*
const buildingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nickname: String,           // Shortcut names for buildings (i.e. Goks)
}); */

const announcementSchema = new Schema({
    type : String
});

const unavailableRoomSchema = new Schema ({
    room: String,
    date: String,
    status: String
})

const seatSchema = new Schema ({
    seatNum: Number,
    roomNum: String,
    reservation: Object
})

module.exports = {
    User: mongoose.model('User', userSchema),
    Reservation: mongoose.model('Reservation', reservationSchema),
   // Building: mongoose.model('Building', buildingSchema),
    Lab: mongoose.model('Lab', labSchema),
    Unavailableroom: mongoose.model('Unavailableroom', unavailableRoomSchema),
    Seat: mongoose.model('Seat', seatSchema),
    Announcement: mongoose.model('Announcement', announcementSchema)
}