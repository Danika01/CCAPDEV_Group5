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
    seatID: {
        type: Schema.Types.ObjectId,
        ref: 'Seat',
        required: true
    },
    date: {
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
    availability: Boolean
});

const seatSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lab: {
        type: Schema.Types.ObjectId,
        ref: 'Lab',
        required: true
    },
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
    Seat: mongoose.model('Seat', seatSchema),
    Announcement: mongoose.model('Announcement', announcementSchema)
}