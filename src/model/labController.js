const Schema = require('./Schema');
const mongoose = require('mongoose');

async function getBuildings() {
    try {
        return await Schema.Building.find().lean().exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getBuildingIdByName(buildingName) {
    try {
        const building = await Schema.Building.findOne({ name: buildingName }).lean().exec();
        return building ? building._id : null; 
    } catch (error) {
        console.error('Error finding building ID:', error.message);
        throw error;
    }
}

async function getSeats() {
    try {
        return await Schema.Seat.find().exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getSeatsByBuilding(buildingId) {
    try {
        const seats = await Schema.Lab.find({"building": ObjectId(buildingId)}).populate('seats').exec();
        console.log('Seats found!');
        return seats;
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function findSeat(room, seatNum) {
    try {
        console.log("Searching for seat with:", { room, seatNum });

        const seat = await Schema.Seat.findOne({ roomNum: room, seatNum: seatNum }).exec();
        if (!seat) {
            console.log('Seat not found.');
            return null;
        }
        console.log('Seat found:', seat);
        return seat;
    } catch (error) {
        console.error('Error finding seat:', error.message);
        throw error;
    }
}

// add the new reservation to seat's reservation array
async function addReservationToSeat(seatId, reservationId) {
    try {
        const updatedSeat = await Schema.Seat.findByIdAndUpdate(
            seatId,
            { $push: { reservations: reservationId } }, 
            { new: true }
        );

        console.log("The updated seat is " + updatedSeat);

    } catch (error) {
        console.error('Error updating seat with reservation:', error);
        throw error;
    }
}

// remove reservation from seat 
async function removeReservationFromSeat(seatId, reservationId) {
    try {
        const updatedSeat = await Schema.Seat.findByIdAndUpdate(
            seatId,
            { $pull: { reservations: reservationId } }, 
            { new: true }
        );

        console.log("Updated seat after removing reservation:", updatedSeat);
        return updatedSeat;
    } catch (error) {
        console.error("Error removing reservation from seat:", error);
        throw error;
    }
}


async function getSeatsByLab(roomNum) {
    try {
        const labSeats = await Schema.Lab.findOne({ name: roomNum })
            .populate({
                path: 'seats',
                populate: { path: 'reservations' }
            })
            .lean().exec();

        console.log('Seats found!');
        // console.log(JSON.stringify(lab, null, 2));
        
        return labSeats;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}


async function getLabId(roomNum) {
    try {
        return await Schema.Lab.find({ name: roomNum }).lean().exec();
    } catch (error) {
        console.error('Error fetching lab by lab ID:', error.message);
        throw error;
    }
}

async function getLabs() {
    try {
        return await Schema.Lab.find().lean().exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getLabsByBuildingId(buildingId) {
    try {
        return await Schema.Lab.find({ building: new mongoose.Types.ObjectId(buildingId) }).lean().exec();
    } catch (error) {
        console.error('Error fetching labs by building ID:', error.message);
        throw error;
    }
}

async function getUnavailableLabs() {
    try {
        return await Schema.Lab.find({available: false}).exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

async function getAnnouncements() {
    try {
        return await Schema.Announcement.find().lean().exec();
    } catch (error) {
        console.error('Error.', error.message);
        throw error;
    }
}

module.exports = {
    getBuildings,
    getSeats,
    getLabs,
    getSeatsByLab,
    getSeatsByBuilding,
    getUnavailableLabs,
    getAnnouncements,
    getBuildingIdByName,
    addReservationToSeat,
    removeReservationFromSeat,
    findSeat,
    getLabId,
    getLabsByBuildingId
}