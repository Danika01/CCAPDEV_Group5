const mongoose = require("mongoose");
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
    role: {
        User: Number,
        Technician: Number
    },
    refreshToken: Number
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
    floor: {
        type: Number,
        required: true
    },
    buildingId: {
        type: Schema.Types.ObjectId,
        ref: "Building",
        required: true
    },
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
    User: mongoose.models('User', userSchema),
    Reservation: mongoose.models('Reservation', reservationSchema),
    Building: mongoose.models('Building', buildingSchema),
    Lab: mongoose.models('Lab', labSchema),
    Seat: mongoose.models('Seat', seatSchema),
    Announcement: mongoose.models('Announcement', announcementSchema)
}