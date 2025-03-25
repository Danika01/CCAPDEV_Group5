const Schema = require('./Schema')

// Add reservation
function addReservation(requestDate, reservationDate, timeIn, timeOut, user)
{
    try{
        const newReservation = new Reservation({requestDate: requestDate,
            reservationDate: reservationDate,
            timeIn: timeIn,
            timeOut: timeOut,
            user: User
        });
        newReservation.save();
    }
    catch(error){
        console.error('Error.', error.message);
        throw error;
    }

}

// Delete reservation
function deleteReservation(reservationId)
{
    try
    {
        Reservation.findByIdAndDelete(reservationId);
        console.log('Reservation deleted successfully.');
    }
    catch(error)
    {
        console.error('Error deleting reservation:', error.message);
        throw error;
    }
}
