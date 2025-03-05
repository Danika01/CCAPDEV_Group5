const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema ({
    time: Date
});

module.exports = mongoose.models('Reservation', reservationSchema);