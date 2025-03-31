const Schema = require('./Schema')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// get reservation by id
async function getReservationById(reservationId) {
    try {
        const reservation = await Schema.Reservation.findById(reservationId)
            .populate({
                path: 'seat',
                select: 'seatNum roomNum' 
            })
            .populate({
                path: 'user',
                select: 'name email' 
            })
            .lean()
            .exec();

        console.log("Fetched reservation:", JSON.stringify(reservation, null, 2)); // Log formatted output
        return reservation;
    } catch (error) {
        console.error('Error fetching reservation:', error.message);
        throw error;
    }
}


// Add reservation
async function addReservation(reservationDate, timeIn, timeOut, user, seat, anonymous) {
    try {
        const newReservation = await Schema.Reservation.create({
            requestDate: new Date(),
            reservationDate: String(reservationDate),  
            timeIn: String(timeIn),                    
            timeOut: String(timeOut),                  
            user: new mongoose.Types.ObjectId(user),   
            seat: new mongoose.Types.ObjectId(seat),   
            anonymous: anonymous === 'true'            
        });

        console.log('Reserved successfully!');
        console.log(newReservation);
        return newReservation;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Get user reservation
async function getUserReservations(userId) {
    try {
        const reservations = await Schema.Reservation.find({ user: new ObjectId(userId) })
            .populate({
                path: 'seat', 
                select: 'seatNum roomNum'
            })
            .lean()
            .exec();

        return reservations;
    } catch (error) {
        console.error('Error fetching reservations:', error.message);
        throw error;
    }
}

// Get all reservations
async function getReservations() {
    try {
        return await Schema.Reservation.find().exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

// Get seat reservations
async function getSeatReservations(seatId) {
    try{
        const seat = await Schema.Seat.findById(seatId).populate('reservations').exec();
        console.log("Seat Found!")
        return seat;
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function editReservation(reservationId, date, timeIn, timeOut, seat) {
    try {
        const reservation = await Schema.Reservation.findById(reservationId).exec();
        console.log("Reservation found!");

        reservation.reservationDate = date;
        reservation.timeIn = timeIn;
        reservation.timeOut = timeOut;
        reservation.seat = seat;
        await reservation.save();

        console.log("Reservation successfully edited!");
        return reservation;
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

// Delete reservation
async function deleteReservation(reservationId) {
    try {
        const reserve = await Schema.Reservation.findByIdAndDelete(reservationId);

        if (!reserve) {
            console.log('Reservation not found.');
            return { success: false, message: 'Reservation not found' };
        }

        console.log('Reservation deleted successfully.');
        return { success: true, message: 'Reservation deleted successfully' };
    } catch (error) {
        console.error('Error deleting reservation:', error.message);
        return { success: false, message: error.message };
    }
}

module.exports = {
    addReservation,
    getUserReservations,
    getReservations,
    editReservation,
    getSeatReservations,
    getReservationById,
    deleteReservation
}