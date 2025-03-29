const Schema = require('./Schema')

// Add reservation
async function addReservation(reservationDate, timeIn, timeOut, user, seat)
{
    try{
        const newReservation = await Schema.Reservation.create({
            requestDate: new Date(),
            reservationDate,
            timeIn,
            timeOut,
            user,
            seat
        });

        console.log('Reserved successfully!');
        return newReservation;
    }
    catch(error){
        console.error('Error.', error.message);
        throw error;
    }

}

async function getUserReservations(userId) {
    try {
        const reservations = Schema.Reservation.find({"user": ObjectId(userId)}).exec();
        console.log("Reservations by user found!");
        return reservations;
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getReservations() {
    try {
        return await Schema.Reservation.find().exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

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
async function deleteReservation(reservationId)
{
    try
    {
        const reserve = await Schema.Reservation.findByIdAndDelete(reservationId).exec();
        console.log('Reservation deleted successfully.');
        return { success: true, message: 'Reservation deleted successfully' };
    }
    catch(error)
    {
        console.error('Error deleting reservation:', error.message);
        return { success: false, message: error.message };
    }
}

module.exports = {
    addReservation,
    getUserReservations,
    getReservations,
    editReservation,
    deleteReservation
}