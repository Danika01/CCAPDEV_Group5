const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema ({
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
module.exports = mongoose.models('Reservation', reservationSchema);
