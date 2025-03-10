const mongoose = require("mongoose");
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
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    labID: {
        type: Schema.Types.ObjectId,
        ref:'Lab',
        required: true
    },
    requestDate: {
        type: Date,
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
    seatNumber: Number
});


const labSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: "Building",
        required: true
    },
    capacity: {
        type: Number,
        required: true
    }
})

const buildingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nickname: String,           // Shortcut names for buildings (i.e. Goks)
});

const announcementSchema = new Schema({
    type : String
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Reservation: mongoose.model('Reservation', reservationSchema),
    Building: mongoose.model('Building', buildingSchema),
    Lab: mongoose.model('Lab', labSchema),
    Announcement: mongoose.model('Announcement', announcementSchema)
}